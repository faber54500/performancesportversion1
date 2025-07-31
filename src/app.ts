// app.ts

// Importe la classe Hono pour créer une application web.
import { Hono } from 'hono';
// Importe le middleware CORS pour gérer les politiques d'accès entre origines.
import { cors } from 'hono/cors';

// Importe les routeurs définis (pour les routes publiques et privées).
// Ces fichiers de routes devraient exister dans le dossier 'routes'.
import { publicRoutes } from './routes/public';
import { privateRoutes } from './routes/private';
import { authRoutes } from './routes/auth'; // Pour l'authentification (login/register)

// Crée une nouvelle instance de l'application Hono.
const app = new Hono();

/**
 * Middlewares globaux
 * Ces middlewares s'appliqueront à toutes les requêtes entrantes.
 */

// Configure le middleware CORS.
// Pour la PoC, nous autorisons l'accès depuis 'http://localhost:3000' (ou l'origine de votre client).
// Vous devriez ajuster 'origin' à l'URL de votre frontend en production.
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Exemple pour React/Vue/Angular en dev
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'], // Autorise les headers nécessaires
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Autorise les méthodes HTTP
  maxAge: 600, // Temps de cache pour les requêtes preflight OPTIONS
  credentials: true, // Autorise l'envoi de cookies et d'en-têtes d'autorisation
}));

/**
 * Gestion des routes
 * Les routes sont regroupées logiquement pour maintenir une architecture propre.
 */

// Enregistre les routes publiques qui ne nécessitent pas d'authentification.
app.route('/', publicRoutes);
// Enregistre les routes privées qui nécessitent une authentification.
// Un middleware d'authentification devrait être appliqué à ce routeur.
app.route('/', privateRoutes);
// Enregistre les routes d'authentification (login, register).
app.route('/auth', authRoutes);

/**
 * Gestionnaire d'erreur global
 * Capture toutes les erreurs non gérées par les routes spécifiques.
 */
app.onError((err, c) => {
  console.error(`${err}`); // Log l'erreur pour le débogage.
  // Vous pouvez personnaliser la réponse d'erreur en fonction du type d'erreur.
  return c.json({ message: 'Une erreur interne du serveur est survenue.', error: err.message }, 500);
});

// Exporte l'application Hono pour être utilisée dans index.ts.
export default app;


