"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

/**
 * Slim sitewide banner promoting the WhatsApp community.
 * Rendered only when an invite link is set in Admin → Site Settings.
 */
export function TopBar({ url }: { url: string }) {
  const [hidden, setHidden] = useState(false);

  if (!url || hidden) return null;

  return (
    <div className="relative bg-gold-400 text-navy-950">
      <div className="container-x flex items-center justify-center gap-3 py-2 pr-10 text-xs font-semibold sm:text-sm">
        <Icon name="whatsapp" size={15} />
        <span>Join our WhatsApp community for updates, events &amp; conversations</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-navy-950 px-3.5 py-1 text-[11px] font-bold !text-white transition-transform hover:scale-[1.03]"
        >
          Join
        </a>
      </div>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Dismiss banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-navy-950/10"
      >
        <Icon name="close" size={13} />
      </button>
    </div>
  );
}
