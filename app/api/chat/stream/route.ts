import { NextRequest, NextResponse } from "next/server";
import { botService } from "@/app/dashboard/bot/services/bot-service";

// Switched to default (Node.js) runtime because 'botService' uses Drizzle/Postgres 
// which relies on 'net' module, not supported in Edge.
// export const runtime = "edge";

/**
 * Public Streaming API for the Chat Widget
 * Handles real-time bot responses with CORS support
 */
export async function POST(req: NextRequest) {
    // 1. Handle CORS Preflight
    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }

    try {
        const { botId, message, history, referer } = await req.json();

        if (!botId || !message) {
            return NextResponse.json({ error: "المدخلات غير كاملة" }, { status: 400 });
        }

        // 2. Security: Validate Domain
        // Fetch settings first to check allowed domains
        const settings = await botService.getSettingsById(botId);
        
        if (!settings) {
             return NextResponse.json({ error: "البوت غير موجود" }, { status: 404 });
        }

        let allowOrigin = "*";
        
        // Parse metadata for allowed domains
        try {
            const metadata = settings.metadata ? JSON.parse(settings.metadata) : {};
            const allowedDomainsStr = metadata?.wui?.allowedDomains || "";
            
            if (allowedDomainsStr && allowedDomainsStr.trim().length > 0) {
                // Prioritize the 'referer' passed from the client (embedding page), 
                // fallback to headers (direct API call)
                const originToCheck = referer || req.headers.get("origin") || req.headers.get("referer");
                
                // If strict mode is on (allowedDomains exist), we MUST have an origin/referer
                if (!originToCheck) {
                    return NextResponse.json({ error: "مصدر الطلب غير معروف (Missing Origin/Referer)" }, { status: 403 });
                }

                const allowedDomains = allowedDomainsStr.split(",").map((d: string) => d.trim().toLowerCase()).filter(Boolean);
                
                // Check if origin matches any allowed domain
                const isAllowed = allowedDomains.some((domain: string) => {
                    // Remove protocol and trailing slash for flexible matching
                    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
                    return originToCheck.toLowerCase().includes(cleanDomain);
                });

                if (!isAllowed) {
                     return NextResponse.json({ error: "غير مصرح لهذا النطاق باستخدام البوت" }, { status: 403 });
                }
                
                // If allowed, reflect the specific origin for CORS (Standard practice). 
                // Note: The actual CORS header needs to be the Request Origin (host of the widget), not the Embedding Parent.
                allowOrigin = req.headers.get("origin") || "*";
            }
        } catch (e) {
            console.error("Domain validation error:", e);
            // Fail-closed on error for security
            return NextResponse.json({ error: "خطأ في التحقق من النطاق" }, { status: 500 });
        }

        // 3. Initialize Streaming Response
        const responseStream = new TransformStream();
        const writer = responseStream.writable.getWriter();
        const encoder = new TextEncoder();

        // 4. Start Streaming Logic in Background
        (async () => {
            try {
                // Pass the pre-fetched settings to optimize? 
                // Currently streaming method fetches again, which is acceptable for now
                const stream = botService.streamResponse(botId, message, history);
                
                for await (const chunk of stream) {
                    await writer.write(encoder.encode(chunk));
                }
            } catch (error: any) {
                console.error("Streaming error:", error);
                await writer.write(encoder.encode(`\n[ERROR]: ${error.message}`));
            } finally {
                await writer.close();
            }
        })();

        // 5. Return the Stream with appropriate headers
        return new NextResponse(responseStream.readable, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": allowOrigin, 
                "Vary": "Origin"
            },
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "فشل في معالجة الطلب" }, { 
            status: 500,
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    }
}

/**
 * Handle OPTIONS for CORS preflight
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
