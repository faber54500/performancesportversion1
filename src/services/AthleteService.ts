// services/AthleteService.ts

// Importe l'entité Athlete.
import { Athlete } from '../entities/Athlete';
// Importe le dépôt d'athlètes.
import { AthleteRepository } from '../repositories/AthleteRepository';

/**
 * @class AthleteService
 * @description Cette classe contient la logique métier liée aux athlètes.
 * Elle utilise AthleteRepository pour les opérations de base de données
 * et peut implémenter des règles métier complexes.
 */
export class AthleteService {
  private athleteRepository: AthleteRepository;

  /**
   * @constructor
   * @param athleteRepository L'instance de AthleteRepository, injectée via le constructeur.
   * C'est une forme d'injection de dépendances, rendant le service testable.
   */
  constructor(athleteRepository: AthleteRepository) {
    this.athleteRepository = athleteRepository;
  }

  /**
   * @method getAllAthletes
   * @description Récupère tous les athlètes. Pas de logique métier complexe ici, délègue simplement au dépôt.
   * @returns {Promise<Athlete[]>}
   */
  async getAllAthletes(): Promise<Athlete[]> {
    return this.athleteRepository.findAll();
  }

  /**
   * @method getAthleteById
   * @description Récupère un athlète par son ID.
   * @param {number} id L'ID de l'athlète.
   * @returns {Promise<Athlete | null>}
   */
  async getAthleteById(id: number): Promise<Athlete | null> {
    return this.athleteRepository.findById(id);
  }

  /**
   * @method createAthlete
   * @description Crée un nouvel athlète après avoir appliqué des validations ou règles métier.
   * @param {Partial<Athlete>} athleteData Les données du nouvel athlète.
   * @returns {Promise<Athlete>}
   * @throws {Error} Si des règles métier ne sont pas respectées (ex: âge invalide).
   */
  async createAthlete(athleteData: Partial<Athlete>): Promise<Athlete> {
    // Exemple de logique métier: s'assurer que l'âge est valide
    if (athleteData.Age && athleteData.Age < 10) {
      throw new Error("L'âge de l'athlète doit être d'au moins 10 ans.");
    }
    // D'autres validations métier peuvent être ajoutées ici (ex: poids, performance)

    return this.athleteRepository.create(athleteData);
  }

  /**
   * @method updateAthlete
   * @description Met à jour un athlète, potentiellement avec des règles métier avant la sauvegarde.
   * @param {number} id L'ID de l'athlète à mettre à jour.
   * @param {Partial<Athlete>} updateData Les données de mise à jour.
   * @returns {Promise<Athlete | null>}
   * @throws {Error} Si des règles métier ne sont pas respectées.
   */
  async updateAthlete(id: number, updateData: Partial<Athlete>): Promise<Athlete | null> {
    // Exemple de logique métier: si la performance est mise à jour, elle doit être positive
    if (updateData.Performance !== undefined && updateData.Performance < 0) {
      throw new Error("La performance de l'athlète ne peut pas être négative.");
    }
    // On pourrait aussi vérifier si l'athlète existe avant d'essayer de le mettre à jour,
    // bien que le dépôt gère déjà le cas où il n'est pas trouvé.

    return this.athleteRepository.update(id, updateData);
  }

  /**
   * @method deleteAthlete
   * @description Supprime un athlète. Peut inclure des vérifications de dépendances.
   * @param {number} id L'ID de l'athlète à supprimer.
   * @returns {Promise<boolean>} Vrai si supprimé, faux sinon.
   */
  async deleteAthlete(id: number): Promise<boolean> {
    // Exemple de logique métier: interdire la suppression si l'athlète a des records associés
    // (nécessiterait une relation '1N' ou 'NN' avec une autre entité, non implémentée ici)
    // const hasRecords = await this.recordRepository.countByAthleteId(id);
    // if (hasRecords > 0) {
    //   throw new Error("Impossible de supprimer l'athlète car il a des records associés.");
    // }

    return this.athleteRepository.delete(id);
  }
}