"use client";

import { useRef, useEffect } from "react";

export function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-white pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,93,59,0.05),rgba(255,255,255,0))]" />

            {/* Animated Blobs */}
            <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-emerald-50/60 blur-3xl opacity-60 animate-blob mix-blend-multiply" />
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-50/60 blur-3xl opacity-60 animate-blob animation-delay-2000 mix-blend-multiply" />
            <div className="absolute bottom-[20%] right-[30%] w-[600px] h-[600px] rounded-full bg-indigo-50/40 blur-3xl opacity-40 animate-blob animation-delay-4000 mix-blend-multiply" />

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23105D3B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
