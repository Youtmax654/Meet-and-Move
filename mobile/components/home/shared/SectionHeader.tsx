import { Text, XStack } from 'tamagui';

type SectionHeaderProps = {
    title: string;
    actionLabel?: string;
};

export function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
    return (
        <XStack alignItems="center" justifyContent="space-between" marginBottom={10} width="100%">
            <Text
                fontSize={24}
                lineHeight={32}
                letterSpacing={-0.6}
                color="#2E2F2E"
                fontWeight="700"
            >
                {title}
            </Text>
            {actionLabel ? (
                <Text color="#006666" fontSize={14} fontWeight="600">
                    {actionLabel}
                </Text>
            ) : null}
        </XStack>
    );
}
