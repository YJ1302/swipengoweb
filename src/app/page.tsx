import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { InstagramPreview } from "@/components/home/InstagramPreview";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <InstagramPreview />
    </>
  );
}
