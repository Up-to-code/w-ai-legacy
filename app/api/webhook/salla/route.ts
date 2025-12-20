import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { saveSallaCredentials } from "@/app/actions/salla-oauth";

const CLIENT_SECRET = process.env.SALLA_CLIENT_SECRET;

/**
 * Verify Salla webhook signature
 */
function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!CLIENT_SECRET) {
    console.warn("[Salla Webhook] CLIENT_SECRET not configured");
    return false;
  }

  const hmac = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(body)
    .digest("hex");

  return hmac === signature;
}

/**
 * Handle Salla webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-salla-signature");
    const body = await req.text();

    // Verify signature if CLIENT_SECRET is configured
    if (CLIENT_SECRET && (!signature || !verifyWebhookSignature(body, signature))) {
      console.error("[Salla Webhook] Invalid signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = JSON.parse(body);
    const { event, merchant, data, created_at } = payload;

    console.log(`[Salla Webhook] Event: ${event}, Merchant: ${merchant}, Time: ${created_at}`);

    // Handle different webhook events
    switch (event) {
      case "app.store.authorize":
        await handleStoreAuthorize(merchant, data);
        break;

      case "app.installed":
        console.log(`[Salla Webhook] App installed for merchant ${merchant}`);
        break;

      case "app.uninstalled":
        await handleAppUninstall(merchant);
        break;

      case "order.created":
        console.log(`[Salla Webhook] New order created for merchant ${merchant}`);
        // TODO: Process order data
        break;

      case "product.created":
      case "product.updated":
        console.log(`[Salla Webhook] Product ${event} for merchant ${merchant}`);
        // TODO: Sync product data
        break;

      case "customer.created":
        console.log(`[Salla Webhook] New customer for merchant ${merchant}`);
        // TODO: Sync customer data
        break;

      default:
        console.log(`[Salla Webhook] Unhandled event: ${event}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[Salla Webhook] Error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}

/**
 * Handle store authorization (Easy Mode)
 */
async function handleStoreAuthorize(merchantId: number, data: any) {
  try {
    console.log(`[Salla Webhook] Handling store authorize for merchant ${merchantId}`);

    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

    // Save tokens - note: we need to map merchant ID to user ID
    // This requires additional logic to associate merchant with user
    // For now, log the event
    console.log("[Salla Webhook] Store authorize data:", {
      merchantId,
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresAt,
    });

    // TODO: Implement merchant-to-user mapping
    // await saveSallaCredentials({
    //   clientId: '...',
    //   clientSecret: '...',
    //   accessToken: data.access_token,
    //   refreshToken: data.refresh_token,
    //   expiresAt,
    // });
  } catch (error) {
    console.error("[Salla Webhook] Error handling store authorize:", error);
  }
}

/**
 * Handle app uninstall
 */
async function handleAppUninstall(merchantId: number) {
  try {
    console.log(`[Salla Webhook] Handling app uninstall for merchant ${merchantId}`);

    // TODO: Mark integration as disconnected
    // This requires merchant-to-user mapping
  } catch (error) {
    console.error("[Salla Webhook] Error handling app uninstall:", error);
  }
}
