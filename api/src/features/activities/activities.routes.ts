import { Hono } from "hono";
import {
  getActivity,
  getJoinedActivities,
  joinActivity,
  modifyActivity,
} from "./activities.controller";

const activitiesRoute = new Hono();

activitiesRoute.get("/joined", getJoinedActivities);
activitiesRoute.get("/:id", getActivity);
activitiesRoute.post("/:id/join", joinActivity);
activitiesRoute.patch("/:id", modifyActivity);

export default activitiesRoute;
