import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

import { UpcomingActivitiesSection } from '@/components/home/activities/UpcomingActivitiesSection';
import { NearbyGuidesSection } from '@/components/home/guides/NearbyGuidesSection';
import { HomeSearchBar } from '@/components/home/layout/HomeSearchBar';
import { HomeTopRow } from '@/components/home/layout/HomeTopRow';
import { TopRatedSection } from '@/components/home/topRated/TopRatedSection';
import { useHomeData } from '@/hooks/useHomeData';

export function HomeScreen() {
    const { activities, topRated, guides, loading } = useHomeData();

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
                        Trouvez votre prochaine activité
                    </Text>

                    <HomeSearchBar />

                    {loading ? (
                        <YStack alignItems="center" justifyContent="center" paddingVertical={40}>
                            <ActivityIndicator size="large" color="#008A87" />
                            <Text fontSize={14} color="#6B727B" marginTop={12}>
                                Chargement des données...
                            </Text>
                        </YStack>
                    ) : activities.length === 0 ? (
                        <YStack alignItems="center" justifyContent="center" paddingVertical={60} gap={12}>
                            <Text fontSize={18} color="#1E2228" fontWeight="600">Aucune activité disponible</Text>
                            <Text fontSize={14} color="#5B5C5B" textAlign="center">Revenez plus tard pour découvrir de nouvelles expériences !</Text>
                        </YStack>
                    ) : (
                        <>
                            <UpcomingActivitiesSection activities={activities} />
                            <TopRatedSection items={topRated} />
                            <NearbyGuidesSection guides={guides} />
                        </>
                    )}
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}
