"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<React.ComponentProps<typeof Image>, "onError" | "alt"> & {
  alt?: string;
};

/**
 * next/image wrapper with a graceful branded placeholder if a remote
 * image ever fails to load.
 */
export function SmartImage({ alt = "", className, src, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "bg-gradient-to-br from-navy-100 via-sand to-gold-100",
          className,
        )}
      />
    );
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
