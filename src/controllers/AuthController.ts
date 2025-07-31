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
      const { email, password } = ctx.req.valid('json');
      const token = await this.authService.login(email, password);
      ctx.json({ token });
    } catch (error) {
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
      ctx.status(201).json(user);
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }
}
