import { Hono } from "hono";
import {
  createActivity,
  getActivity,
  getJoinedActivities,
  joinActivity,
  updateActivity,
} from "./activities.controller";

const activitiesRoute = new Hono();

activitiesRoute.get("/joined", getJoinedActivities);
activitiesRoute.post("/", createActivity);
activitiesRoute.get("/:id", getActivity);
activitiesRoute.post("/:id/join", joinActivity);
activitiesRoute.patch("/:id", updateActivity);

export default activitiesRoute;
