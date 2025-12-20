"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, ShoppingBag, Store } from "lucide-react";

export function Stats() {
    const [counts, setCounts] = useState({
        merchants: 0,
        messages: 0,
        sales: 0,
        uptime: 0
    });

    useEffect(() => {
        // Simulate counting animation
        const duration = 2000;
        const steps = 50;
        const interval = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);

            setCounts({
                merchants: Math.floor(1200 * easedProgress),
                messages: Math.floor(5000000 * easedProgress),
                sales: Math.floor(85 * easedProgress), // Percentage
                uptime: Math.floor(99 * easedProgress) // Percentage
            });

            if (currentStep >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            icon: <Store className="w-6 h-6 text-[#105D3B]" />,
            value: `+${counts.merchants}`,
            label: "متجر نشط",
            color: "bg-green-50"
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-[#105D3B]" />,
            value: `+${(counts.messages / 1000000).toFixed(1)}M`,
            label: "رسالة مؤتمتة",
            color: "bg-green-50"
        },
        {
            icon: <ShoppingBag className="w-6 h-6 text-[#105D3B]" />,
            value: `%${counts.sales}`,
            label: "زيادة في المبيعات",
            color: "bg-green-50"
        },
        {
            icon: <Users className="w-6 h-6 text-[#105D3B]" />,
            value: `%${counts.uptime}.9`,
            label: "رضا العملاء",
            color: "bg-green-50"
        }
    ];

    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {stat.icon}
                            </div>
                            <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 font-mono tracking-tight">
                                {stat.value}
                            </h4>
                            <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
