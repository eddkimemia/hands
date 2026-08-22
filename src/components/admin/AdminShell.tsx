"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { RESOURCES } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

const GROUPS = ["Content", "Community", "Commerce", "Configuration"] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-navy-50/60">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-100 lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image src="/logo/hopelogo.png" alt="Ishara Charity" width={64} height={36} className="h-9 w-auto" />
              <span className="font-display text-lg font-semibold text-navy-900">
                Ishara Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="btn-outline btn-sm hidden sm:inline-flex"
            >
              <Icon name="external-link" size={14} />
              View Site
            </Link>
            <button onClick={logout} className="btn-navy btn-sm">
              <Icon name="logout" size={14} />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[110rem]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 mt-16 w-72 overflow-y-auto border-r border-navy-100 bg-white p-4 transition-transform lg:sticky lg:top-16 lg:mt-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav aria-label="Admin sections" className="space-y-5 pb-8">
            <SidebarLink href="/admin" icon="dashboard" label="Overview" active={pathname === "/admin"} />
            {GROUPS.map((group) => {
              const items = RESOURCES.filter((r) => r.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map((r) => (
                      <li key={r.key}>
                        <SidebarLink
                          href={`/admin/${r.key}`}
                          icon={r.icon}
                          label={r.label}
                          active={pathname === `/admin/${r.key}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        {open && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-20 bg-navy-950/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-navy-900 text-white shadow-card"
          : "text-navy-700 hover:bg-navy-50",
      )}
    >
      <Icon name={icon as never} size={17} className={active ? "text-gold-300" : "text-navy-400"} />
      {label}
    </Link>
  );
}
