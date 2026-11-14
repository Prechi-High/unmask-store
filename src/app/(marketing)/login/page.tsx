import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <h1 className="text-2xl font-medium tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-500">Sign in to your seller or brand dashboard.</p>
        <form action={loginAction} className="mt-8 space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          New here?{" "}
          <Link href="/signup" className="text-neutral-900 underline-offset-4 hover:underline">
            Create account
          </Link>
        </p>
      </Card>
    </main>
  );
}
