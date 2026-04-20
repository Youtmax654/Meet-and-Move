import { Hono } from "hono";
import { getDevUserById, getDevUsers } from "./auth.controller";

const authRoute = new Hono();

authRoute.get("/dev/users", getDevUsers);
authRoute.get("/dev/users/:id", getDevUserById);

export default authRoute;
