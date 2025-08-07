// src/middlewares/athleteAccessControl.ts

import type { Context, Next } from 'hono';

/**
 * Middleware pour contrôler l'accès aux athlètes selon le rôle et l'id utilisateur :
 * - admin : accès total
 * - user1 (id=1) : accès aux athlètes impairs
 * - user2 (id=2) : accès aux athlètes pairs
 */
export const athleteAccessControl = async (c: Context, next: Next) => {
  const user = c.get('user');
  const athleteId = parseInt(c.req.param('id'));
  const userId = parseInt(user.id); // Conversion explicite

  console.log('[athleteAccessControl] user:', user);
  console.log('[athleteAccessControl] typeof user.id:', typeof user.id, 'user.id:', user.id);
  console.log('[athleteAccessControl] userId:', userId, 'athleteId:', athleteId);

  // Cas admin : accès total
  if (user.role === 'admin') {
    console.log('[athleteAccessControl] Accès admin autorisé');
    return next();
  }

  // Cas user1 : accès uniquement aux impairs
  if (user.role === 'user' && userId === 1) {
    console.log('[athleteAccessControl] Test user1 : userId === 1, athleteId % 2 ===', athleteId % 2);
    if (athleteId % 2 === 1) {
      console.log('[athleteAccessControl] Accès user1 autorisé (impair)');
      return next();
    } else {
      console.log('[athleteAccessControl] Accès user1 interdit (pair)');
      return c.json({ message: 'Accès interdit : user1 ne peut accéder qu’aux athlètes impairs.' }, 403);
    }
  }

  // Cas user2 : accès uniquement aux pairs
  if (user.role === 'user' && userId === 2) {
    console.log('[athleteAccessControl] Test user2 : userId === 2, athleteId % 2 ===', athleteId % 2);
    if (athleteId % 2 === 0) {
      console.log('[athleteAccessControl] Accès user2 autorisé (pair)');
      return next();
    } else {
      console.log('[athleteAccessControl] Accès user2 interdit (impair)');
      return c.json({ message: 'Accès interdit : user2 ne peut accéder qu’aux athlètes pairs.' }, 403);
    }
  }

  // Cas tous les autres : accès interdit
  console.log('[athleteAccessControl] Accès interdit : rôle ou id non reconnu');
  return c.json({ message: 'Accès interdit à cet athlète.' }, 403);
};
