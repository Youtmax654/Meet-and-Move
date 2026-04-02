import { Image } from 'expo-image';
import { Text, XStack, YStack } from 'tamagui';

type AvatarGroupProps = {
    avatars: string[];
    extraCount: string;
};

export function AvatarGroup({ avatars, extraCount }: AvatarGroupProps) {
    return (
        <XStack alignItems="center">
            {avatars.map((avatar, index) => (
                <Image
                    key={`${avatar}-${index}`}
                    source={{ uri: avatar }}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: '#FFFFFF',
                        marginLeft: index === 0 ? 0 : -10,
                        zIndex: avatars.length - index,
                    }}
                />
            ))}

            <YStack
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor="#E0E7FF"
                borderWidth={2}
                borderColor="#FFFFFF"
                alignItems="center"
                justifyContent="center"
                marginLeft={-10}
            >
                <Text fontSize={10} color="#4338CA" fontWeight="700">
                    {extraCount}
                </Text>
            </YStack>
        </XStack>
    );
}