import { Image } from 'expo-image';
import { Text, XStack, YStack } from 'tamagui';

import { AvatarGroup } from '@/components/home/activities/AvatarGroup';
import { UpcomingActivity } from '@/components/home/types';

type UpcomingActivityCardProps = {
    activity: UpcomingActivity;
};

export function UpcomingActivityCard({ activity }: UpcomingActivityCardProps) {
    return (
        <YStack
            width={280}
            height={341.5}
            borderRadius={24}
            backgroundColor="#FFFFFF"
            shadowColor="#000"
            shadowOpacity={0.05}
            shadowRadius={2}
            shadowOffset={{ width: 0, height: 1 }}
            elevation={3}
            overflow="hidden"
        >
            <YStack position="relative" height={192}>
                <Image
                    source={{ uri: activity.image }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover',
                    }}
                />
                <XStack
                    position="absolute"
                    top={16}
                    left={16}
                    borderRadius={9999}
                    paddingHorizontal={12}
                    paddingVertical={4}
                    backgroundColor="rgba(247,246,245,0.8)"
                >
                    <Text fontSize={12} color="#2E2F2E" fontWeight="600">
                        {activity.date}
                    </Text>
                </XStack>
            </YStack>

            <YStack paddingHorizontal={20} paddingTop={19} paddingBottom={20} flex={1} justifyContent="space-between">
                <YStack gap={8}>
                    <Text fontSize={18} lineHeight={22.5} color="#2E2F2E" fontWeight="700" numberOfLines={2}>
                        {activity.title}
                    </Text>

                    <XStack alignItems="center" gap={8}>
                        <Text fontSize={14} color="#5B5C5B" fontWeight="500">
                            {activity.location}
                        </Text>
                    </XStack>
                </YStack>

                <XStack justifyContent="space-between" alignItems="center" paddingTop={8}>
                    <AvatarGroup avatars={activity.avatars} extra={activity.extra} />

                    <YStack alignItems="flex-end">
                        <Text fontSize={10} letterSpacing={0.5} textTransform="uppercase" color="#767776" fontWeight="600">
                            À PARTIR DE
                        </Text>
                        <Text fontSize={18} color="#006666" fontWeight="600">
                            {activity.price}
                        </Text>
                    </YStack>
                </XStack>
            </YStack>
        </YStack>
    );
}
