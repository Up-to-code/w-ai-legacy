import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />
      <Hero />
      <div className="py-20 bg-gray-50 text-center">
         <h2 className="text-3xl font-bold mb-8 text-gray-800">شركات تثق في W-AI</h2>
         <div className="flex flex-wrap justify-center gap-12 text-gray-400 font-bold text-xl items-center px-4">
            <span>شركة التقنية</span>
            <span>المتجر السعودي</span>
            <span>خدمات النخبة</span>
            <span>ابتكار</span>
            <span>المستقبل</span>
         </div>
      </div>
      <Footer />
    </div>
  );
}
