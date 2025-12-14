import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />
      <div className="h-16"></div>
      <Hero />
      
      {/* Social Proof / Trusted companies placeholder */}
      <div className="py-12 bg-white border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400 font-medium mb-8 text-sm">تثق بنا شركات رائدة في المملكة</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholder Logos */}
               <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">T</div>
                  <span>TechCorp</span>
               </div>
               <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">S</div>
                  <span>SmartStore</span>
               </div>
               <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs">E</div>
                  <span>EliteServices</span>
               </div>
               <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs">I</div>
                  <span>InnoVate</span>
               </div>
               <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                   <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs">F</div>
                   <span>FutureTech</span>
               </div>
            </div>
         </div>
      </div>

      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
