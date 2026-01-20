import { Hero } from "@/components/home/Hero";
import { AboutUs } from "@/components/home/AboutUs";
import { Features } from "@/components/home/Features";
import { InstagramPreview } from "@/components/home/InstagramPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQSection } from "@/components/sections/FAQSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQSection />
      <InstagramPreview />
    </>
  );
}
