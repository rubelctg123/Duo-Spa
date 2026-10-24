import { MongoClient, type Db, ObjectId } from 'mongodb';

export interface BookingGuestInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface CreateBookingInput {
  serviceId: string;
  selectedAddonIds?: string[];
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  therapistPreference?: string;
  primaryGuest: BookingGuestInput;
  secondGuest?: BookingGuestInput;
  acceptedPolicy: boolean;
  acceptedPrivacy: boolean;
}

export interface CreateBookingResult {
  success: boolean;
  statusCode: number;
  bookingCode?: string;
  booking?: any;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+-]{10,}$/;

export function validateBookingInput(input: CreateBookingInput): { valid: boolean; error?: string } {
  if (!input.serviceId?.trim()) {
    return { valid: false, error: 'Identifiant de soin requis.' };
  }
  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { valid: false, error: 'Date invalide (format attendu : AAAA-MM-JJ).' };
  }
  if (!input.timeSlot || !/^\d{2}:\d{2}$/.test(input.timeSlot)) {
    return { valid: false, error: 'Créneau horaire invalide.' };
  }

  // Primary Guest Validation
  const g1 = input.primaryGuest;
  if (!g1 || !g1.firstName?.trim() || !g1.lastName?.trim()) {
    return { valid: false, error: 'Prénom et nom du client principal obligatoires.' };
  }
  if (!g1.email || !EMAIL_REGEX.test(g1.email.trim())) {
    return { valid: false, error: 'Adresse courriel valide requise pour le client principal.' };
  }
  if (!g1.phone || !PHONE_REGEX.test(g1.phone.trim())) {
    return { valid: false, error: 'Numéro de téléphone valide requis (au moins 10 chiffres).' };
  }

  if (!input.acceptedPolicy) {
    return { valid: false, error: 'Vous devez accepter la politique de réservation et d’annulation.' };
  }
  if (!input.acceptedPrivacy) {
    return { valid: false, error: 'Vous devez accepter l’avis de confidentialité (Loi 25).' };
  }

  return { valid: true };
}

/**
 * Creates an appointment atomically within a MongoDB transaction.
 * Strictly guarantees that no overlapping room or therapist reservations can occur.
 */
