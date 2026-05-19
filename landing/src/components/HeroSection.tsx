import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GoVerified } from "react-icons/go";
import boardGameImg from "../assets/landing/board_game.png";
import badmintonImg from "../assets/landing/badminton.png";

export function HeroSection() {
  return (
    <Container maxW="6xl" py={{ base: 12, md: 20 }}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 10, lg: 16 }}
        align={{ base: "flex-start", lg: "center" }}
      >
        <Stack gap={6} flex="1" maxW="620px">
          <Text
            fontSize="xs"
            letterSpacing="0.3em"
            fontWeight="700"
            color="#9C3D2A"
          >
            LA BOUSSOLE CURATÉE
          </Text>
          <Heading
            fontSize={{ base: "40px", md: "56px", lg: "64px" }}
            lineHeight={{ base: "44px", md: "62px", lg: "70px" }}
            letterSpacing="-1.6px"
          >
            Votre prochaine{" "}
            <Box as="span" color="#006666">
              aventure
            </Box>{" "}
            est au coin de la rue.
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="#5B5C5B">
            Découvrez des expériences uniques, rencontrez des esprits libres et
            redéfinissez votre temps libre. Du cinéma d'auteur au padel
            nocturne.
          </Text>
          <HStack gap={4} flexWrap="wrap">
            <Button
              bg="#006666"
              color="#FFFFFF"
              borderRadius="full"
              px={7}
              _hover={{ opacity: 0.9 }}
            >
              Explorer les activités
            </Button>
            <Button
              bg="#E8E8E7"
              borderRadius="full"
              px={7}
              _hover={{ opacity: 0.9 }}
            >
              Héberger une activité
            </Button>
          </HStack>
        </Stack>

        <Box flex="1" position="relative" minH={{ base: "360px", md: "520px" }}>
          <Box
            position="absolute"
            top={0}
            right={0}
            w={{ base: "100%", lg: "78%" }}
            h={{ base: "58%", lg: "70%" }}
            borderRadius="24px"
            overflow="hidden"
            boxShadow="0 18px 40px rgba(0, 0, 0, 0.12)"
          >
            <Image
              src={boardGameImg}
              alt="Groupe de personnes autour d'un jeu"
              fit="cover"
              w="100%"
              h="100%"
            />
          </Box>
          <Box
            position="absolute"
            bottom={0}
            left={0}
            w={{ base: "86%", lg: "58%" }}
            h={{ base: "50%", lg: "48%" }}
            borderRadius="24px"
            overflow="hidden"
            border="4px solid #FFFFFF"
            boxShadow="0 18px 40px rgba(0, 0, 0, 0.12)"
          >
            <Image
              src={badmintonImg}
              alt="Equipe jouant au badminton"
              fit="cover"
              w="100%"
              h="100%"
            />
          </Box>
          <Flex
            position="absolute"
            top="45%"
            left={{ base: "-6px", lg: "-20px" }}
            bg="rgba(247, 246, 245, 0.9)"
            borderRadius="16px"
            px={4}
            py={3}
            align="center"
            gap={3}
            boxShadow="0 10px 20px rgba(0, 0, 0, 0.1)"
            display={{ base: "none", md: "flex" }}
          >
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg="#4953AC"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box as={GoVerified} color="#FFFFFF" fontSize="20px" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="700">
                500+ hôtes
              </Text>
              <Text fontSize="xs" color="#5B5C5B">
                Vérifiés par la communauté
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
