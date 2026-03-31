import { Hono } from 'hono';
import { getActivity } from './activities.controller';

const activitiesRoute = new Hono<{ Bindings: { DATABASE_URL: string } }>();

activitiesRoute.get('/:id', getActivity);

// You can add more routes here (e.g., POST /, GET /, etc.)

export default activitiesRoute;
