// utils/jwt.ts

// Importe la bibliothèque JWT (JSON Web Token).
// Bun est compatible avec 'jsonwebtoken' de Node.js.
import jwt from 'jsonwebtoken';
// Importe les types définis pour le payload JWT.
import { UserPayload } from '../types';
// Importe la configuration de l'application pour accéder à la clé secrète JWT.
import { config } from './config';

/**
 * @function generateToken
 * @description Génère un nouveau token JWT pour un utilisateur donné.
 * @param {UserPayload} payload Les données de l'utilisateur à inclure dans le token.
 * Ne doit pas inclure d'informations sensibles comme les mots de passe.
 * @returns {string} Le token JWT signé.
 */
export const generateToken = (payload: UserPayload): string => {
  // Récupère la clé secrète JWT de la configuration de l'application.
  // Assurez-vous que JWT_SECRET est défini dans votre fichier .env et chargé via config.ts.
  const secret = config.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET non défini dans les variables d\'environnement.');
  }

  // Signe le token avec le payload, la clé secrète et les options (expiration).
  // Le token expire après 60 minutes (3600 secondes).
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // '1h' = 1 heure, '60m' = 60 minutes
};

/**
 * @function verifyToken
 * @description Vérifie la validité d'un token JWT et décode son payload.
 * @param {string} token Le token JWT à vérifier.
 * @returns {Promise<UserPayload>} Une promesse qui résout au payload du token décodé
 * si la vérification réussit.
 * @throws {Error} Lance une erreur si le token est invalide, expiré ou si la signature est incorrecte.
 */
export const verifyToken = (token: string): Promise<UserPayload> => {
  const secret = config.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET non défini dans les variables d\'environnement.');
  }

  return new Promise((resolve, reject) => {
    // Vérifie le token avec la clé secrète.
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // Gère les erreurs de vérification (ex: TokenExpiredError, JsonWebTokenError).
        return reject(err);
      }
      // Résout la promesse avec le payload décodé, casté en UserPayload.
      resolve(decoded as UserPayload);
    });
  });
};
