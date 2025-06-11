// services/AuthService.ts

import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, comparePassword } from '../utils/bcrypt'; // Importe les utilitaires de hachage Bcrypt
import { User } from '../entities/User';

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
    const user = await this.userRepository.findByEmail(email);

    // Si aucun utilisateur n'est trouvé avec cet email
    if (!user) {
      return null;
    }

    // Compare le mot de passe fourni avec le mot de passe haché stocké
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}