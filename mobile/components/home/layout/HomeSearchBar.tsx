import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { XStack } from 'tamagui';

export function HomeSearchBar() {
    return (
        <XStack
            height={50}
            borderRadius={12}
            backgroundColor="#FFFFFF"
            borderWidth={1}
            borderColor="#E8E8EC"
            paddingHorizontal={14}
            alignItems="center"
            gap={8}
            marginBottom={24}
        >
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
                placeholder="Chercher une expérience, une activité, un souvenir..."
                placeholderTextColor="#9CA3AF"
                style={{ flex: 1, fontSize: 14, color: '#31343A' }}
            />
        </XStack>
    );
}
