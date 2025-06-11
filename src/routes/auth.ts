// routes/auth.ts

import { Hono } from 'hono';
import { z } from 'zod'; // Pour la validation des schémas d'entrée
import { zValidator } from '@hono/zod-validator'; // Middleware de validation Hono pour Zod
import { AuthController } from '../controllers/AuthController'; // Contrôleur d'authentification (à créer)
import { AppDataSource } from '../config/database'; // Importe le DataSource
import { UserRepository } from '../repositories/UserRepository'; // Dépôt utilisateur (à créer)
import { AuthService } from '../services/AuthService'; // Service d'authentification (à créer)
import { User } from '../entities/User'; // Entité utilisateur (à créer)
import { generateToken } from '../utils/jwt'; // Utilitaire JWT
import { comparePassword, hashPassword } from '../utils/bcrypt'; // Utilitaire Bcrypt


// Crée une nouvelle instance de routeur Hono.
const authRoutes = new Hono();

// Initialisation des dépendances pour le contrôleur d'authentification
// Assurez-vous que l'entité User existe et que les dépôts/services sont correctement configurés
const userRepository = new UserRepository(AppDataSource.getRepository(User)); // Assurez-vous que User est importé
const authService = new AuthService(userRepository);
const authController = new AuthController(authService); // Le contrôleur utilise le service

/**
 * Schéma Zod pour la validation de l'enregistrement (register).
 */
const registerSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit avoir au moins 3 caractères.'),
  email: z.string().email('Format d\'e-mail invalide.'),
  password: z.string().min(8, 'Le mot de passe doit avoir au moins 8 caractères.'),
  role: z.enum(['user', 'admin']).default('user'), // Optionnel: avec rôle par défaut
});

/**
 * Schéma Zod pour la validation de la connexion (login).
 */
const loginSchema = z.object({
  email: z.string().email('Format d\'e-mail invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'), // Minimum 1 pour non-vide
});

/**
 * Routes d'Authentification :
 * Gèrent l'enregistrement de nouveaux utilisateurs et la connexion.
 */

// Route pour l'enregistrement d'un nouvel utilisateur.
// Utilise zValidator pour valider les données de la requête POST.
authRoutes.post('/register', zValidator('json', registerSchema), authController.register.bind(authController));

// Route pour la connexion d'un utilisateur existant et l'obtention d'un JWT.
authRoutes.post('/login', zValidator('json', loginSchema), authController.login.bind(authController));

// Exporte le routeur d'authentification.
export { authRoutes };