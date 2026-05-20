import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

export function LaunchCtaSection() {
  return (
    <Box id="launch-cta" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <Box
          borderRadius="28px"
          p={{ base: 6, md: 12 }}
          bg="linear-gradient(135deg, #FFFFFF 0%, #F3F2F0 100%)"
          boxShadow="0 24px 50px rgba(0, 0, 0, 0.12)"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            bg="radial-gradient(circle at 85% 15%, rgba(0, 102, 102, 0.12), transparent 45%)"
          />
          <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ base: "flex-start", lg: "center" }}
            gap={{ base: 8, lg: 14 }}
            position="relative"
          >
            <Stack gap={5} flex="1">
              <Text
                fontSize="xs"
                letterSpacing="0.32em"
                fontWeight="700"
                color="#006666"
              >
                BETA MOBILE
              </Text>
              <Heading size="lg">
                Soyez les premiers à tester Meet&Move.
              </Heading>
              <Text color="#5B5C5B" maxW="520px">
                L'app mobile est en cours de développement. Inscrivez-vous pour
                recevoir l'invitation privée et découvrir les sorties, chats et
                parcours en avant-première.
              </Text>
              <Stack
                direction={{ base: "column", sm: "row" }}
                gap={3}
                align={{ base: "stretch", sm: "center" }}
              >
                <Input
                  type="email"
                  placeholder="Votre email"
                  bg="#FFFFFF"
                  border="1px solid rgba(0, 0, 0, 0.08)"
                  borderRadius="full"
                  px={5}
                  h="52px"
                  _placeholder={{ color: "#7A7A7A" }}
                />
                <Button
                  bg="#006666"
                  color="#FFFFFF"
                  borderRadius="full"
                  px={7}
                  h="52px"
                  w={{ base: "100%", sm: "fit-content" }}
                  _hover={{ opacity: 0.9 }}
                >
                  Me prévenir du lancement
                </Button>
              </Stack>
              <Text fontSize="sm" color="#7A7A7A">
                Pas de spam. On vous écrit uniquement pour l'ouverture des
                accès.
              </Text>
            </Stack>
            <Box
              flex="1"
              minH={{ base: "180px", md: "240px" }}
              borderRadius="22px"
              bg="#0C2F2F"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                inset={0}
                bg="radial-gradient(circle at 30% 20%, rgba(0, 102, 102, 0.55), transparent 55%)"
              />
              <Stack
                position="relative"
                p={{ base: 6, md: 8 }}
                gap={3}
                color="#FFFFFF"
              >
                <Text fontSize="xs" letterSpacing="0.3em" fontWeight="700">
                  EN COURS DE DÉVELOPPEMENT
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                  Notifications, chat et réservations en direct sur mobile.
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Accès privé proposé en premier aux inscrits.
                </Text>
              </Stack>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
