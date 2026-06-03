import { Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";

export function SiteFooter() {
  return (
    <Container maxW="6xl" py={{ base: 12, md: 16 }}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={6}
      >
        <Stack gap={2} maxW="400px">
          <Heading size="md" color="#006666">
            Meet&Move
          </Heading>
          <Text fontSize="sm" color="#5B5C5B">
            © 2026 Meet&Move. Rencontrez, organisez, vivez.
          </Text>
        </Stack>
      </Flex>
    </Container>
  );
}
