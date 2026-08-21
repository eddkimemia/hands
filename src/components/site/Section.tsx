import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", align === "center" && "justify-center", dark && "text-gold-300")}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("h-display text-3xl sm:text-4xl lg:text-[2.75rem]", dark && "text-white")}>
        {title}
      </h2>
      {description && (
        <p className={cn("lede mt-4", dark && "text-navy-100/80")}>{description}</p>
      )}
    </Reveal>
  );
}
