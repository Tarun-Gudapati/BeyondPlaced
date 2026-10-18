import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[28%] bg-gradient-to-br from-brand-violet to-brand-mint shadow-[0_0_24px_-6px] shadow-brand-violet/60",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-[72%]" aria-hidden="true">
        <path d="M16 6 29 12 16 18 3 12Z" fill="#0F1020" />
        <path d="M8.5 15.2v5.3c0 2.2 3.4 4 7.5 4s7.5-1.8 7.5-4v-5.3L16 18.7Z" fill="#0F1020" opacity=".85" />
        <path d="M27 13v6.5" stroke="#0F1020" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M27 19.2 28.1 21.9 30.8 23 28.1 24.1 27 26.8 25.9 24.1 23.2 23 25.9 21.9Z" fill="#FFC145" />
      </svg>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-heading text-lg font-bold tracking-tight", className)}>
      Beyond
      <span className="bg-gradient-to-r from-brand-violet to-brand-mint bg-clip-text text-transparent">Placed</span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="BeyondPlaced home" className={cn("flex items-center gap-2", className)}>
      <BrandMark />
      <Wordmark />
    </Link>
  );
}
