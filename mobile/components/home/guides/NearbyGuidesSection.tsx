import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/home/shared/SectionHeader';
import { Guide } from '@/components/home/types';

type NearbyGuidesSectionProps = {
    guides: Guide[];
};

export function NearbyGuidesSection({ guides }: NearbyGuidesSectionProps) {
    return (
        <>
            <SectionHeader title="Guides vérifiés près de chez vous" />

            <View style={styles.guidesList}>
                {guides.map((guide) => (
                    <View key={guide.id} style={styles.guideCard}>
                        <View style={styles.guideInfo}>
                            <Image source={{ uri: guide.image }} style={styles.guideAvatar} contentFit="cover" />
                            <View style={styles.guideTextBlock}>
                                <Text style={styles.guideName}>{guide.name}</Text>
                                <Text style={styles.guideDetail}>{guide.details}</Text>
                            </View>
                        </View>

                        <View style={styles.connectButton}>
                            <Text style={styles.connectButtonText}>Se connecter</Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    guidesList: {
        gap: 10,
    },
    guideCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    guideInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 1,
    },
    guideAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
    },
    guideTextBlock: {
        flexShrink: 1,
    },
    guideName: {
        fontSize: 17,
        color: '#20242B',
        fontWeight: '700',
        marginBottom: 2,
    },
    guideDetail: {
        fontSize: 12,
        color: '#6B727B',
        flexShrink: 1,
    },
    connectButton: {
        minWidth: 98,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#008A87',
        borderRadius: 999,
        paddingVertical: 9,
        paddingHorizontal: 14,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
});
