import { Hono } from "hono";
import { getCurrentUser, getCurrentUserActivities } from "./users.controller";

const usersRoute = new Hono();

usersRoute.get("/me", getCurrentUser);
usersRoute.get("/me/activities", getCurrentUserActivities);

export default usersRoute;
