import { Box } from "@chakra-ui/react";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";
import { LaunchCtaSection } from "./components/LaunchCtaSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

function App() {
  return (
    <Box minH="100vh" bg="#F7F6F5" color="#2E2F2F">
      <SiteHeader />

      <Box as="main">
        <HeroSection />
        <FeaturesSection />
        <LaunchCtaSection />
        <SiteFooter />
      </Box>
    </Box>
  );
}

export default App;
