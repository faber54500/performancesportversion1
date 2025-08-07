// config/database.ts

// Importe la classe DataSource de TypeORM, qui est le point d'entrée pour la connexion à la DB.
import { DataSource } from 'typeorm';
// Importe l'entité Athlete. Assurez-vous d'importer toutes vos entités ici.
import { Athlete } from '../entities/Athlete';
// Importe l'entité User si vous l'avez créée pour l'authentification.
import { User } from '../entities/User'; // Assurez-vous de créer cette entité dans entities/User.ts
// Importe la configuration de l'application, qui contient les variables d'environnement pour la DB.
import { config } from './../utils/config'; // Remontée d'un niveau pour l'accès aux utilitaires

/**
 * @constant AppDataSource
 * @description L'instance de TypeORM DataSource qui gère la connexion à la base de données.
 * Elle est configurée avec les informations de connexion et la liste des entités.
 */
export const AppDataSource = new DataSource({
  // Type de base de données. Changez selon votre choix (mysql, mariadb, postgres, etc.).
  type: "mysql",

  // Informations de connexion récupérées de l'objet de configuration (chargé depuis .env).
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,

  // Liste des entités (modèles de données) que TypeORM doit gérer.
  // Assurez-vous d'ajouter toutes vos entités ici.
  entities: [Athlete, User], // Ajoutez toutes vos entités ici (ex: Athlete, User, etc.)

  /**
   * `synchronize: true` : **À utiliser UNIQUEMENT en développement.**
   * Cette option synchronise automatiquement le schéma de la base de données avec vos entités
   * à chaque démarrage de l'application. Elle va créer ou modifier les tables, colonnes, etc.
   * C'est très pratique en développement pour éviter les migrations manuelles,
   * mais **JAMAIS en production** car cela peut entraîner des pertes de données.
   */
  synchronize: true,

  /**
   * `logging: false` : Active ou désactive la journalisation des requêtes SQL et autres événements TypeORM.
   * Peut être mis à 'all' ou à un tableau de chaînes pour un débogage détaillé en développement.
   * Ex: `logging: ['query', 'error']`
   */
  logging: false,
});

// AppDataSource sera ensuite initialisé dans `index.ts` avant le démarrage du serveur.