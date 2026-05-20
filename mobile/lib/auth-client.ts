import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

export const authClient = createAuthClient({
  baseURL,
  plugins: [emailOTPClient()],
});
