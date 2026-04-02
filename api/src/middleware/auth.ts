import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const userId = c.req.header('X-Debug-User-Id');
  
  if (!userId) {
    return c.json({ error: "Non autorisé, veuillez vous connecter (Debug User Picker)." }, 401);
  }

  console.debug(`Authentification réussie pour l'utilisateur avec ID: ${userId}`);

  c.set('userId', userId);
  await next();
};
