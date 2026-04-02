import { Hono } from 'hono';
import { getActivity, handleJoinActivity } from './activities.controller';

const activitiesRoute = new Hono();

activitiesRoute.get('/:id', getActivity);
activitiesRoute.post('/:id/join', handleJoinActivity);

export default activitiesRoute;
