export type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export async function initializePaystackTransaction(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amountKobo,
      reference: opts.reference,
      metadata: opts.metadata,
      callback_url: opts.callbackUrl,
    }),
  });

  const json = (await res.json()) as PaystackInitResponse;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Paystack initialization failed");
  }
  return json.data!;
}

export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    },
  );
  return res.json() as Promise<{
    status: boolean;
    data?: { status: string; reference: string; id: number; amount: number };
  }>;
}

export function paystackAmountToKobo(amount: number) {
  return Math.round(amount * 100);
}
