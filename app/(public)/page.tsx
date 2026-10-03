import { AboutSection } from "@/components/home/about-section";
import { FinalCta } from "@/components/home/final-cta";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/service-section";
import { VisitSection } from "@/components/home/visit-section";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
         <ServicesSection />
         <AboutSection />
         <VisitSection />
         <FinalCta />
      </main>
    </>
  );
}