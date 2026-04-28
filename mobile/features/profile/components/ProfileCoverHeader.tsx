import { Image } from "react-native";
import { YStack } from "tamagui";

type ProfileCoverHeaderProps = {
  bannerUrl: string;
};

export function ProfileCoverHeader({ bannerUrl }: ProfileCoverHeaderProps) {
  return (
    <YStack position="relative" height={210} backgroundColor="#E2E2E1">
      <Image
        source={{ uri: bannerUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </YStack>
  );
}
