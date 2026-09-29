import { HeroSection } from "@/components/home/hero-section";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
      </main>
    </>
  );
}