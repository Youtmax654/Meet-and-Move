import { Hono } from "hono";
import {
  getActivity,
  handleGetJoinedActivities,
  handleJoinActivity,
} from "./activities.controller";

const activitiesRoute = new Hono();

activitiesRoute.get("/joined", handleGetJoinedActivities);
activitiesRoute.get("/:id", getActivity);
activitiesRoute.post("/:id/join", handleJoinActivity);

export default activitiesRoute;
