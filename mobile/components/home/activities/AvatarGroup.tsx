import { Image } from 'expo-image';
import { Text, XStack, YStack } from 'tamagui';

type AvatarGroupProps = {
    avatars: string[];
    extra: string;
};

export function AvatarGroup({ avatars, extra }: AvatarGroupProps) {
    return (
        <XStack alignItems="center">
            {avatars.map((avatar, index) => (
                <Image
                    key={avatar}
                    source={{ uri: avatar }}
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: '#FFF',
                        marginLeft: index === 0 ? 0 : -8,
                        zIndex: avatars.length - index,
                    }}
                />
            ))}

            <YStack
                width={24}
                height={24}
                borderRadius={12}
                backgroundColor="#F1F3F5"
                borderWidth={1.5}
                borderColor="#FFF"
                alignItems="center"
                justifyContent="center"
                marginLeft={-8}
            >
                <Text fontSize={10} color="#4F5560" fontWeight="700">
                    {extra}
                </Text>
            </YStack>
        </XStack>
    );
}
