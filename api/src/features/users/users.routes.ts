import { Hono } from "hono";
import {
	getCurrentUser,
	getCurrentUserActivities,
	updateCurrentUser,
} from "./users.controller";

const usersRoute = new Hono();

usersRoute.get("/me", getCurrentUser);
usersRoute.patch("/me", updateCurrentUser);
usersRoute.get("/me/activities", getCurrentUserActivities);

export default usersRoute;
