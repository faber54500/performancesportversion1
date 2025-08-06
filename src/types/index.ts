import dotenv from 'dotenv';
dotenv.config();

// Définition du type UserPayload pour JWT
export interface UserPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
  [key: string]: any; // Pour permettre d'autres champs éventuels
}