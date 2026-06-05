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

/**
 * Returns the current authenticated user's id, or null if not signed in.
 *
 * For React components, prefer the reactive `authClient.useSession()` hook:
 *   const { data } = authClient.useSession();
 *   const userId = data?.user?.id ?? null;
 */
export async function getUserId(): Promise<string | null> {
  const { data } = await authClient.getSession();
  return data?.user?.id ?? null;
}
