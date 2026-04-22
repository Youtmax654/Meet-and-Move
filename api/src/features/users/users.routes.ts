import { Hono } from "hono";

import { getUserProfile } from "./users.controller";

const usersRoute = new Hono();

usersRoute.get("/:id/profile", getUserProfile);

export default usersRoute;

