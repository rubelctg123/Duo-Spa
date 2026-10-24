import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../../lib/mongodb.js';
import { authenticateAdmin } from '../../lib/auth.js';

interface RequestWithQueryAndBody extends IncomingMessage {
  method?: string;
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

    const servicesCol = db.collection('services');

    if (req.method === 'GET') {
      const services = await servicesCol.find().sort({ format: 1, name: 1 }).toArray();
      return sendJson(200, {
        success: true,
        count: services.length,
        services,
      });
    }

    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      const { serviceId, pricePerPerson, durationMinutes, isActive, popular } = body;

      if (!serviceId) {
        return sendJson(400, { success: false, error: 'Identifiant de soin manquant.' });
      }

      const query = ObjectId.isValid(serviceId)
        ? { $or: [{ _id: new ObjectId(serviceId) }, { slug: serviceId }] }
        : { slug: serviceId };

      const existing = await servicesCol.findOne(query);
      if (!existing) {
        return sendJson(404, { success: false, error: 'Prestation introuvable.' });
      }

      const updateFields: any = { updatedAt: new Date() };

      if (typeof pricePerPerson === 'number' && pricePerPerson > 0) {
        updateFields.pricePerPerson = pricePerPerson;
        updateFields.totalPrice = existing.format === 'duo' ? pricePerPerson * 2 : pricePerPerson;
      }

      if (typeof durationMinutes === 'number' && durationMinutes > 0) {
        updateFields.durationMinutes = durationMinutes;
        updateFields.durationLabel = `${durationMinutes} minutes`;
      }

      if (typeof isActive === 'boolean') {
        updateFields.isActive = isActive;
      }

      if (typeof popular === 'boolean') {
        updateFields.popular = popular;
      }

      const updated = await servicesCol.findOneAndUpdate(
        { _id: existing._id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

      return sendJson(200, {
        success: true,
        message: 'Prestation mise à jour avec succès.',
        service: updated,
      });
    }

    res.setHeader('Allow', 'GET, PATCH');
    return sendJson(405, { success: false, error: 'Méthode non autorisée.' });
  } catch (error: any) {
    console.error('Error in admin services handler:', error);
    return sendJson(500, { success: false, error: 'Erreur serveur lors de la gestion des soins.' });
  }
}
