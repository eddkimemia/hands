export default function Loading() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center bg-white" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-gold-100 text-gold-600">
          <svg viewBox="0 0 96 96" className="h-8 w-8" aria-hidden="true">
            <circle cx="48" cy="27" r="12.5" fill="#E8A33D" />
            <path d="M6 66 C 14 50, 32 40, 47.5 44 C 34 50, 20 57, 11.5 71 Z" fill="#0B2145" />
            <path d="M90 66 C 82 50, 64 40, 48.5 44 C 62 50, 76 57, 84.5 71 Z" fill="#1D6FE0" />
          </svg>
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-navy-400">Loading…</span>
      </div>
    </div>
  );
}
