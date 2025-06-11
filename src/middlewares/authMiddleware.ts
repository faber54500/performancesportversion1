// middlewares/authMiddleware.ts

import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt'; // Utilitaire pour vérifier les tokens JWT
import { UserPayload } from '../types'; // Importe l'interface du payload utilisateur

/**
 * @function authMiddleware
 * @description Middleware Hono pour l'authentification basée sur les tokens JWT.
 * Il vérifie la présence et la validité d'un token JWT dans l'en-tête Authorization.
 * Si le token est valide, il décode le payload et le met à disposition dans le contexte Hono.
 * Si le token est absent ou invalide, il renvoie une erreur 401 Unauthorized ou 403 Forbidden.
 * @param {Context} c Le contexte Hono de la requête.
 * @param {Next} next La fonction 'next' pour passer au prochain middleware ou gestionnaire de route.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  // Récupère l'en-tête Authorization de la requête.
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    // Si l'en-tête Authorization est absent, l'utilisateur n'est pas authentifié.
    return c.json({ message: 'Accès non autorisé: Token non fourni.' }, 401);
  }

  // Vérifie si l'en-tête est au format 'Bearer <token>'.
  const token = authHeader.split(' ')[1]; // Prend la deuxième partie après 'Bearer '

  if (!token) {
    // Si le format est incorrect, renvoie une erreur.
    return c.json({ message: 'Accès non autorisé: Format de token invalide (attendu: Bearer <token>).' }, 401);
  }

  try {
    // Vérifie le token JWT et décode son payload.
    const decodedPayload = await verifyToken(token) as UserPayload; // On s'attend à un payload de type UserPayload

    // Attache le payload de l'utilisateur au contexte Hono pour un accès ultérieur
    // dans les contrôleurs ou les middlewares suivants.
    // Hono permet de stocker des données personnalisées via c.set() et c.get().
    c.set('user', decodedPayload);
    // Optionnel: peut également attacher le userId directement pour plus de commodité
    c.set('userId', decodedPayload.userId);
    c.set('userRole', decodedPayload.role);


    // Passe au prochain middleware ou gestionnaire de route.
    await next();

  } catch (error: any) {
    // Gère les erreurs de vérification du token (ex: token expiré, signature invalide).
    console.error('Erreur de validation du token JWT:', error.message);
    if (error.name === 'TokenExpiredError') {
        return c.json({ message: 'Token expiré. Veuillez vous reconnecter.' }, 403); // 403 Forbidden pour token expiré
    }
    return c.json({ message: 'Accès non autorisé: Token invalide ou non signé.' }, 403); // 403 Forbidden pour token invalide
  }
};

/**
 * Exemple de middleware d'autorisation (bonus) :
 * Vérifie si l'utilisateur a un rôle spécifique.
 */
export const authorizeRole = (requiredRole: 'admin' | 'user') => {
  return async (c: Context, next: Next) => {
    // Récupère le rôle de l'utilisateur précédemment stocké par authMiddleware.
    const userRole = c.get('userRole');

    if (!userRole || userRole !== requiredRole) {
      return c.json({ message: `Accès interdit: Nécessite le rôle ${requiredRole}.` }, 403);
    }
    await next();
  };
};

/**
 * Exemple de middleware de propriété des données (bonus) :
 * Vérifie si l'utilisateur est le propriétaire de la ressource.
 */
export const checkOwnership = (resourceIdParamName: string) => {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId'); // L'ID de l'utilisateur connecté
    const resourceId = c.req.param(resourceIdParamName); // L'ID de la ressource depuis les paramètres de l'URL

    // Dans un cas réel, vous iriez chercher la ressource dans la base de données
    // pour vérifier si son propriétaire correspond à userId.
    // Par exemple:
    // const resource = await resourceService.findById(resourceId);
    // if (!resource || resource.ownerId !== userId) {
    //   return c.json({ message: 'Accès interdit: Vous n\'êtes pas le propriétaire de cette ressource.' }, 403);
    // }

    // Pour l'instant, c'est une simulation. Vous devez implémenter la logique réelle.
    console.log(`Vérification de propriété: userId=${userId}, resourceId=${resourceId}`);
    // Simule la vérification de propriété pour la PoC.
    // Vous devriez ici faire une requête DB pour vérifier la propriété.
    if (userId !== resourceId) { // Exemple très simplifié: si l'ID de l'utilisateur est le même que l'ID de la ressource
        // return c.json({ message: 'Accès interdit: Vous n\'êtes pas le propriétaire de cette ressource.' }, 403);
    }

    await next();
  };
};
