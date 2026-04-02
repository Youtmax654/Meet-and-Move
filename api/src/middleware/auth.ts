import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const path = c.req.path;
  
  // Skip auth for base route and auth routes
  if (path === "/" || path.startsWith("/auth/")) {
    return await next();
  }

  const userId = c.req.header('X-Debug-User-Id');
  
  if (!userId) {
    return c.json({ error: "Non autorisé, veuillez vous connecter (Debug User Picker)." }, 401);
  }
  
  c.set('userId', userId);
  await next();
};
