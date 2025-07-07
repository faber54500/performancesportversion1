// controllers/AthleteController.ts

// Importe le type Context de Hono pour gérer les requêtes et réponses HTTP.
import { Context } from 'hono';
// Importe le DataSource de TypeORM pour interagir avec la base de données.
import { AppDataSource } from '../config/database'; // Assurez-vous que ce chemin est correct
// Importe l'entité Athlete.
import { Athlete } from '../entities/Athlete';

/**
 * AthleteController contient la logique métier pour les requêtes HTTP
 * liées aux athlètes.
 * Dans une application complète, il déléguerait les appels à un service (AthleteService)
 * qui lui-même utiliserait un dépôt (AthleteRepository) pour interagir avec la DB.
 * Pour cette PoC, nous interfaçons directement avec le dépôt TypeORM.
 */
export class AthleteController {
  // Récupère le dépôt (repository) TypeORM pour l'entité Athlete.
  private athleteRepository = AppDataSource.getRepository(Athlete);

  /**
   * Méthode publique pour récupérer tous les athlètes.
   * Accessible aux utilisateurs anonymes.
   * @param c Le contexte Hono (requête, réponse, etc.).
   * @returns Une réponse JSON contenant la liste des athlètes.
   */
  public async getAllAthletes(c: Context) {
    try {
      // Récupère les paramètres de requête pour le filtrage et le tri
      const query = c.req.query();
      // Construction dynamique des filtres TypeORM
      const filters: any = {};
      if (query.Name) filters.Name = query.Name;
      if (query.Gender) filters.Gender = query.Gender;
      if (query.Age) filters.Age = Number(query.Age);
      if (query.Weight) filters.Weight = Number(query.Weight);
      if (query.Runtime) filters.Runtime = Number(query.Runtime);
      if (query.Oxygen_consumption) filters.Oxygen_consumption = Number(query.Oxygen_consumption);
      if (query.Run_pulse) filters.Run_pulse = Number(query.Run_pulse);
      if (query.Res_pulse) filters.Res_pulse = Number(query.Res_pulse);
      if (query.Maximum_pulse) filters.Maximum_pulse = Number(query.Maximum_pulse);
      if (query.Performance) filters.Performance = Number(query.Performance);
      // Ajoutez d'autres filtres selon les besoins

      // Gestion du tri
      let order: any = undefined;
      if (query.sort) {
        const sortField = query.sort;
        const sortOrder = (query.order && query.order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
        order = { [sortField]: sortOrder };
      }

      // Ajout de l'imbrication des données (relations)
      const relations = ['programme'];

      // Si aucun filtre, retourne tout (avec ou sans tri)
      const athletes = Object.keys(filters).length === 0
        ? await this.athleteRepository.find({ order, relations })
        : await this.athleteRepository.find({ where: filters, order, relations });
      return c.json(athletes, 200);
    } catch (error) {
      console.error('Erreur lors de la récupération des athlètes:', error);
      return c.json({ message: 'Erreur interne du serveur lors de la récupération des athlètes.' }, 500);
    }
  }

  /**
   * Méthode publique pour récupérer un athlète par son ID.
   * Accessible aux utilisateurs anonymes.
   * @param c Le contexte Hono. L'ID de l'athlète est attendu dans les paramètres de l'URL.
   * @returns Une réponse JSON contenant l'athlète trouvé ou un message d'erreur.
   */
  public async getAthleteById(c: Context) {
    try {
      // Récupère l'ID depuis les paramètres de l'URL et le convertit en nombre.
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        // Retourne une erreur 400 Bad Request si l'ID n'est pas valide.
        return c.json({ message: 'ID d\'athlète invalide.' }, 400);
      }

      // Cherche un athlète par son ID avec imbrication du programme.
      const athlete = await this.athleteRepository.findOne({ where: { id }, relations: ['programme'] });

      if (!athlete) {
        // Retourne une erreur 404 Not Found si l'athlète n'est pas trouvé.
        return c.json({ message: `Athlète avec l'ID ${id} non trouvé.` }, 404);
      }

      // Retourne l'athlète trouvé.
      return c.json(athlete, 200);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'athlète par ID:', error);
      return c.json({ message: 'Erreur interne du serveur lors de la récupération de l\'athlète.' }, 500);
    }
  }

  /**
   * Méthode privée pour créer un nouvel athlète.
   * Nécessite une authentification (utilisateur authentifié).
   * @param c Le contexte Hono. Le corps de la requête doit contenir les données de l'athlète.
   * @returns Une réponse JSON confirmant la création de l'athlète.
   */
  public async createAthlete(c: Context) {
    // Ici, vous vérifieriez l'authentification et l'autorisation avant de continuer.
    // Ex: validation du token JWT dans un middleware d'authentification.
    // if (!c.get('user')) { return c.json({ message: 'Non autorisé' }, 401); }

    try {
      // Parse le corps de la requête pour obtenir les données de l'athlète.
      // Un middleware de validation (ex: Zod) serait utilisé ici pour valider le schéma des données.
      const newAthleteData = await c.req.json();

      // Crée une nouvelle instance d'Athlete avec les données reçues.
      const newAthlete = this.athleteRepository.create(newAthleteData);
      // Sauvegarde le nouvel athlète dans la base de données.
      await this.athleteRepository.save(newAthlete);

      // Retourne une réponse 201 Created avec le nouvel athlète.
      return c.json(newAthlete, 201);
    } catch (error) {
      console.error('Erreur lors de la création d\'un athlète:', error);
      // Gère les erreurs de validation ou de base de données.
      return c.json({ message: 'Erreur interne du serveur lors de la création de l\'athlète.', error: error.message }, 500);
    }
  }

  /**
   * Méthode privée pour mettre à jour un athlète existant.
   * Nécessite une authentification (utilisateur authentifié).
   * @param c Le contexte Hono. L'ID de l'athlète est dans les paramètres, les données dans le corps.
   * @returns Une réponse JSON confirmant la mise à jour ou un message d'erreur.
   */
  public async updateAthlete(c: Context) {
    // Vérification d'authentification et d'autorisation ici.
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ message: 'ID d\'athlète invalide.' }, 400);
      }

      // Récupère les données de mise à jour du corps de la requête.
      const updatedData = await c.req.json();

      // Cherche l'athlète à mettre à jour.
      const athlete = await this.athleteRepository.findOne({ where: { id } });

      if (!athlete) {
        return c.json({ message: `Athlète avec l'ID ${id} non trouvé.` }, 404);
      }

      // Fusionne les données existantes avec les nouvelles données.
      this.athleteRepository.merge(athlete, updatedData);
      // Sauvegarde les modifications.
      const result = await this.athleteRepository.save(athlete);

      // Retourne l'athlète mis à jour.
      return c.json(result, 200);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'athlète:', error);
      return c.json({ message: 'Erreur interne du serveur lors de la mise à jour de l\'athlète.', error: error.message }, 500);
    }
  }

  /**
   * Méthode privée pour supprimer un athlète.
   * Nécessite une authentification (utilisateur authentifié).
   * @param c Le contexte Hono. L'ID de l'athlète est attendu dans les paramètres de l'URL.
   * @returns Une réponse JSON confirmant la suppression ou un message d'erreur.
   */
  public async deleteAthlete(c: Context) {
    // Vérification d'authentification et d'autorisation ici.
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ message: 'ID d\'athlète invalide.' }, 400);
      }

      // Cherche l'athlète à supprimer.
      const athlete = await this.athleteRepository.findOne({ where: { id } });

      if (!athlete) {
        return c.json({ message: `Athlète avec l'ID ${id} non trouvé.` }, 404);
      }

      // Supprime l'athlète.
      await this.athleteRepository.remove(athlete);

      // Retourne une réponse 204 No Content pour indiquer une suppression réussie sans corps de réponse.
      return c.json({ message: 'Athlète supprimé avec succès.' }, 204);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'athlète:', error);
      return c.json({ message: 'Erreur interne du serveur lors de la suppression de l\'athlète.' }, 500);
    }
  }
}