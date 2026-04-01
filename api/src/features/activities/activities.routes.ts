import { Hono } from 'hono';
import { getActivity } from './activities.controller';

const activitiesRoute = new Hono();

activitiesRoute.get('/:id', getActivity);

// You can add more routes here (e.g., POST /, GET /, etc.)

export default activitiesRoute;
