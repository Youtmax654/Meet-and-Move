import { db } from "../../db";
import { user } from "../../db/schema";

const authService = {
  getAllUsers: async () => {
    return db.select().from(user);
  },

  getUserById: async (id: string) => {
    return db.query.user.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  },
};

export default authService;
