import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Input, Button, Text } from "tamagui";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/features/auth/auth.errors";

export default function OtpScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const result = await authClient.signIn.emailOtp({ email, otp });
      if (result.error && result.error.code) {
        throw result.error;
      }
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(
        getAuthErrorMessage(e.code ? e.code : undefined) || "Code invalide",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} justifyContent="center" paddingHorizontal={20} gap={16}>
        <YStack gap={8} alignItems="center">
          <Text fontSize={24} fontWeight="800" color="#1E2228">
            Vérification
          </Text>
          <Text textAlign="center" color="#5B5C5B" fontSize={14}>
            Saisissez le code envoyé à {email}
          </Text>
        </YStack>

        <Input
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          value={otp}
          onChangeText={setOtp}
          disabled={loading}
          backgroundColor="#FFFFFF"
          borderColor="#E2E2E1"
          height={52}
          fontSize={16}
          letterSpacing={4}
        />

        {error ? (
          <Text color="#D64545" textAlign="center" fontSize={13}>
            {error}
          </Text>
        ) : null}

        <Button
          onPress={handleVerify}
          disabled={otp.length !== 6 || loading}
          backgroundColor="#006666"
          borderRadius={14}
          height={52}
          pressStyle={{ opacity: 0.9 }}
        >
          <Button.Text color="#FFFFFF" fontWeight="700">
            {loading ? "Vérification..." : "Vérifier"}
          </Button.Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
