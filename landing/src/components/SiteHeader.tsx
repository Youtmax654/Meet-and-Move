import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";

export function SiteHeader() {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg="rgba(247, 246, 245, 0.92)"
      backdropFilter="blur(16px)"
      borderBottomWidth="1px"
      borderBottomColor="rgba(226, 226, 225, 0.7)"
    >
      <Container maxW="6xl" py={4}>
        <Flex align="center" justify="space-between" gap={6}>
          <Heading size="md" letterSpacing="-0.8px" color="#006666">
            Meet&Move
          </Heading>
          <HStack gap={3}>
            <Button
              bg="#006666"
              color="#FFFFFF"
              borderRadius="full"
              px={6}
              _hover={{ opacity: 0.9 }}
              as="a"
              href="#launch-cta"
            >
              Me prévenir
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
