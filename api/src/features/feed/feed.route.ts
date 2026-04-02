import { Hono } from 'hono';
import { getAllActivities } from './feed.controller';

const activitiesRoute = new Hono<{ Bindings: { DATABASE_URL: string } }>();

activitiesRoute.get('/:id', getAllActivities);

// You can add more routes here (e.g., POST /, GET /, etc.)

export default activitiesRoute;