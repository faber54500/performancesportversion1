// services/AuthService.ts

import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, comparePassword } from '../utils/bcrypt'; // Importe les utilitaires de hachage Bcrypt
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

/**
 * @class AuthService
 * @description Gère la logique métier liée à l'authentification des utilisateurs,
 * y compris l'enregistrement et la validation des identifiants.
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @method registerUser
   * @description Enregistre un nouvel utilisateur. Hashe le mot de passe avant de le sauvegarder.
   * @param {string} username Le nom d'utilisateur.
   * @param {string} email L'adresse e-mail de l'utilisateur.
   * @param {string} password Le mot de passe en clair.
   * @param {'user' | 'admin'} role Le rôle de l'utilisateur.
   * @returns {Promise<User>} L'objet utilisateur créé.
   * @throws {Error} Si l'utilisateur (email ou nom d'utilisateur) existe déjà.
   */
  async registerUser(username: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    // Vérifie si un utilisateur avec cet email existe déjà
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error(`Un utilisateur avec l'adresse e-mail "${email}" existe déjà.`);
    }

    // Vérifie si un utilisateur avec ce nom d'utilisateur existe déjà
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error(`Un utilisateur avec le nom d'utilisateur "${username}" existe déjà.`);
    }

    // Hashe le mot de passe avant de le sauvegarder
    const hashedPassword = await hashPassword(password);

    // Crée le nouvel utilisateur
    const newUser = await this.userRepository.createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return newUser;
  }

  /**
   * @method validateUser
   * @description Valide les identifiants d'un utilisateur (email et mot de passe).
   * @param {string} email L'adresse e-mail de l'utilisateur.
   * @param {string} password Le mot de passe en clair fourni.
   * @returns {Promise<User | null>} L'objet utilisateur si les identifiants sont valides, sinon null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    console.log(`[AuthService] Validation de l'utilisateur : email = ${email}`);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      console.log(`[AuthService] Utilisateur non trouvé pour l'email : ${email}`);
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    console.log(`[AuthService] Résultat de la validation du mot de passe : ${isPasswordValid}`);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * @method login
   * @description Authentifie un utilisateur en vérifiant ses identifiants.
   * @param {string} email L'adresse e-mail de l'utilisateur.
   * @param {string} password Le mot de passe en clair.
   * @returns {Promise<string>} Un token JWT si l'authentification réussit.
   * @throws {Error} Si l'utilisateur n'existe pas ou si le mot de passe est incorrect.
   */
  async login(email: string, password: string): Promise<string> {
    console.log(`[AuthService] Tentative de connexion pour l'email : ${email}`);

    // Recherche l'utilisateur par e-mail
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      console.log(`[AuthService] Utilisateur non trouvé pour l'email : ${email}`);
      throw new Error('Utilisateur non trouvé.');
    }

    // Vérifie le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log(`[AuthService] Mot de passe incorrect pour l'email : ${email}`);
      throw new Error('Mot de passe incorrect.');
    }

    // Génère un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1h',
    });

    console.log(`[AuthService] Token généré avec succès pour l'email : ${email}`);
    return token;
  }
}