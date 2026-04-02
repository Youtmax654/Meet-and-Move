import { Hono } from 'hono';
import { getAllActivities, getGuides } from './feed.controller';

const feedRoute = new Hono<{ Bindings: { DATABASE_URL: string } }>();

feedRoute.get('/', getAllActivities);
feedRoute.get('/guides', getGuides);

export default feedRoute;