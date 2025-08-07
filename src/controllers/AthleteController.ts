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
      // Récupère tous les athlètes de la base de données.
      const athletes = await this.athleteRepository.find();
      // Retourne une réponse avec le statut 200 OK et les données.
      return c.json(athletes, 200);
    } catch (error) {
      // Gère les erreurs et retourne une réponse 500 Internal Server Error.
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
    console.log('[AthleteController] getAthleteById appelé, params:', c.req.param('id'), 'user:', c.get('user'));
    try {
      // Récupère l'ID depuis les paramètres de l'URL et le convertit en nombre.
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        // Retourne une erreur 400 Bad Request si l'ID n'est pas valide.
        return c.json({ message: 'ID d\'athlète invalide.' }, 400);
      }

      // Cherche un athlète par son ID.
      const athlete = await this.athleteRepository.findOne({ where: { id } });

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
    // Vérification du rôle : seul un admin peut créer
    const user = c.get('user');
    if (!user || user.role !== 'admin') {
      return c.json({ message: 'Accès refusé : seul un admin peut créer un athlète.' }, 403);
    }
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
    // Vérification du rôle : seul un admin peut modifier
    const user = c.get('user');
    if (!user || user.role !== 'admin') {
      return c.json({ message: 'Accès refusé : seul un admin peut modifier un athlète.' }, 403);
    }
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
    // Vérification du rôle : seul un admin peut supprimer
    const user = c.get('user');
    if (!user || user.role !== 'admin') {
      return c.json({ message: 'Accès refusé : seul un admin peut supprimer un athlète.' }, 403);
    }
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
      // Retourne une réponse 200 OK pour indiquer une suppression réussie.
      return c.json({ message: 'Athlète supprimé avec succès.' }, 200);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'athlète:', error);
      return c.json({ message: 'Erreur interne du serveur lors de la suppression de l\'athlète.' }, 500);
    }
  }

  /**
   * Méthode pour filtrer les athlètes selon le rôle/id utilisateur.
   * admin : tous, user1 : impairs, user2 : pairs
   */
  public async getFilteredAthletes(c: Context) {
    // Récupère l'utilisateur depuis le contexte (typage any pour compatibilité)
    const user: any = c.get('user');
    if (!user) {
      return c.json({ message: 'Authentification requise.' }, 401);
    }
    try {
      let athletes = await this.athleteRepository.find();
      if (user.role === 'admin') {
        // Admin : accès total
        return c.json(athletes, 200);
      } else if (user.id === 1) {
        // user1 : impairs
        athletes = athletes.filter(a => a.id % 2 === 1);
        return c.json(athletes, 200);
      } else if (user.id === 2) {
        // user2 : pairs
        athletes = athletes.filter(a => a.id % 2 === 0);
        return c.json(athletes, 200);
      } else {
        return c.json({ message: 'Rôle ou id utilisateur non autorisé.' }, 403);
      }
    } catch (error) {
      console.error('Erreur lors du filtrage des athlètes:', error);
      return c.json({ message: 'Erreur interne du serveur lors du filtrage des athlètes.' }, 500);
    }
  }

  /**
   * Méthode pour filtrer les athlètes selon l'id utilisateur passé en paramètre.
   * id=1 : impairs, id=2 : pairs, admin : tous
   */
  public async getFilteredAthletesById(c: Context, userId: number) {
    // Récupère l'utilisateur authentifié depuis le contexte
    const user: any = c.get('user');
    if (!user) {
      return c.json({ message: 'Authentification requise.' }, 401);
    }
    try {
      let athletes = await this.athleteRepository.find();
      if (user.role === 'admin') {
        // Admin : accès total
        return c.json(athletes, 200);
      } else if (userId === 1) {
        // user1 : impairs
        athletes = athletes.filter(a => a.id % 2 === 1);
        return c.json(athletes, 200);
      } else if (userId === 2) {
        // user2 : pairs
        athletes = athletes.filter(a => a.id % 2 === 0);
        return c.json(athletes, 200);
      } else {
        return c.json({ message: 'Rôle ou id utilisateur non autorisé.' }, 403);
      }
    } catch (error) {
      console.error('Erreur lors du filtrage des athlètes par id:', error);
      return c.json({ message: 'Erreur interne du serveur lors du filtrage des athlètes.' }, 500);
    }
  }
}