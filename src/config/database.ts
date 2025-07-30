// config/database.ts fichier du 30/07/2025


// Importe la classe DataSource de TypeORM, qui est le point d'entrée pour la connexion à la DB.
import { DataSource } from 'typeorm';
// Importe l'entité Athlete qui va donner la structure de la base de donnée.
import { Athlete } from '../entities/Athlete';
// Importe l'entité User qui va permettre de lire, créer, modifier ou supprimer des utilisateurs. 
import { User } from '../entities/User'; 
// Importe l'entité Programme qui va permettre de gérer les programmes des athlètes.
import { Programme } from '../entities/Programme';
// Importe l'entité ApiKey qui va permettre de gérer les clés API pour l'authentification.
import { ApiKey } from '../entities/ApiKey'; 
// Importe la configuration qui va faire un pont avec le fichier .env
import { config } from '../utils/config';
 
//Exportation de la constante AppDataSource pour se connecter à la basse de donnée. 
export const AppDataSource = new DataSource({
  
  type: "mysql",

  // Informations de connexion chargées depuis .env.
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,

  // Liste des entités (modèles de données) que TypeORM doit gérer 
  // Cette classe est une entité TypeORM et la lie à sa table de base de données
  entities: [Athlete, User, Programme, ApiKey], 

  //Synchronize: true s'utlise uniquement en dévellopement 
  // Cette option synchronise automatiquement le schéma de la base de données avec vos entités
  // à chaque démarrage de l'application. Elle va créer ou modifier les tables, colonnes ...
   
  synchronize: true,

  // n'affiche pas les requêtes SQL dans la console. 
  logging: false,
});

