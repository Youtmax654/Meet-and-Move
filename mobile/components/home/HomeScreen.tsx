import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import { UpcomingActivitiesSection } from '@/components/home/activities/UpcomingActivitiesSection';
import { nearbyGuides, upcomingActivities, weeklyTopRated } from '@/components/home/data/homeData';
import { NearbyGuidesSection } from '@/components/home/guides/NearbyGuidesSection';
import { HomeSearchBar } from '@/components/home/layout/HomeSearchBar';
import { HomeTopRow } from '@/components/home/layout/HomeTopRow';
import { TopRatedSection } from '@/components/home/topRated/TopRatedSection';

export function HomeScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F5' }} edges={['top']}>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#F7F6F5' }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 164 }}
                showsVerticalScrollIndicator={false}
            >
                <YStack>
                    <HomeTopRow />

                    <Text
                        fontSize={39}
                        lineHeight={40}
                        letterSpacing={-0.8}
                        color="#1E2228"
                        fontWeight="800"
                        marginBottom="$4"
                        maxWidth={340}
                    >
                        Trouvez votre prochain voyage
                    </Text>

                    <HomeSearchBar />

                    <UpcomingActivitiesSection activities={upcomingActivities} />

                    <TopRatedSection items={weeklyTopRated} />

                    <NearbyGuidesSection guides={nearbyGuides} />
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}
