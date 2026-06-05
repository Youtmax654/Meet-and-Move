import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { XStack } from 'tamagui';

type HomeSearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
};

export function HomeSearchBar({ value, onChangeText }: HomeSearchBarProps) {
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
                value={value}
                onChangeText={onChangeText}
                placeholder="Chercher une activité, une ville..."
                placeholderTextColor="#9CA3AF"
                style={{ flex: 1, fontSize: 14, color: '#31343A' }}
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
        </XStack>
    );
}
