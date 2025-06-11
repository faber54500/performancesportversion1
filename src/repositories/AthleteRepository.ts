// repositories/AthleteRepository.ts

// Importe les outils nécessaires de TypeORM pour la gestion des dépôts.
import { Repository } from 'typeorm';
// Importe l'entité Athlete.
import { Athlete } from '../entities/Athlete';

/**
 * @class AthleteRepository
 * @description Cette classe agit comme une couche d'abstraction pour les opérations
 * de base de données (CRUD) liées à l'entité Athlete.
 * Elle encapsule la logique d'interaction avec le dépôt TypeORM.
 */
export class AthleteRepository {
  private repository: Repository<Athlete>;

  /**
   * @constructor
   * @param athleteRepository L'instance du dépôt TypeORM pour l'entité Athlete,
   * injectée lors de la création du service.
   */
  constructor(athleteRepository: Repository<Athlete>) {
    this.repository = athleteRepository;
  }

  /**
   * @method findAll
   * @description Récupère tous les athlètes de la base de données.
   * @returns {Promise<Athlete[]>} Une promesse qui résout en un tableau d'athlètes.
   */
  async findAll(): Promise<Athlete[]> {
    return this.repository.find();
  }

  /**
   * @method findById
   * @description Récupère un athlète par son identifiant unique.
   * @param {number} id L'ID de l'athlète à rechercher.
   * @returns {Promise<Athlete | null>} Une promesse qui résout en l'athlète trouvé ou null si non trouvé.
   */
  async findById(id: number): Promise<Athlete | null> {
    // TypeORM 0.3.x utilise 'findOneBy' ou 'findOne' avec 'where' pour les requêtes par critères.
    return this.repository.findOne({ where: { id } });
  }

  /**
   * @method create
   * @description Crée et sauvegarde un nouvel athlète dans la base de données.
   * @param {Partial<Athlete>} athleteData Les données partielles du nouvel athlète.
   * 'Partial' permet de passer un objet qui ne contient pas toutes les propriétés,
   * utile pour la création où l'ID n'est pas encore défini.
   * @returns {Promise<Athlete>} Une promesse qui résout en l'athlète créé.
   */
  async create(athleteData: Partial<Athlete>): Promise<Athlete> {
    const newAthlete = this.repository.create(athleteData);
    return this.repository.save(newAthlete);
  }

  /**
   * @method update
   * @description Met à jour un athlète existant par son ID.
   * @param {number} id L'ID de l'athlète à mettre à jour.
   * @param {Partial<Athlete>} updateData Les données partielles à appliquer pour la mise à jour.
   * @returns {Promise<Athlete | null>} Une promesse qui résout en l'athlète mis à jour ou null si non trouvé.
   */
  async update(id: number, updateData: Partial<Athlete>): Promise<Athlete | null> {
    const athlete = await this.findById(id);
    if (!athlete) {
      return null;
    }
    // Fusionne les données existantes avec les nouvelles données.
    this.repository.merge(athlete, updateData);
    return this.repository.save(athlete);
  }

  /**
   * @method delete
   * @description Supprime un athlète par son ID.
   * @param {number} id L'ID de l'athlète à supprimer.
   * @returns {Promise<boolean>} Une promesse qui résout à true si la suppression a réussi, false sinon.
   */
  async delete(id: number): Promise<boolean> {
    const athlete = await this.findById(id);
    if (!athlete) {
      return false; // L'athlète n'existe pas
    }
    await this.repository.remove(athlete);
    return true; // Suppression réussie
  }
}