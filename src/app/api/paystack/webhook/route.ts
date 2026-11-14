import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { activateSubscriptionFromWebhook } from "@/app/actions/subscriptions";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

function verifySignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    data?: { reference?: string; status?: string; id?: number; amount?: number };
  };

  if (event.event === "charge.success" && event.data?.reference) {
    const verified = await verifyPaystackTransaction(event.data.reference);
    if (!verified.status || verified.data?.status !== "success") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await activateSubscriptionFromWebhook({
      reference: event.data.reference,
      transactionId: event.data.id != null ? String(event.data.id) : undefined,
      amount: event.data.amount,
    });
  }

  return NextResponse.json({ received: true });
}
