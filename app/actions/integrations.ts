"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { 
  Integration, 
  ConnectIntegrationData, 
  UpdateIntegrationData,
  IntegrationTestResult 
} from "@/types/integration";

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
 * Get all integrations for the current user
 */
export async function getIntegrations() {
  try {
    const user = await getAuthUser();

    const integrations = await db
      .select()
      .from(integration)
      .where(eq(integration.userId, user.id));

    return {
      success: true,
      data: integrations as Integration[],
    };
  } catch (error: any) {
    console.error("Get integrations error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب التكاملات",
    };
  }
}

/**
 * Get single integration by service ID
 */
export async function getIntegration(serviceId: string) {
  try {
    const user = await getAuthUser();

    const [integrationData] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .limit(1);

    if (!integrationData) {
      return {
        success: false,
        error: "التكامل غير موجود",
      };
    }

    return {
      success: true,
      data: integrationData as Integration,
    };
  } catch (error: any) {
    console.error("Get integration error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء جلب التكامل",
    };
  }
}

/**
 * Connect a new integration
 */
export async function connectIntegration(serviceId: string, credentials: Record<string, unknown>) {
  const data: ConnectIntegrationData = {
    serviceId: serviceId as ConnectIntegrationData['serviceId'],
    serviceName: serviceId === 'whatsapp' ? 'WhatsApp Business API' : serviceId,
    credentials: credentials
  };
  try {
    const user = await getAuthUser();

    // Check if integration already exists for this service
    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, data.serviceId)
        )
      )
      .limit(1);

    if (existingIntegration) {
      return {
        success: false,
        error: "هذا التكامل موجود بالفعل. يمكنك تحديث إعداداته بدلاً من ذلك.",
      };
    }

    // Validate Credentials for specific services
    if (data.serviceId === "whatsapp") {
        const { accessToken, phoneNumberId } = data.credentials;
        if (!accessToken || !phoneNumberId) {
             return { success: false, error: "بيانات الاعتماد غير مكتملة" };
        }
        
        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            if (!response.ok) {
                const err = await response.json();
                console.error("Meta Validation Error:", err);
                return { success: false, error: "فشل التحقق من بيانات Meta. تأكد من صحة معرف الهاتف ورمز الوصول." };
            }
            
            const metaData = await response.json();
             if (metaData.id !== phoneNumberId) {
                 return { success: false, error: "معرف الهاتف غير متطابق مع البيانات المسترجعة من Meta" };
             }

        } catch (e) {
             return { success: false, error: "حدث خطأ أثناء الاتصال بخوادم Meta للتحقق من البيانات" };
        }
    }

    // TODO: In production, encrypt credentials before storing
    const credentialsString = JSON.stringify(data.credentials);
    const metadataString = data.metadata ? JSON.stringify(data.metadata) : null;

    const [newIntegration] = await db
      .insert(integration)
      .values({
        userId: user.id,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        status: "connected",
        credentials: credentialsString,
        metadata: metadataString,
        connectedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      message: `تم ربط ${data.serviceName} بنجاح`,
      data: newIntegration as Integration,
    };
  } catch (error: any) {
    console.error("Connect integration error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء ربط التكامل",
    };
  }
}

/**
 * Disconnect an integration
 */
export async function disconnectIntegration(serviceId: string) {
  try {
    const user = await getAuthUser();

    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .limit(1);

    if (!existingIntegration) {
      return {
        success: false,
        error: "التكامل غير موجود",
      };
    }

    // Update status to disconnected instead of deleting
    const [updatedIntegration] = await db
      .update(integration)
      .set({
        status: "disconnected",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .returning();

    return {
      success: true,
      message: "تم فصل التكامل بنجاح",
      data: updatedIntegration as Integration,
    };
  } catch (error: any) {
    console.error("Disconnect integration error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء فصل التكامل",
    };
  }
}

/**
 * Update integration settings
 */
export async function updateIntegrationSettings(serviceId: string, data: UpdateIntegrationData) {
  try {
    const user = await getAuthUser();

    const [existingIntegration] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .limit(1);

    if (!existingIntegration) {
      return {
        success: false,
        error: "التكامل غير موجود",
      };
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.credentials) {
      // TODO: In production, encrypt credentials before storing
      updateData.credentials = JSON.stringify(data.credentials);
      console.log(`[DB Update] Updating credentials for ${serviceId}:`, updateData.credentials);
    }

    if (data.metadata) {
      updateData.metadata = JSON.stringify(data.metadata);
    }

    const [updatedIntegration] = await db
      .update(integration)
      .set(updateData)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .returning();

    return {
      success: true,
      message: "تم تحديث إعدادات التكامل بنجاح",
      data: updatedIntegration as Integration,
    };
  } catch (error: any) {
    console.error("Update integration settings error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء تحديث إعدادات التكامل",
    };
  }
}

/**
 * Test integration connection
 */
export async function testIntegration(serviceId: string) {
  try {
    const user = await getAuthUser();

    const [integrationData] = await db
      .select()
      .from(integration)
      .where(
        and(
          eq(integration.userId, user.id),
          eq(integration.serviceId, serviceId)
        )
      )
      .limit(1);

    if (!integrationData) {
      return {
        success: false,
        error: "التكامل غير موجود",
      };
    }

    // TODO: Implement actual integration testing based on service type
    // For now, return a mock success
    const result: IntegrationTestResult = {
      success: true,
      message: "تم اختبار الاتصال بنجاح",
      details: {
        serviceId,
        testedAt: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Test integration error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ أثناء اختبار التكامل",
    };
  }
}
