import { Hono } from "hono";
import {
  createActivity,
  getActivity,
  getActivityImage,
  getJoinedActivities,
  joinActivity,
} from "./activities.controller";

const activitiesRoute = new Hono();

activitiesRoute.post("/", createActivity);
activitiesRoute.get("/joined", getJoinedActivities);
activitiesRoute.get("/:id", getActivity);
activitiesRoute.get("/:id/image", getActivityImage);
activitiesRoute.post("/:id/join", joinActivity);

export default activitiesRoute;
