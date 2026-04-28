import { Hono } from "hono";
import {
  createActivity,
  getActivity,
  getJoinedActivities,
  joinActivity,
} from "./activities.controller";

const activitiesRoute = new Hono();

activitiesRoute.post("/", createActivity);
activitiesRoute.get("/joined", getJoinedActivities);
activitiesRoute.get("/:id", getActivity);
activitiesRoute.post("/:id/join", joinActivity);

export default activitiesRoute;
