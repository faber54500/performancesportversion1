// types/index.ts

/**
 * @fileoverview Ce fichier centralise les définitions de types et d'interfaces TypeScript
 * utilisées à travers l'application. Cela aide à maintenir une cohérence
 * et à faciliter la refactorisation.
 */

/**
 * @interface UserPayload
 * @description Définit la structure du payload (charge utile) d'un token JWT
 * pour un utilisateur authentifié.
 * Ce sont les informations que nous stockons dans le token et
 * que nous récupérons après vérification.
 */
export interface UserPayload {
    userId: string;         // L'ID unique de l'utilisateur (ex: UUID, ID de la DB)
    username: string;       // Le nom d'utilisateur
    email: string;          // L'adresse email de l'utilisateur
    role: 'user' | 'admin'; // Le rôle de l'utilisateur (pour l'autorisation)
    // Autres champs que vous pourriez vouloir inclure dans le token (ex: organisationId, etc.)
    iat?: number;           // Issued At (timestamp de création du token)
    exp?: number;           // Expiration Time (timestamp d'expiration du token)
  }
  
  /**
   * @interface JWTPayload
   * @description Étend UserPayload pour inclure les champs standard JWT (iat, exp, etc.).
   * Utile si vous avez besoin d'une représentation complète du token.
   */
  export interface JWTPayload extends UserPayload {
    iat: number; // Timestamp de création du token
    exp: number; // Timestamp d'expiration du token
  }
  
  /**
   * @type PartialAthlete
   * @description Un type utilitaire pour représenter les données d'un athlète
   * qui peuvent être partielles (non toutes les propriétés sont requises),
   * utile pour les opérations de création ou de mise à jour.
   * Il s'agit d'un exemple plus explicite de ce que 'Partial<Athlete>' fournit.
   */
  // import { Athlete } from '../entities/Athlete'; // Pour l'utiliser, il faudrait importer Athlete
  // export type PartialAthlete = Partial<Athlete>;
  
  
  // Vous pouvez ajouter d'autres types d'entrée/sortie pour les API,
  // des types de configuration, des types d'erreurs, etc.
  // Par exemple:
  // export interface ApiResponse<T> {
  //   message: string;
  //   data?: T;
  //   errors?: string[];
  // }
  
  // export type Role = 'guest' | 'standard' | 'premium';
  