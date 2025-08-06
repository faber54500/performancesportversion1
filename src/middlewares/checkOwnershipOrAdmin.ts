// src/middlewares/checkOwnershipOrAdmin.ts

import type { Context, Next } from 'hono';
import type { UserPayload } from '../types';

/**
 * Middleware pour restreindre l'accès à une ressource privée :
 * - Si l'utilisateur est admin, accès total
 * - Sinon, accès seulement si l'id du user dans le token correspond à l'id de la ressource
 * @param paramName Nom du paramètre dans l'URL (ex: 'id')
 */
export const checkOwnershipOrAdmin = (paramName: string = 'id') => {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as UserPayload;
    const resourceId = parseInt(c.req.param(paramName));
    if (!user) {
      return c.json({ message: 'Utilisateur non authentifié.' }, 401);
    }
    if (user.role === 'admin') {
      // Admin : accès total
      return await next();
    }
    if (user.userId !== resourceId) {
      return c.json({ message: 'Accès interdit : vous ne pouvez accéder qu’à vos propres données.' }, 403);
    }
    await next();
  };
};

/**
 * Exemple d'utilisation dans une route privée :
 *
 * import { getCurrentUser } from '../middlewares/getCurrentUser';
 * import { checkOwnershipOrAdmin } from '../middlewares/checkOwnershipOrAdmin';
 *
 * app.get('/private/user/:id', getCurrentUser, checkOwnershipOrAdmin('id'), (c) => {
 *   // Ici, accès autorisé seulement si user.userId === :id OU si admin
 *   // ...
 * });
 */
