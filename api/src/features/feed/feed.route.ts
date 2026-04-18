import { Hono } from "hono";
import { getAllActivities, getGuides } from "./feed.controller";

const feedRoute = new Hono();

feedRoute.get("/", getAllActivities);
feedRoute.get("/guides", getGuides);

export default feedRoute;
