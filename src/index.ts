// index.ts

// Importe l'application Hono configurée depuis app.ts.
import app from './app';
// Importe le DataSource de TypeORM pour l'initialisation de la base de données.
import { AppDataSource } from './config/database'; // Assurez-vous que ce chemin est correct

/**
 * Point d'entrée principal de l'application.
 * Ce fichier est responsable de l'initialisation de la base de données
 * et du démarrage du serveur Hono.
 */

// Définit le port sur lequel l'application écoutera.
// Utilise la variable d'environnement PORT si elle existe, sinon utilise 3000 par défaut.
// Note: Dans Bun, les variables d'environnement sont accessibles via `process.env`.
// Assurez-vous d'avoir un fichier .env à la racine de votre projet si vous l'utilisez.
const port = parseInt(process.env.PORT || '3000');

// Fonction asynchrone pour initialiser l'application.
const startServer = async () => {
  try {
    // Initialise la connexion à la base de données via TypeORM DataSource.
    // Cela se connectera à la base de données selon les configurations définies dans database.ts.
    await AppDataSource.initialize();
    console.log('Connexion à la base de données établie avec succès !');

    // Démarre le serveur Hono en utilisant Bun.serve.
    // Le serveur écoute sur le port défini.
    Bun.serve({
      fetch: app.fetch, // Utilise la méthode fetch de l'application Hono pour gérer les requêtes
      port, // Le port sur lequel le serveur écoutera
    });

    console.log(`Serveur Hono démarré sur le port ${port}`);
    console.log(`Accédez à http://localhost:${port}`);
  } catch (error) {
    // Gère les erreurs d'initialisation de la base de données ou de démarrage du serveur.
    console.error('Erreur lors du démarrage du serveur ou de la connexion à la base de données:', error);
    process.exit(1); // Arrête le processus en cas d'erreur critique.
  }
};

// Appelle la fonction pour démarrer le serveur.
startServer();
