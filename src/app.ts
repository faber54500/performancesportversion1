// src/app.ts

// Importe la classe Hono pour créer une application web.
import { Hono } from 'hono';
// Importe le middleware CORS pour gérer les politiques d'accès entre origines.
import { cors } from 'hono/cors';
// Importe le middleware de logs pour un meilleur débogage.
import { logger } from 'hono/logger';

// --- MODIFICATION : Import du middleware d'authentification ---
import { authMiddleware } from './middlewares/authMiddleware';

// Importe les routeurs définis.
import { publicRoutes } from './routes/public';
import { privateRoutes } from './routes/private';
import { authRoutes } from './routes/auth';

// Crée une nouvelle instance de l'application Hono.
const app = new Hono();

/**
 * Middlewares globaux
 * Appliqués à TOUTES les requêtes.
 */
app.use('*', logger()); // Ajout du logger pour toutes les routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 600,
  credentials: true,
}));

/**
 * Gestion des routes
 * On sépare clairement les routes publiques des routes privées.
 */

// --- ROUTES PUBLIQUES ---
// Ces routes sont accessibles sans token.
app.route('/auth', authRoutes); // Routes pour /auth/login, /auth/register
app.route('/', publicRoutes);   // Autres routes publiques

// --- ROUTES PRIVÉES (PROTÉGÉES) ---
// On crée un groupe de routes dédié qui sera protégé par le middleware.
const privateApi = new Hono();
// On applique le middleware d'authentification à TOUTES les routes de ce groupe.
privateApi.use('*', authMiddleware);
// On enregistre les routes privées DANS ce groupe sécurisé.
privateApi.route('/', privateRoutes);

// On attache le groupe sécurisé à notre application principale.
app.route('/', privateApi);

// Supprime les doublons et corrige la logique d'exclusion des routes publiques
app.use('*', async (c, next) => {
  const publicPaths = ['/auth/login', '/auth/register'];
  if (publicPaths.includes(c.req.path)) {
    console.log(`[app.ts] Route publique détectée : ${c.req.path}, middleware ignoré.`);
    return next();
  }
  console.log(`[app.ts] Route protégée détectée : ${c.req.path}, exécution du middleware.`);
  return authMiddleware(c, next);
});


/**
 * Gestionnaire d'erreur global
 */
app.onError((err, c) => {
  console.error(`[Erreur Globale] ${err}`);
  return c.json({ message: 'Une erreur interne du serveur est survenue.', error: err.message }, 500);
});

/**
 * Gestionnaire 404 Not Found
 */
app.notFound((c) => {
  return c.json({ message: `Route non trouvée : ${c.req.method} ${c.req.path}` }, 404);
});


// Exporte l'application Hono pour être utilisée dans index.ts.
export default app;
