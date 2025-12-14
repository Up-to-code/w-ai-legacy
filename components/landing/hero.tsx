import Link from "next/link";
import { PlayCircle, Bot, ArrowLeft, Phone, Video, MoreVertical, Plus, Mic, Camera, Smile } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-8 pb-20 px-6 md:px-12 max-w-7xl mx-auto" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Right Column: Text Content */}
        <div className="text-right space-y-8 order-1 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            الذكاء الاصطناعي وصل إلى الواتساب 🚀
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.15]">
            حوّل واتسابك إلى <br />
            <span className="text-[#105D3B]">أقوى موظف مبيعات.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl">
            دع الذكاء الاصطناعي يتولى المحادثات، يغلق الصفقات، ويجيب على العملاء 24/7 بينما تركز أنت على تنمية أعمالك.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-[#105D3B] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0d4f32] transition-all shadow-lg shadow-green-900/20 transform hover:-translate-y-1 text-center">
              جرب مجاناً الآن
            </Link>
            <button className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-6 h-6 text-gray-400" /> كيف يعمل؟
            </button>
          </div>
          
          <div className="pt-8 flex items-center gap-4 text-sm text-gray-400">
             <div className="flex -space-x-2 space-x-reverse">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                ))}
             </div>
             <p>أكثر من 1000 شركة تعتمد علينا</p>
          </div>
        </div>

        {/* Left Column: Phone Mockup */}
        <div className="relative order-2 lg:order-2 flex justify-center lg:justify-end">
             {/* Decorative Blobs */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-green-100 to-blue-50 rounded-full blur-3xl opacity-60 -z-10"></div>
             
             {/* SVG Phone Frame Container */}
             <div className="relative w-[320px] md:w-[380px] h-[650px] md:h-[700px]">
                {/* SVG Frame */}
                <svg viewBox="0 0 380 700" className="absolute inset-0 w-full h-full drop-shadow-2xl z-20 pointer-events-none">
                    <defs>
                        <mask id="screen-mask">
                            {/* White rect = visible, Black shape = hidden (cutout) */}
                            <rect width="100%" height="100%" fill="white" />
                            {/* The screen shape to cut out */}
                            <path d="M50,3 H330 A47,47 0 0,1 377,50 V650 A47,47 0 0,1 330,697 H50 A47,47 0 0,1 3,650 V50 A47,47 0 0,1 50,3 Z" fill="black" />
                        </mask>
                    </defs>
                    
                    {/* Phone Body with Mask applied */}
                    <path d="M50,0 H330 A50,50 0 0,1 380,50 V650 A50,50 0 0,1 330,700 H50 A50,50 0 0,1 0,650 V50 A50,50 0 0,1 50,0 Z" fill="#111" mask="url(#screen-mask)" />
                    
                    {/* Notch (remains solid) */}
                    <path d="M120,0 H260 A0,0 0 0,1 260,0 V25 A15,15 0 0,1 245,40 H135 A15,15 0 0,1 120,25 V0 A0,0 0 0,1 120,0 Z" fill="#111" />
                </svg>

                {/* Screen Content */}
                <div className="absolute inset-[3px] rounded-[47px] overflow-hidden bg-[#EFEAE2] z-10 flex flex-col" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay" }}>
                    
                    {/* Status Bar Spacer */}
                    <div className="h-10 bg-[#008069] w-full shrink-0"></div>

                    {/* WhatsApp Header */}
                    <div className="bg-[#008069] text-white p-3 flex items-center justify-between shadow-md shrink-0">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5 cursor-pointer" />
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                                <Bot className="w-6 h-6 text-[#008069]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-base leading-tight">Musaed AI</h4>
                                <p className="text-[11px] text-white/80">Business Account</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Video className="w-5 h-5" />
                            <Phone className="w-5 h-5" />
                            <MoreVertical className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Chat Area Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                         
                         {/* Date Pill */}
                         <div className="flex justify-center sticky top-0 z-10">
                            <span className="bg-[#FFF] text-[#54656f] text-[10px] font-medium py-[5px] px-3 rounded-lg shadow-sm border border-[#f0f0f0]">
                                اليوم
                            </span>
                         </div>

                         {/* Outgoing (User) */}
                         <div className="flex justify-end">
                            <div className="bg-[#E7FFDB] py-2 px-3 rounded-lg rounded-tl-none text-gray-900 max-w-[85%] shadow-sm relative text-sm leading-snug">
                                السلام عليكم، وش العروض الموجودة؟
                                 <div className="flex items-end justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500">10:45 AM</span>
                                    <span className="text-[#53bdeb]">
                                        <svg width="14" height="10" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.6667 0L4.33333 7.33333L1.66667 4.66667L0 6.33333L4.33333 10.6667L13.3333 1.66667L11.6667 0Z" fill="currentColor"/>
                                            <path d="M15.9997 1.66667L8.66634 9L7.33301 7.66667L14.333 0.666667L15.9997 1.66667Z" fill="currentColor"/>
                                       </svg>
                                    </span>
                                 </div>
                            </div>
                        </div>

                         {/* Incoming (Bot - Audio) */}
                         <div className="flex justify-start">
                            <div className="bg-white p-2 rounded-lg rounded-tr-none text-gray-900 max-w-[85%] shadow-sm relative">
                                <div className="flex items-center gap-3 min-w-[200px]">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f2f5] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                                        <PlayCircle className="w-6 h-6 text-[#54656f] fill-[#54656f]" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-1">
                                        <div className="h-1 bg-gray-200 rounded-full w-full relative overflow-hidden">
                                             <div className="absolute right-0 top-0 h-full w-[40%] bg-[#54656f]"></div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 text-left">0:15</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                        <Bot className="w-full h-full p-1 bg-green-100 text-green-600" />
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 block text-left mt-1 ml-1">10:45 AM</span>
                            </div>
                        </div>

                        {/* Incoming (Bot - Image) */}
                        <div className="flex justify-start">
                            <div className="bg-white p-1 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative">
                                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video mb-1">
                                     <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                        <span className="text-xs">Image Placeholder</span>
                                     </div>
                                     {/* Overlay Text mimicking a poster */}
                                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-[#105D3B]/90 text-white">
                                        <span className="font-bold text-lg">عرض اليوم الوطني</span>
                                        <span className="text-3xl font-extrabold text-yellow-400 animate-pulse">50% خصم</span>
                                        <span className="text-xs mt-1">استخدم كود: KSA94</span>
                                     </div>
                                </div>
                                <p className="px-2 pb-1 text-sm text-gray-800 leading-snug">
                                    هذا العرض خاص لعملاء التميز! 🇸🇦
                                </p>
                                <span className="text-[10px] text-gray-400 block text-left px-2 pb-1">10:46 AM</span>
                            </div>
                        </div>

                        {/* Outgoing (User) */}
                         <div className="flex justify-end">
                            <div className="bg-[#E7FFDB] py-2 px-3 rounded-lg rounded-tl-none text-gray-900 max-w-[85%] shadow-sm relative text-sm leading-snug">
                                تم، اعتمد لي الباقة.
                                 <div className="flex items-end justify-end gap-1 mt-1">
                                    <span className="text-[10px] text-gray-500">10:47 AM</span>
                                    <span className="text-[#53bdeb]">
                                        <svg width="14" height="10" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.6667 0L4.33333 7.33333L1.66667 4.66667L0 6.33333L4.33333 10.6667L13.3333 1.66667L11.6667 0Z" fill="currentColor"/>
                                            <path d="M15.9997 1.66667L8.66634 9L7.33301 7.66667L14.333 0.666667L15.9997 1.66667Z" fill="currentColor"/>
                                       </svg>
                                    </span>
                                 </div>
                            </div>
                        </div>

                         {/* Incoming (Bot - Link) */}
                         <div className="flex justify-start">
                            <div className="bg-white py-2 px-3 rounded-lg rounded-tr-none text-gray-900 max-w-[85%] shadow-sm relative text-sm leading-snug">
                                تفضل رابط الدفع المباشر: 👇
                                <span className="text-[#008069] block mt-1 underline cursor-pointer truncate">pay.w-ai.com/invoice/9283</span>
                                <span className="text-[10px] text-gray-400 block text-left mt-1">10:47 AM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 shrink-0 pb-6 mb-2">
                        <Plus className="w-6 h-6 text-gray-500 cursor-pointer" />
                        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center justify-between text-gray-400 text-sm shadow-sm">
                            <span>Message...</span>
                            <div className="flex gap-3">
                                 <Smile className="w-5 h-5 text-gray-400 cursor-pointer" />
                                 <Camera className="w-5 h-5 text-gray-400 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#006e5a] transition-colors">
                             <Mic className="w-5 h-5 text-white" />
                        </div>
                    </div>

                </div>
             </div>
        </div>
      </div>
    </section>
  );
}
