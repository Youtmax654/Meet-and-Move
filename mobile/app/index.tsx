import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import { authClient } from "@/lib/auth-client";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function AuthIndexScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkingSession } = useAuthRedirect();
  const router = useRouter();

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      router.push({ pathname: "/otp", params: { email } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "meetandmove://",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (checkingSession) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} justifyContent="center" paddingHorizontal={20} gap={16}>
        <YStack gap={8} alignItems="center">
          <Text fontSize={28} fontWeight="800" color="#1E2228">
            Connexion
          </Text>
          <Text fontSize={14} color="#5B5C5B" textAlign="center">
            Accédez à votre compte pour rejoindre vos activités.
          </Text>
        </YStack>

        <Input
          placeholder="Adresse email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          disabled={loading}
          backgroundColor="#FFFFFF"
          borderColor="#E2E2E1"
          height={52}
          fontSize={15}
        />

        <Button
          onPress={handleEmailSubmit}
          disabled={!email || loading}
          backgroundColor="#006666"
          borderRadius={14}
          height={52}
          pressStyle={{ opacity: 0.9 }}
        >
          <Button.Text color="#FFFFFF" fontWeight="700">
            Continuer
          </Button.Text>
        </Button>

        <XStack alignItems="center" gap={12} marginVertical={8}>
          <YStack flex={1} height={1} backgroundColor="#E2E2E1" />
          <Text color="#5B5C5B">ou</Text>
          <YStack flex={1} height={1} backgroundColor="#E2E2E1" />
        </XStack>

        <Button
          variant="outlined"
          borderColor="#D6D7D6"
          height={50}
          backgroundColor="#FFFFFF"
          onPress={() => handleSocialSignIn("google")}
        >
          <Button.Text color="#1E2228" fontWeight="600">
            Se connecter avec Google
          </Button.Text>
        </Button>

        <Button
          variant="outlined"
          borderColor="#D6D7D6"
          height={50}
          backgroundColor="#FFFFFF"
          onPress={() => handleSocialSignIn("apple")}
        >
          <Button.Text color="#1E2228" fontWeight="600">
            Se connecter avec Apple
          </Button.Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
