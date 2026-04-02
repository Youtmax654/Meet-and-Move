import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';

import { MemoryCard } from '@/components/activities/memories/MemoryCard';
import { SectionHeader } from '@/components/activities/shared/SectionHeader';
import { Memory } from '@/components/activities/types';

type MemoriesSectionProps = {
    memories: Memory[];
    layout?: 'horizontal' | 'vertical';
    onSeeAllPress?: () => void;
};

export function MemoriesSection({ memories, layout = 'vertical', onSeeAllPress }: MemoriesSectionProps) {
    const isHorizontal = layout === 'horizontal';

    return (
        <YStack marginBottom={40}>
            <SectionHeader
                title="Souvenirs récents"
                actionLabel={layout === 'horizontal' ? "TOUT VOIR" : undefined}
                onActionPress={onSeeAllPress}
            />

            {isHorizontal ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
                    <XStack paddingBottom={20}>
                        {memories.map(memory => (
                            <MemoryCard key={memory.id} memory={memory} layout="horizontal" />
                        ))}
                    </XStack>
                </ScrollView>
            ) : (
                <YStack gap={16} paddingBottom={20}>
                    {memories.map(memory => (
                        <MemoryCard key={memory.id} memory={memory} layout="vertical" />
                    ))}
                </YStack>
            )}
        </YStack>
    );
}