import { NextRequest, NextResponse } from "next/server";
import { botService } from "@/app/dashboard/bot/services/bot-service";

export const dynamic = 'force-dynamic';

/**
 * Public Widget Configuration API
 * Returns public-safe settings for the widget (Name, WUI Config, etc.)
 */
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const botId = searchParams.get("botId");

    // CORS Headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!botId) {
        return NextResponse.json({ error: "Missing botId" }, { status: 400, headers });
    }

    try {
        const settings = await botService.getSettingsById(botId);
        if (!settings) {
            return NextResponse.json({ error: "Bot not found" }, { status: 404, headers });
        }

        // Parse WUI config
        let wuiConfig = {};
        try {
            const meta = settings.metadata ? JSON.parse(settings.metadata) : {};
            wuiConfig = meta.wui || {};
        } catch (e) {
            console.error("Error parsing metadata:", e);
        }

        // Return ONLY public info
        return NextResponse.json({
            id: settings.id,
            name: settings.name, // The custom bot name
            wui: wuiConfig,
        }, { status: 200, headers });

    } catch (error) {
        console.error("Config API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
