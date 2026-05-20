import { getDb } from "../../db";
import { user } from "../../db/schema";

const authService = {
  getAllUsers: async () => {
    return getDb().select().from(user);
  },

  getUserById: async (id: string) => {
    return getDb().query.user.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  },
};

export default authService;
