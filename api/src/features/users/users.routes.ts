import { Hono } from "hono";
import {
	getCurrentUser,
	getCurrentUserActivities,
	getUserImage,
	updateCurrentUser,
} from "./users.controller";

const usersRoute = new Hono();

usersRoute.get("/me", getCurrentUser);
usersRoute.patch("/me", updateCurrentUser);
usersRoute.get("/me/activities", getCurrentUserActivities);
usersRoute.get("/:id/image", getUserImage);

export default usersRoute;
