import { NextRequest } from "next/server";
import { WhatsAppService } from "./services/whatsapp-service";

const whatsAppService = new WhatsAppService();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  return whatsAppService.verifyWebhook(searchParams);
}

export async function POST(req: NextRequest) {
  return whatsAppService.processWebhook(req);
}
