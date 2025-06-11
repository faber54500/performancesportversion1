// middlewares/validationMiddleware.ts

// Hono intègre maintenant directement les validateurs comme zValidator.
// Il n'est donc plus nécessaire de créer un middleware de validation générique
// de cette manière si vous utilisez zValidator ou le Hono Validator.
// Les schémas Zod sont définis directement là où ils sont utilisés (ex: dans les routes).

// Cependant, si vous vouliez un middleware de validation plus personnalisé
// qui s'intégrerait à un autre système de validation ou qui aurait une logique
// de gestion des erreurs spécifique, voici comment il pourrait ressembler.

import { Context, Next } from 'hono';
import { z } from 'zod'; // Pour les schémas de validation

/**
 * @function validate
 * @description Fonction utilitaire pour créer un middleware de validation Hono
 * basé sur un schéma Zod.
 * Ce middleware validera soit le corps JSON, soit les paramètres de la requête,
 * soit les query params.
 * @param {'json' | 'param' | 'query'} type Le type de données à valider.
 * @param {z.ZodSchema} schema Le schéma Zod à utiliser pour la validation.
 * @returns {Function} Un middleware Hono.
 */
export const validate = (type: 'json' | 'param' | 'query', schema: z.ZodSchema) => {
  return async (c: Context, next: Next) => {
    let data: any;
    try {
      if (type === 'json') {
        data = await c.req.json();
      } else if (type === 'param') {
        data = c.req.param();
      } else if (type === 'query') {
        data = c.req.query();
      } else {
        // Gérer un type de validation non supporté.
        return c.json({ message: 'Type de validation non supporté.' }, 500);
      }

      // Valide les données par rapport au schéma Zod.
      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        // Si la validation échoue, renvoie une erreur 400 Bad Request
        // avec les détails des erreurs de validation.
        return c.json({
          message: 'Erreurs de validation.',
          errors: parsed.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          }))
        }, 400);
      }

      // Si la validation réussit, vous pouvez attacher les données validées au contexte
      // ou les remplacer dans le corps de la requête pour les gestionnaires suivants.
      // Par exemple, si type === 'json', vous pourriez faire: c.req.body = parsed.data;
      c.set('validatedData', parsed.data); // Stocke les données validées pour usage ultérieur

      await next(); // Passe au prochain middleware ou au gestionnaire de route
    } catch (error: any) {
      // Gère les erreurs de parsing JSON ou autres erreurs inattendues.
      console.error('Erreur dans le middleware de validation:', error);
      return c.json({ message: 'Erreur lors de la validation de la requête.', error: error.message }, 400);
    }
  };
};

// Note: Dans la pratique avec Hono, il est plus idiomatique d'utiliser directement
// le middleware `zValidator` de `@hono/zod-validator` comme montré dans `routes/private.ts`.
// Ce fichier serait plus pertinent si vous construisiez un validateur totalement custom.