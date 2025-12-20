import { NextRequest, NextResponse } from "next/server";
import { exchangeSallaCode, saveSallaCredentials } from "@/app/actions/salla-oauth";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
      console.error("[Salla OAuth] Error:", error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=missing_code`
      );
    }

    // Get credentials from env vars (preferred) or URL params (fallback)
    const clientId = process.env.SALLA_CLIENT_ID || searchParams.get("client_id");
    const clientSecret = process.env.SALLA_CLIENT_SECRET || searchParams.get("client_secret");

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=missing_credentials`
      );
    }

    // Exchange code for access token
    const tokenResult = await exchangeSallaCode(code, clientId, clientSecret);

    if (!tokenResult.success || !tokenResult.data) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=${encodeURIComponent(tokenResult.error || "token_exchange_failed")}`
      );
    }

    const { accessToken, refreshToken, expiresIn, storeInfo } = tokenResult.data;

    // Calculate expiry date
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Save credentials to database
    const saveResult = await saveSallaCredentials({
      accessToken,
      refreshToken,
      expiresAt,
      storeInfo,
    });

    if (!saveResult.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=${encodeURIComponent(saveResult.error || "save_failed")}`
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?success=true&store=${encodeURIComponent(storeInfo?.name || "متجر سلة")}`
    );
  } catch (error) {
    console.error("[Salla OAuth Callback] Error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/salla?error=server_error`
    );
  }
}
