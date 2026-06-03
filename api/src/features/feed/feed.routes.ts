import { Hono } from "hono";
import { getAllActivities } from "./feed.controller";

const feedRoute = new Hono();

feedRoute.get("/", getAllActivities);

export default feedRoute;
