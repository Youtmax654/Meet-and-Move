import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiCompass, FiStar, FiUsers } from "react-icons/fi";

const features = [
  {
    title: "Cartes expérientielles",
    description:
      "Des activités sélectionnées par la communauté pour sortir du quotidien.",
    accent: "#006666",
    icon: FiCompass,
  },
  {
    title: "Match avec votre squad",
    description:
      "Formez votre équipe, discutez et organisez vos sorties en un clin d'oeil.",
    accent: "#4953AC",
    icon: FiUsers,
  },
  {
    title: "Moments mémorables",
    description:
      "Gardez vos souvenirs en un seul endroit et partagez-les facilement.",
    accent: "#9C3D2A",
    icon: FiStar,
  },
];

export function FeaturesSection() {
  return (
    <Box bg="#F1F1F0" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">
        <Stack gap={4} maxW="520px">
          <Heading size="lg">Les fonctionnalités essentielles</Heading>
          <Text color="#5B5C5B">
            Tout ce qu'il faut pour vivre vos sorties à fond, en équipe.
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mt={10}>
          {features.map((feature) => (
            <Box
              key={feature.title}
              bg="#FFFFFF"
              borderRadius="20px"
              p={6}
              boxShadow="0 14px 30px rgba(0, 0, 0, 0.05)"
            >
              <Box
                w="44px"
                h="44px"
                borderRadius="14px"
                bg="rgba(0, 102, 102, 0.12)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Box
                  w="20px"
                  h="20px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={feature.accent}
                >
                  <Box as={feature.icon} aria-hidden fontSize="18px" />
                </Box>
              </Box>
              <Text fontSize="lg" fontWeight="700" mb={2}>
                {feature.title}
              </Text>
              <Text fontSize="sm" color="#5B5C5B">
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
