// routes/public.ts

// Importe la classe Hono pour créer un routeur.
import { Hono } from 'hono';
// Importe le contrôleur d'athlètes.
import { AthleteController } from '../controllers/AthleteController';
// Importe le DataSource TypeORM pour initialiser les dépendances (dépôts, services).
import { AppDataSource } from '../config/database';
// Importe le dépôt d'athlètes.
import { AthleteRepository } from '../repositories/AthleteRepository';
// Importe le service d'athlètes.
import { AthleteService } from '../services/AthleteService';
// Importe l'entité Athlete. <-- LIGNE AJOUTÉE
import { Athlete } from '../entities/Athlete'; // <-- LIGNE AJOUTÉE
// Importe le middleware apiKeyMiddleware
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware';

// Crée une nouvelle instance de routeur Hono.
const publicRoutes = new Hono();

// Initialise le dépôt et le service d'athlètes.
// C'est un exemple simple d'injection de dépendances.
const athleteRepository = new AthleteRepository(AppDataSource.getRepository(Athlete));
const athleteService = new AthleteService(athleteRepository);
const athleteController = new AthleteController(); // Le contrôleur utilise le service

/**
 * Routes Publiques : Accessibles sans aucune authentification.
 * Ces routes sont généralement en lecture seule (GET).
 */

// Route pour récupérer tous les athlètes.
// Le .bind(athleteController) est important pour s'assurer que 'this' dans la méthode du contrôleur
// se réfère correctement à l'instance du contrôleur.
publicRoutes.get('/athletes', athleteController.getAllAthletes.bind(athleteController));

// Route pour récupérer un athlète par son ID, protégée par clé d'API
publicRoutes.get('/athletes/:id', apiKeyMiddleware, athleteController.getAthleteById.bind(athleteController));

// Exporte le routeur public pour être utilisé dans app.ts.
export { publicRoutes };
