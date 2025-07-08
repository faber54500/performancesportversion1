// routes/private.ts

// Importe la classe Hono pour créer un routeur.
import { Hono } from 'hono';
// Importe le contrôleur d'athlètes.
import { AthleteController } from '../controllers/AthleteController';
// Importe le middleware d'authentification (à implémenter dans middlewares/authMiddleware.ts).
import { authMiddleware } from '../middlewares/authMiddleware';
// Importe le DataSource TypeORM pour initialiser les dépendances.
import { AppDataSource } from '../config/database';
// Importe le dépôt d'athlètes.
import { AthleteRepository } from '../repositories/AthleteRepository';
// Importe le service d'athlètes.
import { AthleteService } from '../services/AthleteService';
// Importe l'entité Athlete. <-- AJOUTÉE
import { Athlete } from '../entities/Athlete'; // <-- AJOUTÉE
// Importe le middleware de validation (si utilisé pour valider les données des requêtes).
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'; // Importe Zod pour la définition des schémas de validation

// Crée une nouvelle instance de routeur Hono.
const privateRoutes = new Hono();

// Initialise le dépôt et le service d'athlètes.
const athleteRepository = new AthleteRepository(AppDataSource.getRepository(Athlete));
const athleteService = new AthleteService(athleteRepository);
const athleteController = new AthleteController(athleteService); // Le contrôleur utilise le service

/**
 * Schéma Zod pour la validation des données d'un athlète lors de la création/mise à jour.
 * Ceci est un exemple, vous devrez l'adapter à vos besoins réels.
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
 * Routes Privées : Nécessitent une authentification (et potentiellement une autorisation).
 * Toutes les opérations CRUD sont généralement placées ici.
 */

// Applique le middleware d'authentification à toutes les routes définies après ce point
// dans ce routeur 'privateRoutes'.
privateRoutes.use(authMiddleware);

// Route pour créer un nouvel athlète (POST).
// Utilise zValidator pour valider le corps de la requête par rapport au athleteSchema.
privateRoutes.post('/athletes', zValidator('json', athleteSchema), athleteController.createAthlete.bind(athleteController));

// Route pour mettre à jour un athlète existant par son ID (PUT).
// Utilise zValidator pour valider le corps de la requête.
privateRoutes.put('/athletes/:id', zValidator('json', athleteSchema.partial()), athleteController.updateAthlete.bind(athleteController)); // .partial() permet de valider un sous-ensemble des champs

// Route pour supprimer un athlète par son ID (DELETE).
privateRoutes.delete('/athletes/:id', athleteController.deleteAthlete.bind(athleteController));

// Route pour lire un athlète par son ID (GET).
privateRoutes.get('/athletes/:id', athleteController.getAthleteById.bind(athleteController));

// Exporte le routeur privé.
export { privateRoutes };