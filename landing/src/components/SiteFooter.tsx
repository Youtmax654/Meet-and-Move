import {
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

export function SiteFooter() {
  return (
    <Container maxW="6xl" py={{ base: 12, md: 16 }}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={6}
      >
        <Stack gap={2} maxW="300px">
          <Heading size="md" color="#006666">
            Meet&Move
          </Heading>
          <Text fontSize="sm" color="#5B5C5B">
            © 2026 Meet&Move. La boussole des tribus.
          </Text>
        </Stack>
        <HStack gap={6} flexWrap="wrap">
          {"About Careers Privacy Terms Support".split(" ").map((label) => (
            <Text key={label} fontSize="sm" color="#5B5C5B">
              {label}
            </Text>
          ))}
        </HStack>
      </Flex>
    </Container>
  );
}
