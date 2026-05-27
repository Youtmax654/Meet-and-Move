import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

export const authClient = createAuthClient({
  baseURL: `${baseURL}/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    expoClient({
      scheme: "meetandmove",
      storagePrefix: "meet-and-move-auth",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
