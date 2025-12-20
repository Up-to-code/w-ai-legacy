import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Stats } from "@/components/landing/stats";
import { Integrations } from "@/components/landing/integrations";

import { GradientBackground } from "@/components/landing/gradient-background";

export default function Home() {
   return (
      <div className="min-h-screen bg-white relative" dir="rtl">
         <GradientBackground />
         <Navbar />
         <div className="h-16"></div>
         <Hero />

         <Stats />
         <Integrations />

         <Features />
         <Testimonials />
         <Pricing />
         <FAQ />
         <CTA />
         <Footer />
      </div>
   );
}
