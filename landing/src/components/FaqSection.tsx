import {
  Accordion,
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

const faqs = [
  {
    question: "Quand sort l'application mobile ?",
    answer:
      "La version beta ouvre progressivement. Inscrivez-vous et vous recevrez votre invitation en avant-première.",
  },
  {
    question: "Puis-je proposer une activité sans équipe ?",
    answer:
      "Oui. Vous pouvez lancer une sortie publique, laisser la communauté rejoindre, ou inviter votre propre groupe.",
  },
  {
    question: "Comment sont sélectionnés les hôtes ?",
    answer:
      "Les hôtes complètent un profil détaillé et sont vérifiés par la communauté grâce aux retours et évaluations.",
  },
  {
    question: "Meet&Move est-il gratuit ?",
    answer:
      "L'accès de base est gratuit. Certaines expériences premium peuvent proposer un coût supplémentaire.",
  },
];

export function FaqSection() {
  return (
    <Box py={{ base: 12, md: 20 }} bg="#F1F1F0">
      <Container maxW="6xl">
        <Stack gap={4} maxW="560px">
          <Heading size="lg">FAQ</Heading>
          <Text color="#5B5C5B">
            Tout ce qu'il faut savoir avant de lancer votre prochaine sortie.
          </Text>
        </Stack>
        <Accordion.Root
          mt={{ base: 8, md: 12 }}
          defaultValue={[faqs[0].question]}
          collapsible
        >
          <Stack gap={4}>
            {faqs.map((faq) => (
              <Accordion.Item
                key={faq.question}
                value={faq.question}
                bg="#FFFFFF"
                borderRadius="20px"
                p={{ base: 5, md: 6 }}
                boxShadow="0 14px 30px rgba(0, 0, 0, 0.05)"
                border="1px solid rgba(0, 0, 0, 0.04)"
              >
                <Accordion.ItemTrigger>
                  <Flex align="center" justify="space-between" flex={1} gap={4}>
                    <Text fontWeight="600" fontSize="lg">
                      {faq.question}
                    </Text>
                    <Accordion.ItemIndicator
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg="rgba(0, 102, 102, 0.12)"
                      color="#006666"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="20px"
                      fontWeight="700"
                      transition="transform 0.2s ease"
                    >
                      +
                    </Accordion.ItemIndicator>
                  </Flex>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <Text mt={3} color="#5B5C5B">
                      {faq.answer}
                    </Text>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Stack>
        </Accordion.Root>
      </Container>
    </Box>
  );
}
