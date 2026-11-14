import Link from "next/link";
import { signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <h1 className="text-2xl font-medium tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-neutral-500">Choose seller or brand to get started.</p>
        <form action={signupAction} className="mt-8 space-y-4">
          <Input name="display_name" placeholder="Your name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" minLength={8} required />
          <select
            name="account_type"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
            defaultValue="seller"
          >
            <option value="seller">Seller account</option>
            <option value="brand">Brand account</option>
          </select>
          <Input name="business_name" placeholder="Business / brand name" required />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-900 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
