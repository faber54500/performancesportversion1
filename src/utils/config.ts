// utils/config.ts

// Importe la bibliothèque dotenv pour charger les variables d'environnement depuis un fichier .env.
// Assurez-vous d'avoir 'dotenv' installé (bun add dotenv).
// Si vous exécutez avec Bun, il gère nativement les .env, mais l'importation de dotenv
// reste une bonne pratique pour la clarté et la compatibilité avec d'autres runtimes si besoin.
import 'dotenv/config'; // Charge les variables d'environnement dès l'importation de ce fichier.

/**
 * @interface AppConfig
 * @description Définit la structure des variables de configuration de l'application.
 */
interface AppConfig {
  port: number;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword?: string; // Optionnel car peut ne pas exister pour certains utilisateurs/DBs
  dbName: string;
  jwtSecret: string;
  // Ajoutez d'autres configurations ici (ex: API_KEY, LOG_LEVEL, etc.)
}

/**
 * @constant config
 * @description Objet de configuration qui contient toutes les variables d'environnement
 * nécessaires à l'application. Les valeurs sont lues depuis `process.env`.
 * Une validation simple est effectuée pour s'assurer que les variables critiques sont présentes.
 */
export const config: AppConfig = {
  // Récupère le port du serveur, par défaut 3000.
  port: parseInt(process.env.PORT || '3000', 10),

  // Informations de connexion à la base de données.
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'donne_sport',

  // Clé secrète pour la signature des tokens JWT.
  // C'est CRITIQUE qu'elle soit définie et gardée SECRÈTE.
  jwtSecret: process.env.JWT_SECRET || 'superSecretKey', // À CHANGER ABSOLUMENT EN PRODUCTION!
};

// Petite vérification pour les variables critiques.
if (!config.jwtSecret || config.jwtSecret === 'superSecretKey') {
  console.warn('AVERTISSEMENT: JWT_SECRET est une clé par défaut ou non définie. VEUILLEZ LA CHANGER EN PRODUCTION POUR DES RAISONS DE SÉCURITÉ.');
}

if (!process.env.DB_HOST || !process.env.DB_NAME) {
  console.warn('AVERTISSEMENT: Les variables de configuration de la base de données (DB_HOST, DB_NAME) semblent manquantes ou utilisent des valeurs par défaut. Vérifiez votre fichier .env.');
}

// Optionnel: Fonction pour recharger la configuration si nécessaire (rarement utile pour un backend).
// export const reloadConfig = () => {
//   // Implémentation pour recharger les variables d'environnement
//   // Ce n'est généralement pas fait en production car les apps sont redémarrées
//   // mais peut être utile en dev.
//   require('dotenv').config();
//   // Mettre à jour l'objet config...
// };
