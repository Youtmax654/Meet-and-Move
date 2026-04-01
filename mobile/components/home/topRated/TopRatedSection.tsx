import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/home/shared/SectionHeader';
import { TopRatedActivity } from '@/components/home/types';

type TopRatedSectionProps = {
    items: TopRatedActivity[];
};

export function TopRatedSection({ items }: TopRatedSectionProps) {
    return (
        <>
            <SectionHeader title="Mieux notés cette semaine" />

            <View style={styles.topRatedGrid}>
                {items.map((item) => {
                    if (item.isFeatured) {
                        return (
                            <View key={item.id} style={styles.featuredCard}>
                                <Image source={{ uri: item.image }} style={styles.featuredImage} contentFit="cover" />
                                <View style={styles.featuredOverlay}>
                                    <Text style={styles.trendingTag}>TENDANCE ACTUELLE</Text>
                                    <Text style={styles.featuredTitle}>{item.title}</Text>
                                </View>
                            </View>
                        );
                    }

                    return (
                        <View key={item.id} style={styles.smallCard}>
                            <Image source={{ uri: item.image }} style={styles.smallImage} contentFit="cover" />
                            <View style={styles.smallOverlay}>
                                <Text style={styles.smallTitle}>{item.title}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    topRatedGrid: {
        marginBottom: 22,
    },
    featuredCard: {
        height: 172,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#DDD',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.22)',
    },
    trendingTag: {
        fontSize: 9,
        letterSpacing: 0.8,
        color: '#6EE7E0',
        fontWeight: '800',
        marginBottom: 2,
    },
    featuredTitle: {
        fontSize: 28,
        lineHeight: 30,
        color: '#FFFFFF',
        fontWeight: '800',
        maxWidth: 290,
    },
    smallCard: {
        height: 104,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#DDD',
    },
    smallImage: {
        width: '100%',
        height: '100%',
    },
    smallOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.18)',
    },
    smallTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 20,
        maxWidth: 200,
    },
});
