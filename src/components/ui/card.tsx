import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_40px_-24px_rgba(0,0,0,0.25)]",
        className,
      )}
      {...props}
    />
  );
}
