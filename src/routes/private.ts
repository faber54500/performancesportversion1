// routes/private.ts

// Importe la classe Hono pour créer un routeur.
import { Hono } from 'hono';
// Importe le contrôleur d'athlètes.
import { AthleteController } from '../controllers/AthleteController';
// Importe le middleware d'authentification.
import { authMiddleware } from '../middlewares/authMiddleware';
// Importe le DataSource TypeORM pour initialiser les dépendances.
import { AppDataSource } from '../config/database';
// Importe le dépôt d'athlètes.
import { AthleteRepository } from '../repositories/AthleteRepository';
// Importe le service d'athlètes.
import { AthleteService } from '../services/AthleteService';
// Importe l'entité Athlete.
import { Athlete } from '../entities/Athlete';
// Importe le middleware de validation.
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'; // Importe Zod pour la définition des schémas de validation
import { athleteAccessControl } from '../middlewares/athleteAccessControl';

// Crée une nouvelle instance de routeur Hono.
const privateRoutes = new Hono();

// Initialise le dépôt et le service d'athlètes.
const athleteRepository = new AthleteRepository(AppDataSource.getRepository(Athlete));
const athleteService = new AthleteService(athleteRepository);
const athleteController = new AthleteController(athleteService); // Le contrôleur utilise le service

/**
 * Schéma Zod pour la validation des données d'un athlète lors de la création/mise à jour.
 */
const athleteSchema = z.object({
  Name: z.string().min(1, 'Le nom est requis.'),
  Gender: z.enum(['M', 'F'], 'Le genre doit être "M" ou "F".'),
  Runtime: z.number().positive('Le temps de course doit être positif.'),
  Age: z.number().int().min(10, 'L\'âge doit être un entier positif et au moins 10.'),
  Weight: z.number().positive('Le poids doit être positif.'),
  Oxygen_consumption: z.number().positive('La consommation d\'oxygène doit être positive.'),
  Run_pulse: z.number().int().positive('La fréquence cardiaque à l\'effort doit être un entier positif.'),
  Res_pulse: z.number().int().positive('La fréquence cardiaque au repos doit être un entier positif.'),
  Maximum_pulse: z.number().int().positive('La fréquence cardiaque maximale doit être un entier positif.'),
  Performance: z.number().int().min(0, 'La performance doit être un entier non négatif.'),
});

/**
 * Routes Privées : Nécessitent une authentification.
 */

// Applique le middleware d'authentification à toutes les routes définies après ce point.
privateRoutes.use(authMiddleware);

// Route pour récupérer un programme par son ID (GET).
privateRoutes.get('/programme/:id', (c) => {
  const programmeId = c.req.param('id');
  console.log(`[privateRoutes] Requête reçue pour le programme ID : ${programmeId}`);
  return c.json({ message: `Programme demandé : ${programmeId}` });
});

// Route pour créer un nouvel athlète (POST).
privateRoutes.post('/athletes', zValidator('json', athleteSchema), athleteController.createAthlete.bind(athleteController));

// Route pour mettre à jour un athlète existant par son ID (PUT).
privateRoutes.put('/athletes/:id', athleteAccessControl, zValidator('json', athleteSchema.partial()), athleteController.updateAthlete.bind(athleteController));

// Route pour supprimer un athlète par son ID (DELETE).
privateRoutes.delete('/athletes/:id', athleteAccessControl, athleteController.deleteAthlete.bind(athleteController));

// Route pour lire un athlète par son ID (GET).
privateRoutes.get('/athletes/:id', athleteAccessControl, athleteController.getAthleteById.bind(athleteController));

// Exporte le routeur privé.
export { privateRoutes };