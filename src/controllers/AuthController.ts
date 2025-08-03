import { AuthService } from '../services/AuthService';
import { Context } from 'hono';
import { HttpException } from '../exceptions/HttpException';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Gère la connexion d'un utilisateur.
   * @param ctx - Le contexte de la requête Hono.
   */
  async login(ctx: Context) {
    try {
      console.log(`[AuthController] Requête reçue pour login avec les données :`, ctx.req.valid('json'));
      const { email, password } = ctx.req.valid('json');
      console.log(`[AuthController] email = ${email}, password = ${password}`);
      const token = await this.authService.login(email, password);
      console.log(`[AuthController] Token généré avec succès : ${token}`);
      
      // Retourne le token dans la réponse JSON
      return ctx.json({ token });
    } catch (error: any) {
      console.log(`[AuthController] Erreur lors de la connexion : ${error.message}`);
      throw new HttpException(401, error.message);
    }
  }

  /**
   * Gère l'enregistrement d'un nouvel utilisateur.
   * @param ctx - Le contexte de la requête Hono.
   */
  async register(ctx: Context) {
    try {
      const { username, email, password, role } = ctx.req.valid('json');
      const user = await this.authService.register(username, email, password, role);
      console.log(`[AuthController] Utilisateur enregistré avec succès : ${user.email}`);
      return ctx.json(user, 201); // Retourne l'utilisateur avec un statut 201
    } catch (error: any) {
      console.log(`[AuthController] Erreur lors de l'enregistrement : ${error.message}`);
      throw new HttpException(400, error.message);
    }
  }
}
