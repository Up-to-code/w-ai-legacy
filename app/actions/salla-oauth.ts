"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const SALLA_AUTH_URL = "https://accounts.salla.sa/oauth2/auth";
const SALLA_TOKEN_URL = "https://accounts.salla.sa/oauth2/token";
const SALLA_USER_INFO_URL = "https://accounts.salla.sa/oauth2/user/info";

// Helper function to get authenticated user
async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("غير مصرح. يرجى تسجيل الدخول.");
  }

  return session.user;
}

/**
 * Generate Salla OAuth authorization URL
 */
export async function generateSallaAuthUrl(state?: string) {
  try {
    const clientId = process.env.SALLA_CLIENT_ID;
    const redirectUri = process.env.SALLA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback/salla`;
    
    if (!clientId) {
      throw new Error("SALLA_CLIENT_ID is not configured");
    }

    console.log("[SallaOAuth] Generating Auth URL with:");
    console.log("  - Client ID configured:", !!clientId);
    console.log("  - Redirect URI:", redirectUri);
    console.log("  - State:", state);

    const authUrl = new URL(SALLA_AUTH_URL);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "offline_access products.read products.read_write"); // Added products scopes
    if (state) {
      authUrl.searchParams.set("state", state);
    }

    return {
      success: true,
      data: {
        authUrl: authUrl.toString(),
        redirectUri,
      },
    };
  } catch (error: any) {
    console.error("Generate auth URL error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ في إنشاء رابط التفويض",
    };
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeSallaCode(code: string) {
  try {
    const clientId = process.env.SALLA_CLIENT_ID;
    const clientSecret = process.env.SALLA_CLIENT_SECRET;
    const redirectUri = process.env.SALLA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/callback/salla`;

    if (!clientId || !clientSecret) {
      throw new Error("Salla credentials are not configured in environment variables");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const response = await fetch(SALLA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Token exchange failed:", error);
      return {
        success: false,
        error: error.error_description || "فشل تبادل الرمز",
      };
    }

    const tokens = await response.json();

    // Get store information
    const storeInfoResponse = await fetch(SALLA_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    let storeInfo = null;
    if (storeInfoResponse.ok) {
      storeInfo = await storeInfoResponse.json();
    }

    return {
      success: true,
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
        tokenType: tokens.token_type,
        storeInfo,
      },
    };
  } catch (error: any) {
    console.error("Exchange code error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تبادل الرمز",
    };
  }
}

/**
 * Refresh Salla access token
 */
export async function refreshSallaToken(refreshToken: string) {
  try {
    const clientId = process.env.SALLA_CLIENT_ID;
    const clientSecret = process.env.SALLA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Salla credentials are not configured in environment variables");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const response = await fetch(SALLA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Token refresh failed:", error);
      return {
        success: false,
        error: error.error_description || "فشل تحديث الرمز",
      };
    }

    const tokens = await response.json();

    return {
      success: true,
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
      },
    };
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث الرمز",
    };
  }
}

/**
 * Get Salla store information
 */
export async function getSallaStoreInfo(accessToken: string) {
  try {
    const response = await fetch(SALLA_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Get store info failed:", error);
      return {
        success: false,
        error: "فشل جلب معلومات المتجر",
      };
    }

    const storeInfo = await response.json();

    return {
      success: true,
      data: storeInfo,
    };
  } catch (error: any) {
    console.error("Get store info error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب معلومات المتجر",
    };
  }
}

/**
 * Save Salla credentials to integration table
 * Note: We explicitly exclude any client secret/id from being saved to DB
 */
export async function saveSallaCredentials(credentials: {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  storeInfo?: any;
  aiAutoResponse?: any;
}) {
  try {
    const user = await getAuthUser();

    // Check if integration already exists
    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, "salla")
        )
      )
      .limit(1);

    // Filter out potentially sensitive or unwanted fields before saving
    // We only save tokens and store info
    const safeCredentials = {
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      storeInfo: credentials.storeInfo,
      aiAutoResponse: credentials.aiAutoResponse,
    };

    const credentialsString = JSON.stringify(safeCredentials);

    if (existingIntegration) {
      // Update existing
      const [updated] = await db
        .update(integration)
        .set({
          credentials: credentialsString,
          status: credentials.accessToken ? "connected" : "disconnected",
          connectedAt: credentials.accessToken ? new Date() : existingIntegration.connectedAt,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(integration.userId, user.id),
            eq(integration.serviceId, "salla")
          )
        )
        .returning();

      return {
        success: true,
        message: "تم تحديث بيانات سلة",
        data: updated,
      };
    } else {
      // Create new
      const [newIntegration] = await db
        .insert(integration)
        .values({
          userId: user.id,
          serviceId: "salla",
          serviceName: "Salla",
          status: credentials.accessToken ? "connected" : "disconnected",
          credentials: credentialsString,
          connectedAt: credentials.accessToken ? new Date() : undefined,
        })
        .returning();

      return {
        success: true,
        message: "تم حفظ بيانات سلة",
        data: newIntegration,
      };
    }
  } catch (error: any) {
    console.error("Save credentials error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء حفظ البيانات",
    };
  }
}
