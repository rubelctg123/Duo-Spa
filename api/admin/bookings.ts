import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../../lib/mongodb.js';
import { authenticateAdmin } from '../../lib/auth.js';

interface RequestWithQueryAndBody extends IncomingMessage {
  method?: string;
  query?: Record<string, string | string[]>;
  url?: string;
  body?: any;
}

interface ResponseWithJson extends ServerResponse {
  status?: (statusCode: number) => ResponseWithJson;
  json?: (data: any) => void;
}

async function parseBody(req: RequestWithQueryAndBody): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 65536) reject(new Error('Payload trop grand'));
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Format JSON invalide'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: RequestWithQueryAndBody, res: ResponseWithJson) {
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

  try {
    const db = await getDatabase();
    const auth = await authenticateAdmin(req, db);

    if (!auth.authenticated) {
      return sendJson(401, { success: false, error: auth.error || 'Accès refusé.' });
    }

    const bookingsCol = db.collection('bookings');

    // -------------------------------------------------------------------------
    // GET: Query Bookings with Filters
    // -------------------------------------------------------------------------
    if (req.method === 'GET') {
      let search = '';
      let status = 'all';
      let date = '';

      if (req.url && req.url.includes('?')) {
        const urlObj = new URL(req.url, 'http://localhost');
        search = (urlObj.searchParams.get('search') || '').trim();
        status = (urlObj.searchParams.get('status') || 'all').trim();
        date = (urlObj.searchParams.get('date') || '').trim();
      }

      const query: any = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        query.date = date;
      }

      if (search) {
        query.$or = [
          { bookingCode: { $regex: search, $options: 'i' } },
          { 'primaryGuest.firstName': { $regex: search, $options: 'i' } },
          { 'primaryGuest.lastName': { $regex: search, $options: 'i' } },
          { 'primaryGuest.email': { $regex: search, $options: 'i' } },
          { 'primaryGuest.phone': { $regex: search, $options: 'i' } },
          { serviceName: { $regex: search, $options: 'i' } },
        ];
      }

      const bookings = await bookingsCol
        .find(query)
        .sort({ startDateTime: -1, createdAt: -1 })
        .limit(100)
        .toArray();

      return sendJson(200, {
        success: true,
        count: bookings.length,
        bookings,
      });
    }

    // -------------------------------------------------------------------------
    // PATCH: Update Booking Status or Admin Notes
    // -------------------------------------------------------------------------
    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      const { bookingId, status: newStatus, notes: adminNotes } = body;

      if (!bookingId || !ObjectId.isValid(bookingId)) {
        return sendJson(400, { success: false, error: 'Identifiant de réservation invalide.' });
      }

      const updateFields: any = { updatedAt: new Date() };

      if (newStatus && ['confirmed', 'cancelled', 'completed'].includes(newStatus)) {
        updateFields.status = newStatus;
      }

      if (typeof adminNotes === 'string') {
        updateFields.adminNotes = adminNotes;
      }

      const result = await bookingsCol.findOneAndUpdate(
        { _id: new ObjectId(bookingId) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

      if (!result) {
        return sendJson(404, { success: false, error: 'Réservation introuvable.' });
      }

      return sendJson(200, {
        success: true,
        message: 'Réservation mise à jour avec succès.',
        booking: result,
      });
    }

    res.setHeader('Allow', 'GET, PATCH');
    return sendJson(405, { success: false, error: 'Méthode non autorisée.' });
  } catch (error: any) {
    console.error('Error in admin bookings handler:', error);
    return sendJson(500, { success: false, error: 'Erreur lors de la gestion des réservations.' });
  }
}
