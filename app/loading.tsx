export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-green-100 animate-ping opacity-75"></div>
            
            {/* Spinning Border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#105D3B] animate-spin"></div>
            
            {/* Logo Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-2xl font-bold text-[#105D3B]">W</span>
            </div>
        </div>
        <p className="text-sm font-medium text-gray-400 animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}
