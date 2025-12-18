import { NextRequest } from "next/server";
import { WhatsAppService } from "./services/whatsapp-service";

export async function GET(req: NextRequest) {
  return WhatsAppService.instance.verifyWebhook(req);
}

export async function POST(req: NextRequest) {
  return WhatsAppService.instance.handle(req);
}
