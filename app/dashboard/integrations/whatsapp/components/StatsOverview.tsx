"use client";

import { Activity, Bot, CheckCircle2, Clock, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getWhatsAppStats, type WhatsAppStats } from "@/app/actions/whatsapp-stats";
import { cn } from "@/lib/utils";

export default function StatsOverview() {
    const [stats, setStats] = useState<WhatsAppStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await getWhatsAppStats();
                if (res.success && res.data) {
                    setStats(res.data);
                }
            } catch (e) {
                console.error("Failed to load stats", e);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const items = [
        {
            label: "إجمالي الرسائل",
            value: stats?.totalMessages.toLocaleString() || "0",
            icon: MessageSquareText,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            label: "ردود الذكاء الاصطناعي",
            value: stats?.aiResponses.toLocaleString() || "0",
            icon: Bot,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100"
        },
        {
            label: "معدل التسليم",
            value: `${stats?.successRate || 100}%`,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-100"
        },
        {
            label: "آخر نشاط",
            value: stats?.lastActivity ? new Date(stats.lastActivity).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : "-",
            subValue: stats?.lastActivity ? new Date(stats.lastActivity).toLocaleDateString('ar-EG') : "لا يوجد نشاط",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "bg-white p-5 rounded-2xl border transition-all hover:shadow-md",
                        item.borderColor
                    )}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bgColor)}>
                            <item.icon className={cn("w-5 h-5", item.color)} />
                        </div>
                        {idx === 2 && ( // Add a small indicator for delivery rate
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{item.value}</h3>
                        {item.subValue && (
                            <p className="text-[10px] text-gray-400 font-medium mt-1">{item.subValue}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
