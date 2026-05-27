import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

type ProfileCheck = {
  name?: string | null;
  age?: number | null;
  gender?: string | null;
};

export function useAuthRedirect() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (!isMounted || !session?.data) {
          return;
        }

        try {
          const response = await api.get("/users/me");
          const profile = response.data as ProfileCheck;

          const needsProfile =
            !profile.name || profile.age === null || !profile.gender;

          router.replace(needsProfile ? "/signup" : "/(tabs)");
        } catch (err) {
          console.error(err);
          router.replace("/signup");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { checkingSession };
}
