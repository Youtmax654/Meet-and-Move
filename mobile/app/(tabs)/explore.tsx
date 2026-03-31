import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<ThemedView style={styles.header} />}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Explore</ThemedText>
        <ThemedText>
          Cet onglet est un placeholder. On pourra y mettre le feed des activités (MEET-12).
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 180,
  },
  container: {
    gap: 12,
    paddingVertical: 8,
  },
});

