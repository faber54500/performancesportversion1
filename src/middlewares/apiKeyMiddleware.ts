// src/middlewares/apiKeyMiddleware.ts
import type { Context, Next } from 'hono';
import { AppDataSource } from '../config/database';
import { ApiKey } from '../entities/ApiKey';

export const apiKeyMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-api-key') || c.req.query('api_key');
  if (!apiKey) {
    return c.json({ message: 'Clé API manquante.' }, 401);
  }

  const apiKeyRepo = AppDataSource.getRepository(ApiKey);
  const keyRecord = await apiKeyRepo.findOne({ where: { key: apiKey, isActive: true } });

  if (!keyRecord) {
    return c.json({ message: 'Clé API invalide ou désactivée.' }, 403);
  }

  // Optionnel : attacher l'utilisateur ou l'apiKey au contexte
  c.set('apiKeyUserId', keyRecord.userId);

  await next();
};
