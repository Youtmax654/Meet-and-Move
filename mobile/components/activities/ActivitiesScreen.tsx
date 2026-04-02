import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import { activitiesMemories, activitiesTrips } from '@/components/activities/data/activitiesData';
import { TripTabs } from '@/components/activities/layout/TripTabs';
import { MemoriesSection } from '@/components/activities/memories/MemoriesSection';
import { TripsList } from '@/components/activities/trips/TripsList';
import { TripStatus } from '@/components/activities/types';

export function ActivitiesScreen() {
    const [activeTab, setActiveTab] = useState<TripStatus>('upcoming');

    const filteredTrips = activitiesTrips.filter(trip => trip.status === activeTab);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF9F8' }} edges={['top']}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <YStack>
                    <Text fontSize={28} color="#1E2228" fontWeight="800" marginBottom={24}>
                        Mes Voyages
                    </Text>

                    <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    <TripsList trips={filteredTrips} />

                    <MemoriesSection
                        memories={activitiesMemories}
                        layout={activeTab === 'upcoming' ? 'horizontal' : 'vertical'}
                        onSeeAllPress={() => setActiveTab('past')}
                    />
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}