import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you might have a utils file, but I'll implement inline if needed or stick to standard classes

export function StatCard({
  title,
  value,
  trend,
  trendLabel,
  variant = "default"
}: {
  title: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  variant?: "default" | "primary";
}) {
  const isPrimary = variant === "primary";
  
  return (
    <div className={`p-6 rounded-3xl transition-all ${
      isPrimary 
        ? "bg-[#105D3B] text-white shadow-lg shadow-primary/20" 
        : "bg-white text-foreground border border-gray-100"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-sm font-medium ${isPrimary ? "text-white/80" : "text-muted-foreground"}`}>
          {title}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isPrimary ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        }`}>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            isPrimary ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
        }`}>
          {trend}
        </span>
        <span className={`text-xs ${isPrimary ? "text-white/60" : "text-muted-foreground"}`}>
          {trendLabel}
        </span>
      </div>
    </div>
  );
}
