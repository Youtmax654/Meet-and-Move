import { Ionicons } from '@expo/vector-icons';
import { Text, XStack } from 'tamagui';

type HomeTopRowProps = {
    locationLabel?: string;
};

export function HomeTopRow({ locationLabel }: HomeTopRowProps) {
    return (
        <XStack alignItems="center" mb="$4">
            <Ionicons name="location-outline" size={16} color="#0E7C95" />
            <Text fontSize={15} color="#31343A" fontWeight="600" marginLeft="$2">
                {locationLabel ?? 'Localisation...'}
            </Text>
        </XStack>
    );
}
