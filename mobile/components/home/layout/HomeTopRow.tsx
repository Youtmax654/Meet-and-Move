import { Ionicons } from '@expo/vector-icons';
import { Text, XStack } from 'tamagui';

export function HomeTopRow() {
    return (
        <XStack alignItems="center" justifyContent="space-between" mb="$4">
            <XStack alignItems="center" gap="$2">
                <Ionicons name="location-outline" size={16} color="#0E7C95" />
                <Text fontSize={15} color="#31343A" fontWeight="600">
                    Marseille, FR
                </Text>
            </XStack>

            <XStack width={32} height={32} borderRadius={16} alignItems="center" justifyContent="center">
                <Ionicons name="notifications-outline" size={18} color="#2E3138" />
            </XStack>
        </XStack>
    );
}
