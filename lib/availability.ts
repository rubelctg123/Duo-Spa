import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';

export const STANDARD_TIME_SLOTS = [
  '09:30',
  '11:00',
  '13:00',
  '14:45',
  '16:30',
  '18:15',
];

export interface AvailabilityOptions {
  serviceId: string;
  date: string; // YYYY-MM-DD
}

export interface SlotAvailability {
  time: string;
  available: boolean;
  reason?: string;
}

export interface AvailabilityResult {
  success: boolean;
  date: string;
  isClosed?: boolean;
  message?: string;
  service?: {
    id: string;
    name: string;
    format: 'duo' | 'solo';
    durationMinutes: number;
    durationLabel: string;
    totalPrice: number;
  };
  slots: SlotAvailability[];
  error?: string;
}

/**
 * Calculates genuine real-time slot availability based on working therapist rosters,
 * physical room constraints, and existing active reservations in MongoDB.
 */
export async function calculateAvailability(
  db: Db,
  options: AvailabilityOptions
): Promise<AvailabilityResult> {
  const { serviceId, date } = options;

  if (!serviceId || !date) {
    return {
      success: false,
      date: date || '',
      slots: [],
      error: 'Les paramètres serviceId et date sont requis.',
    };
  }

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return {
      success: false,
      date,
      slots: [],
      error: 'Format de date invalide. Format attendu : AAAA-MM-JJ.',
    };
  }

  const [year, month, day] = date.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day, 12, 0, 0);
  if (isNaN(targetDate.getTime())) {
    return {
      success: false,
      date,
      slots: [],
      error: 'Date calendrier inexistante.',
    };
  }

  // Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = targetDate.getDay();

  // Duo Spa is closed on Mondays
  if (dayOfWeek === 1) {
    return {
      success: true,
      date,
      isClosed: true,
      message: 'Le sanctuaire Duo Spa est fermé tous les lundis.',
      slots: STANDARD_TIME_SLOTS.map((time) => ({
        time,
        available: false,
        reason: 'Fermé le lundi',
      })),
    };
  }

  // 1. Fetch Service from MongoDB
  const servicesCollection = db.collection('services');
  let serviceDoc = await servicesCollection.findOne({ slug: serviceId, isActive: true });
  if (!serviceDoc && ObjectId.isValid(serviceId)) {
    serviceDoc = await servicesCollection.findOne({ _id: new ObjectId(serviceId), isActive: true });
  }

  if (!serviceDoc) {
    return {
      success: false,
      date,
      slots: [],
      error: 'Prestation introuvable ou actuellement désactivée.',
    };
  }

  const isDuo = serviceDoc.format === 'duo';
  const durationMinutes = Number(serviceDoc.durationMinutes) || 60;

  // 2. Fetch Active Rooms
  const roomsCollection = db.collection('rooms');
  const allRooms = await roomsCollection.find({ isActive: true }).toArray();

  const duoRooms = allRooms.filter((r) => r.type === 'duo_suite');
  const soloRooms = allRooms; // Both solo cabins and duo suites can accommodate solo if free

  // 3. Fetch Therapists scheduled for this dayOfWeek
  const therapistsCollection = db.collection('therapists');
  const allTherapists = await therapistsCollection.find({ isActive: true }).toArray();

  const scheduledTherapists = allTherapists.filter((t) => {
    if (!t.schedule || !Array.isArray(t.schedule)) return true;
    const daySchedule = t.schedule.find((s: { dayOfWeek: number; isWorking: boolean }) => s.dayOfWeek === dayOfWeek);
    return daySchedule ? daySchedule.isWorking : true;
  });

  const scheduledDuoTherapists = scheduledTherapists.filter((t) => Boolean(t.canDoDuo));

  // 4. Fetch Active Bookings on targetDate
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  const bookingsCollection = db.collection('bookings');
  const dayBookings = await bookingsCollection
    .find({
      status: { $in: ['confirmed', 'pending'] },
      startDateTime: { $lt: endOfDay },
      endDateTime: { $gt: startOfDay },
    })
    .toArray();

  // 5. Evaluate Each Candidate Time Slot
  const slots: SlotAvailability[] = [];

  for (const timeStr of STANDARD_TIME_SLOTS) {
    const [h, m] = timeStr.split(':').map(Number);
    const slotStart = new Date(year, month - 1, day, h, m, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

    // Identify conflicting bookings during this window
    const conflictingBookings = dayBookings.filter((b) => {
      const bStart = new Date(b.startDateTime).getTime();
      const bEnd = new Date(b.endDateTime).getTime();
      return bStart < slotEnd.getTime() && bEnd > slotStart.getTime();
    });

    const busyRoomIds = new Set<string>();
    const busyTherapistIds = new Set<string>();

    for (const b of conflictingBookings) {
      if (b.assignedRoomId) {
        busyRoomIds.add(b.assignedRoomId.toString());
      }
      if (Array.isArray(b.assignedTherapistIds)) {
        for (const thId of b.assignedTherapistIds) {
          busyTherapistIds.add(thId.toString());
        }
      }
    }

    let isSlotAvailable = false;
    let reason = 'Complet';

    if (isDuo) {
      // Duo requires: 1 available duo suite AND 2 available duo therapists
      const availableDuoSuites = duoRooms.filter((r) => !busyRoomIds.has(r._id.toString()));
      const availableDuoTherapists = scheduledDuoTherapists.filter(
        (t) => !busyTherapistIds.has(t._id.toString())
      );

      if (availableDuoSuites.length >= 1 && availableDuoTherapists.length >= 2) {
        isSlotAvailable = true;
        reason = '';
      } else if (availableDuoSuites.length < 1) {
        reason = 'Suite Duo occupée';
      } else {
        reason = 'Thérapeutes non disponibles';
      }
    } else {
      // Solo requires: 1 available room (prefer solo cabin, fallback to duo suite) AND 1 available therapist
      const availableRooms = soloRooms.filter((r) => !busyRoomIds.has(r._id.toString()));
      const availableTherapists = scheduledTherapists.filter(
        (t) => !busyTherapistIds.has(t._id.toString())
      );

      if (availableRooms.length >= 1 && availableTherapists.length >= 1) {
        isSlotAvailable = true;
        reason = '';
      } else if (availableRooms.length < 1) {
        reason = 'Cabines occupées';
      } else {
        reason = 'Thérapeute non disponible';
      }
    }

    slots.push({
      time: timeStr,
      available: isSlotAvailable,
      ...(reason ? { reason } : {}),
    });
  }

  return {
    success: true,
    date,
    isClosed: false,
    service: {
      id: serviceDoc.slug || serviceDoc._id.toString(),
      name: serviceDoc.name,
      format: serviceDoc.format,
      durationMinutes: serviceDoc.durationMinutes,
      durationLabel: serviceDoc.durationLabel,
      totalPrice: serviceDoc.totalPrice,
    },
    slots,
  };
}
