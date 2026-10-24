import type { IncomingMessage, ServerResponse } from 'http';
import { getDatabase } from '../../lib/mongodb.js';
import { authenticateAdmin } from '../../lib/auth.js';

interface ResponseWithJson extends ServerResponse {
  status?: (statusCode: number) => ResponseWithJson;
  json?: (data: any) => void;
}

export default async function handler(req: IncomingMessage, res: ResponseWithJson) {
  const sendJson = (statusCode: number, data: any) => {
    const statusFn = res.status;
    const jsonFn = res.json;
    if (typeof statusFn === 'function' && typeof jsonFn === 'function') {
      statusFn.call(res, statusCode);
      jsonFn.call(res, data);
    } else {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
  };

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(405, { success: false, error: 'Méthode non autorisée. Utilisez GET.' });
  }

  try {
    const db = await getDatabase();
    const auth = await authenticateAdmin(req, db);

    if (!auth.authenticated) {
      return sendJson(401, { success: false, error: auth.error || 'Accès refusé.' });
    }

    const bookingsCol = db.collection('bookings');
    const servicesCol = db.collection('services');
    const therapistsCol = db.collection('therapists');
    const roomsCol = db.collection('rooms');

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      totalBookings,
      upcomingBookings,
      todayAppointments,
      cancelledBookings,
      recentBookings,
      servicesCount,
      therapistsCount,
      roomsCount,
    ] = await Promise.all([
      bookingsCol.countDocuments(),
      bookingsCol.countDocuments({ startDateTime: { $gte: now }, status: 'confirmed' }),
      bookingsCol.countDocuments({
        startDateTime: { $gte: startOfToday, $lte: endOfToday },
        status: { $ne: 'cancelled' },
      }),
      bookingsCol.countDocuments({ status: 'cancelled' }),
      bookingsCol
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .project({
          bookingCode: 1,
          serviceName: 1,
          format: 1,
          date: 1,
          timeSlot: 1,
          primaryGuest: 1,
          status: 1,
          pricing: 1,
          createdAt: 1,
        })
        .toArray(),
      servicesCol.countDocuments({ isActive: true }),
      therapistsCol.countDocuments({ isActive: true }),
      roomsCol.countDocuments({ isActive: true }),
    ]);

    return sendJson(200, {
      success: true,
      stats: {
        totalBookings,
        upcomingBookings,
        todayAppointments,
        cancelledBookings,
        servicesCount,
        therapistsCount,
        roomsCount,
      },
      recentBookings,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return sendJson(500, { success: false, error: 'Erreur lors du calcul des statistiques.' });
  }
}
