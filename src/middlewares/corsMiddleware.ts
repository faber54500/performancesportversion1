// middlewares/corsMiddleware.ts

// Le middleware CORS de Hono est généralement appliqué directement dans `app.ts`
// car il s'agit d'une configuration globale qui affecte toutes les requêtes.
// Par conséquent, il est rare d'avoir un fichier dédié 'corsMiddleware.ts'
// qui ne fait qu'importer et exporter la fonction 'cors' de Hono.

// Si vous aviez une logique CORS complexe qui nécessitait une configuration
// dynamique ou conditionnelle, ce fichier pourrait être utilisé.
// Cependant, pour la plupart des cas, la configuration dans `app.ts` est suffisante.

import { cors } from 'hono/cors';
import { Context, Next } from 'hono';

// Bien que la fonction 'cors' de Hono soit directement un middleware,
// si vous vouliez l'encapsuler pour une raison spécifique (par exemple,
// pour ajouter une logique de logging autour), vous pourriez faire ceci:

export const customCorsMiddleware = (c: Context, next: Next) => {
  // Optionnel: vous pouvez loguer des informations avant que CORS ne soit appliqué
  // console.log('Applying CORS headers...');

  // Utilise la fonction cors de Hono comme un middleware interne
  // Cela nécessite de passer les options de configuration.
  return cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'], // Adaptez à vos besoins
    allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 600,
    credentials: true,
  })(c, next); // Appel de la fonction cors de Hono avec le contexte actuel

  // Optionnel: vous pouvez loguer des informations après que CORS ait été appliqué
  // et la requête traitée par le middleware suivant.
  // console.log('CORS headers applied.');
};

// Cependant, la méthode la plus simple et recommandée est d'utiliser
// `app.use(cors({ ...options }))` directement dans `app.ts`.
// Ce fichier est donc majoritairement un exemple conceptuel si une encapsulaiton était absolument requise.
