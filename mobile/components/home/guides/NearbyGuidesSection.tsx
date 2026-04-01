import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, XStack, YStack } from 'tamagui';

import { SectionHeader } from '@/components/home/shared/SectionHeader';
import { Guide } from '@/components/home/types';

type NearbyGuidesSectionProps = {
    guides: Guide[];
};

export function NearbyGuidesSection({ guides }: NearbyGuidesSectionProps) {
    return (
        <YStack>
            <SectionHeader title="Guides vérifiés près de chez vous" />

            <YStack gap={10}>
                {guides.map((guide) => (
                    <XStack
                        key={guide.id}
                        alignItems="center"
                        justifyContent="space-between"
                        backgroundColor="#FFFFFF"
                        borderRadius={16}
                        paddingVertical={12}
                        paddingHorizontal={10}
                    >
                        <XStack alignItems="center" gap={10} flexShrink={1}>
                            <Image
                                source={{ uri: guide.image }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                }}
                                contentFit="cover"
                            />
                            <YStack flexShrink={1}>
                                <XStack alignItems="center" gap={6} marginBottom={2}>
                                    <Text fontSize={17} color="#20242B" fontWeight="700">
                                        {guide.name}
                                    </Text>
                                    {guide.isVerified && (
                                        <Ionicons name="checkmark-circle" size={16} color="#006666" />
                                    )}
                                </XStack>
                                <Text fontSize={12} color="#6B727B" flexShrink={1}>
                                    {guide.details}
                                </Text>
                            </YStack>
                        </XStack>

                        <XStack
                            minWidth={98}
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="#008A87"
                            borderRadius={999}
                            paddingVertical={9}
                            paddingHorizontal={14}
                        >
                            <Text color="#FFFFFF" fontSize={13} fontWeight="700">
                                Se connecter
                            </Text>
                        </XStack>
                    </XStack>
                ))}
            </YStack>
        </YStack>
    );
}
