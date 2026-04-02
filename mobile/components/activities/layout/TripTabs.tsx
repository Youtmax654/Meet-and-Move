import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

type TripTabsProps = {
    activeTab: 'upcoming' | 'past';
    onTabChange: (tab: 'upcoming' | 'past') => void;
};

export function TripTabs({ activeTab, onTabChange }: TripTabsProps) {
    return (
        <XStack
            backgroundColor="#F2F2F2"
            borderRadius={999}
            padding={4}
            marginBottom={24}
        >
            <YStack flex={1}>
                <Pressable onPress={() => onTabChange('upcoming')}>
                    <YStack
                        alignItems="center"
                        justifyContent="center"
                        paddingVertical={12}
                        borderRadius={999}
                        backgroundColor={activeTab === 'upcoming' ? '#FFFFFF' : 'transparent'}
                        shadowColor={activeTab === 'upcoming' ? '#000' : 'transparent'}
                        shadowOpacity={0.06}
                        shadowRadius={10}
                        shadowOffset={{ width: 0, height: 2 }}
                    >
                        <Text
                            fontSize={14}
                            fontWeight={activeTab === 'upcoming' ? '800' : '600'}
                            color={activeTab === 'upcoming' ? '#006666' : '#6B727B'}
                        >
                            A venir
                        </Text>
                    </YStack>
                </Pressable>
            </YStack>

            <YStack flex={1}>
                <Pressable onPress={() => onTabChange('past')}>
                    <YStack
                        alignItems="center"
                        justifyContent="center"
                        paddingVertical={12}
                        borderRadius={999}
                        backgroundColor={activeTab === 'past' ? '#FFFFFF' : 'transparent'}
                        shadowColor={activeTab === 'past' ? '#000' : 'transparent'}
                        shadowOpacity={0.06}
                        shadowRadius={10}
                        shadowOffset={{ width: 0, height: 2 }}
                    >
                        <Text
                            fontSize={14}
                            fontWeight={activeTab === 'past' ? '800' : '600'}
                            color={activeTab === 'past' ? '#1F2937' : '#6B727B'}
                        >
                            Passés
                        </Text>
                    </YStack>
                </Pressable>
            </YStack>
        </XStack>
    );
}