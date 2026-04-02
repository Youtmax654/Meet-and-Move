import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';

import { UpcomingActivityCard } from '@/components/home/activities/UpcomingActivityCard';
import { SectionHeader } from '@/components/home/shared/SectionHeader';
import { UpcomingActivity } from '@/components/home/types';

type UpcomingActivitiesSectionProps = {
    activities: UpcomingActivity[];
};

export function UpcomingActivitiesSection({ activities }: UpcomingActivitiesSectionProps) {
    return (
        <YStack>
            <SectionHeader title="Activités à venir" actionLabel="Voir tout" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12, gap: 12, marginBottom: 22 }}>
                <XStack gap={24}>
                    {activities.map((activity) => (
                        <UpcomingActivityCard key={activity.id} activity={activity} />
                    ))}
                </XStack>
            </ScrollView>
        </YStack>
    );
}
