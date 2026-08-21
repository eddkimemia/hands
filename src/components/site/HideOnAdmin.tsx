"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides site chrome (header/footer) inside the admin dashboard. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