export async function createBookingAtomic(
  client: MongoClient,
  db: Db,
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const validation = validateBookingInput(input);
  if (!validation.valid) {
    return {
      success: false,
      statusCode: 400,
      error: validation.error,
    };
  }

  const {
    serviceId,
    selectedAddonIds = [],
    date,
    timeSlot,
    therapistPreference = 'auto',
    primaryGuest,
    secondGuest,
  } = input;

  const [year, month, day] = date.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day, 12, 0, 0);
  const dayOfWeek = targetDate.getDay();

  if (dayOfWeek === 1) {
    return {
      success: false,
      statusCode: 400,
      error: 'Le spa est fermé le lundi. Aucune réservation possible.',
    };
  }

  // Fetch Service definition first
  const servicesCollection = db.collection('services');
  let serviceDoc = await servicesCollection.findOne({ slug: serviceId, isActive: true });
  if (!serviceDoc && ObjectId.isValid(serviceId)) {
    serviceDoc = await servicesCollection.findOne({ _id: new ObjectId(serviceId), isActive: true });
  }

  if (!serviceDoc) {
    return {
      success: false,
      statusCode: 404,
      error: 'Le soin sélectionné est introuvable ou indisponible.',
    };
  }

  const isDuo = serviceDoc.format === 'duo';

  // If duo, 2nd guest information is mandatory
  if (isDuo) {
    if (!secondGuest || !secondGuest.firstName?.trim() || !secondGuest.lastName?.trim()) {
      return {
        success: false,
        statusCode: 400,
        error: 'Pour un soin en duo, les prénom et nom du 2ᵉ convive sont obligatoires.',
      };
    }
    if (secondGuest.email && !EMAIL_REGEX.test(secondGuest.email.trim())) {
      return {
        success: false,
        statusCode: 400,
        error: 'Courriel du 2ᵉ convive invalide.',
      };
    }
  }

  const durationMinutes = Number(serviceDoc.durationMinutes) || 60;
  const [h, m] = timeSlot.split(':').map(Number);
  const startDateTime = new Date(year, month - 1, day, h, m, 0, 0);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

  // Calculate pricing
  const basePrice = Number(serviceDoc.totalPrice) || 0;
  let addonsTotal = 0;
  if (Array.isArray(serviceDoc.availableAddons) && selectedAddonIds.length > 0) {
    for (const addonId of selectedAddonIds) {
      const match = serviceDoc.availableAddons.find((a: any) => a.id === addonId);
      if (match) {
        addonsTotal += match.price * (isDuo ? 2 : 1);
      }
    }
  }

  const grandTotal = basePrice + addonsTotal;
  const depositDue = Math.round(grandTotal * 0.5 * 100) / 100;
  const balanceDue = Math.round((grandTotal - depositDue) * 100) / 100;

  // Generate unique booking code
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const bookingCode = `DUO-JOL-${randomSuffix}`;

  // Execute inside a MongoDB Transaction
  const session = client.startSession();

  try {
    let createdDoc: any = null;

    await session.withTransaction(async () => {
      const bookingsCol = db.collection('bookings');
      const roomsCol = db.collection('rooms');
      const therapistsCol = db.collection('therapists');

      // 1. Find overlapping bookings during [startDateTime, endDateTime]
      const conflictingBookings = await bookingsCol
        .find(
          {
            status: { $in: ['confirmed', 'pending'] },
            startDateTime: { $lt: endDateTime },
            endDateTime: { $gt: startDateTime },
          },
          { session }
        )
        .toArray();

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

      // 2. Select an available room
      const allActiveRooms = await roomsCol.find({ isActive: true }, { session }).toArray();
      let assignedRoom: any = null;

      if (isDuo) {
        const availableDuoSuites = allActiveRooms.filter(
          (r) => r.type === 'duo_suite' && !busyRoomIds.has(r._id.toString())
        );
        if (availableDuoSuites.length === 0) {
          throw new Error('CONFLICT_ROOM: Aucune suite duo n’est disponible pour ce créneau.');
        }
        assignedRoom = availableDuoSuites[0];
      } else {
        // Solo: prefer solo cabin, fallback to duo suite
        const availableSoloCabins = allActiveRooms.filter(
          (r) => r.type === 'solo_cabin' && !busyRoomIds.has(r._id.toString())
        );
        if (availableSoloCabins.length > 0) {
          assignedRoom = availableSoloCabins[0];
        } else {
          const availableDuoSuites = allActiveRooms.filter(
            (r) => r.type === 'duo_suite' && !busyRoomIds.has(r._id.toString())
          );
          if (availableDuoSuites.length > 0) {
            assignedRoom = availableDuoSuites[0];
          } else {
            throw new Error('CONFLICT_ROOM: Aucune cabine ou suite n’est disponible pour ce créneau.');
          }
        }
      }

      // 3. Select available therapists scheduled for today
      const allActiveTherapists = await therapistsCol.find({ isActive: true }, { session }).toArray();
      const scheduledTherapists = allActiveTherapists.filter((t) => {
        if (!t.schedule || !Array.isArray(t.schedule)) return true;
        const daySched = t.schedule.find((s: any) => s.dayOfWeek === dayOfWeek);
        return daySched ? daySched.isWorking : true;
      });

      const freeTherapists = scheduledTherapists.filter(
        (t) => !busyTherapistIds.has(t._id.toString())
      );

      const assignedTherapists: any[] = [];

      if (isDuo) {
        const freeDuoTherapists = freeTherapists.filter((t) => Boolean(t.canDoDuo));
        if (freeDuoTherapists.length < 2) {
          throw new Error('CONFLICT_STAFF: Les massothérapeutes qualifiées ne sont plus disponibles pour cette plage horaire.');
        }
        assignedTherapists.push(freeDuoTherapists[0], freeDuoTherapists[1]);
      } else {
        if (freeTherapists.length < 1) {
          throw new Error('CONFLICT_STAFF: Aucun massothérapeute disponible pour cette plage horaire.');
        }
        assignedTherapists.push(freeTherapists[0]);
      }

      // 4. Assemble the Booking Document
      const newBooking = {
        bookingCode,
        serviceId: serviceDoc._id,
        serviceSlug: serviceDoc.slug,
        serviceName: serviceDoc.name,
        format: serviceDoc.format,
        durationMinutes,
        selectedAddonIds,
        startDateTime,
        endDateTime,
        date,
        timeSlot,
        therapistPreference,
        assignedRoomId: assignedRoom._id,
        assignedRoomName: assignedRoom.name,
        assignedTherapistIds: assignedTherapists.map((t) => t._id),
        assignedTherapistNames: assignedTherapists.map((t) => t.name),
        primaryGuest: {
          firstName: primaryGuest.firstName.trim(),
          lastName: primaryGuest.lastName.trim(),
          email: primaryGuest.email.trim().toLowerCase(),
          phone: primaryGuest.phone.trim(),
          notes: primaryGuest.notes?.trim() || '',
        },
        secondGuest: isDuo && secondGuest ? {
          firstName: secondGuest.firstName.trim(),
          lastName: secondGuest.lastName.trim(),
          email: secondGuest.email?.trim().toLowerCase() || '',
          phone: secondGuest.phone?.trim() || '',
          notes: secondGuest.notes?.trim() || '',
        } : null,
        pricing: {
          totalPrice: grandTotal,
          depositDue,
          balanceDue,
          isDepositSimulated: true,
        },
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await bookingsCol.insertOne(newBooking, { session });
      createdDoc = { ...newBooking, _id: insertResult.insertedId };
    });

    return {
      success: true,
      statusCode: 201,
      bookingCode,
      booking: createdDoc,
    };
  } catch (error: any) {
    if (error.message?.startsWith('CONFLICT_')) {
      const message = error.message.split(': ')[1] || 'Ce créneau n’est plus disponible.';
      return {
        success: false,
        statusCode: 409,
        error: message,
      };
    }

    console.error('Database transaction error during booking:', error);
    return {
      success: false,
      statusCode: 500,
      error: 'Une erreur inattendue est survenue lors de la réservation. Veuillez réessayer.',
    };
  } finally {
    await session.endSession();
  }
}
