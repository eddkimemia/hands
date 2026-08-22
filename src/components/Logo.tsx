import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
}

export function Logo({ variant = "dark", compact = false, className }: LogoProps) {
  void variant;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo/hopelogo.png"
        alt="Ishara Charity"
        width={222}
        height={125}
        className={cn("w-auto", compact ? "h-12" : "h-16 sm:h-20")}
      />
    </span>
  );
}
