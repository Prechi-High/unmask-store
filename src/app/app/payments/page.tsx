import { Card } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <Card>
      <h1 className="text-2xl font-medium">Payments</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Platform subscriptions and customer checkout use separate payment records (`payments.kind`).
      </p>
    </Card>
  );
}
