// src/middlewares/getCurrentUser.ts

import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';
import type { UserPayload } from '../types';

/**
 * Middleware getCurrentUser :
 * Vérifie le token JWT, extrait l'utilisateur et son rôle, et protège les routes nécessitant une authentification.
 * Si le token est valide, ajoute l'utilisateur au contexte (c.set('user', ...)).
 * Sinon, renvoie une erreur 401 ou 403.
 */
export const getCurrentUser = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ message: 'Token manquant. Authentification requise.' }, 401);
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ message: 'Format de token invalide.' }, 401);
  }
  try {
    const payload = await verifyToken(token) as UserPayload;
    if (!payload || !payload.role) {
      return c.json({ message: 'Token invalide ou rôle manquant.' }, 403);
    }
    // Ajoute l'utilisateur au contexte pour les routes suivantes
    c.set('user', payload);
    await next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ message: 'Token expiré.' }, 403);
    }
    return c.json({ message: 'Token invalide.' }, 403);
  }
};

/**
 * Exemple d'utilisation dans une route protégée :
 *
 * import { getCurrentUser } from '../middlewares/getCurrentUser';
 *
 * app.use('/private/*', getCurrentUser);
 * app.get('/private/profile', (c) => {
 *   const user = c.get('user');
 *   return c.json({ user });
 * });
 */
