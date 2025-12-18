import { NextRequest } from "next/server";
import { WhatsAppService } from "../services/whatsapp-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return WhatsAppService.instance.verifyWebhook(req, userId);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return WhatsAppService.instance.handle(req, userId);
}
