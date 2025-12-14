import { Pause, Square } from "lucide-react";

export function TimeTracker() {
  return (
    <div className="bg-[#05110d] p-6 rounded-3xl h-full relative overflow-hidden flex flex-col items-center justify-center text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-20">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 50 Q 25 30 50 50 T 100 50 V 100 H 0 Z" fill="#105D3B" />
             <path d="M0 60 Q 30 40 60 60 T 120 60 V 100 H 0 Z" fill="#147c4e" />
         </svg>
      </div>

      <div className="relative z-10 text-center w-full">
        <h3 className="text-sm text-gray-400 mb-6 text-left absolute top-[-10px] left-0">Time Tracker</h3>
        
        <div className="text-4xl font-mono font-bold tracking-widest mb-8 mt-4">
          01:24:08
        </div>
        
        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
            <Pause className="w-5 h-5 fill-current" />
          </button>
          <button className="w-12 h-12 bg-[#FF4444] rounded-full flex items-center justify-center text-white hover:bg-[#ff2222] transition-colors">
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
