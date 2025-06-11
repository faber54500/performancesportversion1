// repositories/UserRepository.ts

import { Repository } from 'typeorm';
import { User } from '../entities/User';

/**
 * @class UserRepository
 * @description Gère les opérations d'accès à la base de données pour l'entité User.
 */
export class UserRepository {
  private repository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.repository = userRepository;
  }

  /**
   * @method findByEmail
   * @description Recherche un utilisateur par son adresse e-mail.
   * @param {string} email L'adresse e-mail de l'utilisateur.
   * @returns {Promise<User | null>} L'utilisateur trouvé ou null.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  /**
   * @method findByUsername
   * @description Recherche un utilisateur par son nom d'utilisateur.
   * @param {string} username Le nom d'utilisateur.
   * @returns {Promise<User | null>} L'utilisateur trouvé ou null.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  /**
   * @method createUser
   * @description Crée et sauvegarde un nouvel utilisateur dans la base de données.
   * @param {Partial<User>} userData Les données du nouvel utilisateur.
   * @returns {Promise<User>} L'utilisateur créé.
   */
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.repository.create(userData);
    return this.repository.save(newUser);
  }

  // Vous pouvez ajouter d'autres méthodes CRUD si nécessaire (ex: update, delete user).
}