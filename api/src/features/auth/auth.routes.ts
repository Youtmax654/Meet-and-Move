import { Hono } from "hono";
import { getDb } from "../../db";
import { users } from "../../db/schema";

const authRoute = new Hono();

// Temporary debug route to get all users
authRoute.get("/dev/users", async (c) => {
  const db = getDb();
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

// Temporary debug route to get user details by id
authRoute.get("/dev/users/:id", async (c) => {
  const db = getDb();
  const id = c.req.param("id");
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  
  return c.json(user);
});

export default authRoute;
