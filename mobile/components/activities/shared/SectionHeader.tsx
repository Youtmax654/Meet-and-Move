import { Pressable } from 'react-native';
import { Text, XStack } from 'tamagui';

type SectionHeaderProps = {
    title: string;
    actionLabel?: string;
    onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
    return (
        <XStack alignItems="center" justifyContent="space-between" marginBottom={16}>
            <Text fontSize={20} color="#4338CA" fontWeight="800" letterSpacing={-0.5}>
                {title}
            </Text>
            {actionLabel && (
                <Pressable onPress={onActionPress}>
                    <Text fontSize={12} color="#008A87" fontWeight="800" textTransform="uppercase" letterSpacing={0.5}>
                        {actionLabel}
                    </Text>
                </Pressable>
            )}
        </XStack>
    );
}