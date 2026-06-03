import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import newActivityImg from "../assets/landing/new_activity.jpg";
import profileImg from "../assets/landing/profile.jpg";
import chatsImg from "../assets/landing/chats.jpg";

const showcases = [
  {
    eyebrow: "PLANIFICATION",
    title: "Organisez une sortie en 2 minutes",
    description:
      "Créez un rendez-vous, proposez un lieu et invitez votre squad. Les participants voient le programme et valident en un tap.",
    bullets: [
      "Choix rapide du lieu et du créneau",
      "Invitations privées ou ouvertes",
      "Rappels automatiques pour le groupe",
    ],
    accent: "#006666",
    panel: "#0F2D2D",
    screenshot: newActivityImg,
    reverse: false,
  },
  {
    eyebrow: "COMMUNAUTE",
    title: "Des profils qui donnent envie d'y aller",
    description:
      "Visualisez l'ambiance, les centres d'intérêt et l'énergie du groupe avant de confirmer votre participation.",
    bullets: [
      "Badges d'expérience et rôles du groupe",
      "Suggestions basées sur vos goûts",
      "Filtrez par affinité et disponibilité",
    ],
    accent: "#4953AC",
    panel: "#141B3A",
    screenshot: profileImg,
    reverse: true,
  },
  {
    eyebrow: "SUIVI LIVE",
    title: "Tout suivre depuis votre mobile",
    description:
      "Messages, détails logistiques et souvenirs sont regroupés dans une seule vue pour garder le momentum.",
    bullets: [
      "Chat instantané pour coordonner",
      "Carnet de souvenirs partagé",
      "Notifications intelligentes",
    ],
    accent: "#9C3D2A",
    panel: "#2C1511",
    screenshot: chatsImg,
    reverse: false,
  },
];

type PhoneFrameProps = {
  accent: string;
  panel: string;
  screenshot?: string;
};

function PhoneFrame({ accent, panel, screenshot }: PhoneFrameProps) {
  return (
    <Box
      position="relative"
      bg="#0C0F10"
      borderRadius="40px"
      p="12px"
      w={{ base: "100%", sm: "360px" }}
      maxW="420px"
      boxShadow="0 24px 50px rgba(0, 0, 0, 0.25)"
    >
      <Box
        position="absolute"
        top="10px"
        left="50%"
        transform="translateX(-50%)"
        w="96px"
        h="6px"
        borderRadius="full"
        bg="#1E1F20"
      />
      <Box
        borderRadius="32px"
        bg={panel}
        overflow="hidden"
        minH={{ base: "360px", md: "480px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {screenshot ? (
          <Image
            src={screenshot}
            alt="Aperçu de l'application"
            w="100%"
            h="100%"
            objectFit="cover"
          />
        ) : (
          <Stack gap={3} align="center" textAlign="center" px={6} py={10}>
            <Box
              w="64px"
              h="64px"
              borderRadius="20px"
              bg="rgba(255, 255, 255, 0.12)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box w="28px" h="28px" borderRadius="12px" bg={accent} />
            </Box>
            <Text fontWeight="700" color="#FFFFFF">
              Ajoutez votre capture d'écran
            </Text>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
              Glissez une image ici pour illustrer la fonctionnalité.
            </Text>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export function FeatureShowcaseSection() {
  return (
    <Box
      py={{ base: 12, md: 20 }}
      bg="linear-gradient(180deg, #F7F6F5 0%, #EFEAE4 100%)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at 20% 20%, rgba(0, 102, 102, 0.08), transparent 55%)"
      />
      <Container maxW="6xl" position="relative">
        <Stack gap={4} maxW="560px">
          <Heading size="lg">Des parcours pensés pour le mobile</Heading>
          <Text color="#5B5C5B">
            Chaque fonctionnalité est conçue pour vous faire passer de l'idée à
            la sortie sans friction.
          </Text>
        </Stack>
        <Stack gap={{ base: 12, md: 16 }} mt={{ base: 10, md: 14 }}>
          {showcases.map((showcase) => (
            <Flex
              key={showcase.title}
              direction={{
                base: "column",
                lg: showcase.reverse ? "row-reverse" : "row",
              }}
              gap={{ base: 8, lg: 16 }}
              align="center"
            >
              <Stack flex="1" gap={4} maxW="520px">
                <Badge
                  alignSelf="flex-start"
                  bg="rgba(255, 255, 255, 0.8)"
                  color={showcase.accent}
                  borderRadius="full"
                  px={4}
                  py={1}
                  fontSize="xs"
                  letterSpacing="0.24em"
                >
                  {showcase.eyebrow}
                </Badge>
                <Heading size="md">{showcase.title}</Heading>
                <Text color="#5B5C5B">{showcase.description}</Text>
                <Stack gap={2} pt={2}>
                  {showcase.bullets.map((bullet) => (
                    <Flex key={bullet} gap={3} align="center">
                      <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={showcase.accent}
                      />
                      <Text fontSize="sm" color="#3B3C3C">
                        {bullet}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
              <PhoneFrame
                accent={showcase.accent}
                panel={showcase.panel}
                screenshot={showcase.screenshot}
              />
            </Flex>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
