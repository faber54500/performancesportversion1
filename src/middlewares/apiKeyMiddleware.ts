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

// Utilisez cette clé dans vos requêtes protégées : x-api-key: CLE_API_DE_TEST
// Exemple de création d'une clé API en TypeScript (à exécuter une seule fois, par exemple dans un script d'initialisation ou temporairement ici) :
//
// (async () => {
//   const apiKeyRepo = AppDataSource.getRepository(ApiKey);
//   const newKey = apiKeyRepo.create({ key: '123', userId: 1, isActive: true });
//   await apiKeyRepo.save(newKey);
//   console.log('Clé API créée :', newKey);
// })();
//
// Ensuite, commente ou supprime ce bloc pour éviter de créer la clé à chaque démarrage.
// Utilisez cette clé dans vos requêtes protégées : x-api-key: 123
//
// Pour accéder à /athletes/:id, il faut fournir la clé d'API dans le header ou en query param.
// Exemple d'utilisation dans Bruno ou Postman :
// Header : x-api-key: 123
// ou
// URL : http://localhost:3000/athletes/1?api_key=123
//
// Le code du middleware ne doit PAS être modifié pour rendre la clé optionnelle si la sécurité est souhaitée.
//
// Si tu veux désactiver la protection, il faudrait retirer apiKeyMiddleware de la route dans public.ts (non recommandé).
//
// Pour insérer la clé API '123' via TypeScript, décommente ce bloc, démarre le serveur une fois, puis remets-le en commentaire :
//
// (async () => {
//   const apiKeyRepo = AppDataSource.getRepository(ApiKey);
//   const newKey = apiKeyRepo.create({ key: '123', userId: 1, isActive: true });
//   await apiKeyRepo.save(newKey);
//   console.log('Clé API créée :', newKey);
// })();
//
// Après exécution, la clé sera disponible en base et tu pourras l'utiliser dans tes requêtes protégées.
//
// Exemple de création d'une clé API aléatoire à 1 chiffre (à exécuter une seule fois) :
//
// (async () => {
//   const apiKeyRepo = AppDataSource.getRepository(ApiKey);
//   const randomDigit = Math.floor(Math.random() * 10).toString();
//   const exists = await apiKeyRepo.findOne({ where: { key: randomDigit } });
//   if (!exists) {
//     const newKey = apiKeyRepo.create({ key: randomDigit, userId: 1, isActive: true });
//     await apiKeyRepo.save(newKey);
//     console.log('Clé API créée :', newKey);
//   } else {
//     console.log('Clé déjà existante :', randomDigit);
//   }
// })();
//
// Après exécution, la clé sera disponible en base et tu pourras l'utiliser dans tes requêtes protégées.
//
// Pour générer une clé API à 1 chiffre sans planter le système, tu peux utiliser ce bloc sécurisé :
// (async () => {
//   const apiKeyRepo = AppDataSource.getRepository(ApiKey);
//   const randomDigit = Math.floor(Math.random() * 10).toString();
//   try {
//     const exists = await apiKeyRepo.findOne({ where: { key: randomDigit } });
//     if (!exists) {
//       const newKey = apiKeyRepo.create({ key: randomDigit, userId: 1, isActive: true });
//       await apiKeyRepo.save(newKey);
//       console.log('Clé API créée :', newKey);
//     } else {
//       console.log('Clé déjà existante :', randomDigit);
//     }
//   } catch (err) {
//     console.error('Erreur lors de la création de la clé API :', err);
//   }
// })();
//
// Laisse ce bloc COMMENTÉ pour éviter toute exécution répétée.
// Si tu veux une clé fixe, insère-la une seule fois puis laisse ce code commenté.
