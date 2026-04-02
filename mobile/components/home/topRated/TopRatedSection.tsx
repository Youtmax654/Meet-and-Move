import { Image } from 'expo-image';
import { ScrollView } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { SectionHeader } from '@/components/home/shared/SectionHeader';
import { TopRatedActivity } from '@/components/home/types';

type TopRatedSectionProps = {
    items: TopRatedActivity[];
};

export function TopRatedSection({ items }: TopRatedSectionProps) {
    return (
        <YStack marginBottom={24}>
            <SectionHeader title="Mieux notés cette semaine" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12, gap: 16 }}>
                <XStack gap={16}>
                    {items.map((item) => (
                        <YStack
                            key={item.id}
                            width={260}
                            height={200}
                            borderRadius={24}
                            overflow="hidden"
                            backgroundColor="#DDD"
                            position="relative"
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'cover',
                                }}
                            />

                            <YStack
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                justifyContent="flex-end"
                                padding={20}
                                backgroundColor="rgba(0,0,0,0.3)"
                            >
                                {item.isFeatured ? (
                                    <Text fontSize={10} letterSpacing={1} color="#8DEDEC" fontWeight="700" textTransform="uppercase" marginBottom={4}>
                                        TENDANCE ACTUELLE
                                    </Text>
                                ) : null}
                                <Text fontSize={22} lineHeight={28} color="#FFFFFF" fontWeight="800" numberOfLines={2}>
                                    {item.title}
                                </Text>
                            </YStack>
                        </YStack>
                    ))}
                </XStack>
            </ScrollView>
        </YStack>
    );
}
