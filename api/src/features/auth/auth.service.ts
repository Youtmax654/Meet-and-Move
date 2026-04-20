import { getDb } from "../../db";
import { users } from "../../db/schema";

const authService = {
  getAllUsers: async () => {
    return getDb().select().from(users);
  },

  getUserById: async (id: string) => {
    return getDb().query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  },
};

export default authService;
