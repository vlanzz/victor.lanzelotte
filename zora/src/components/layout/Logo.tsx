/** Wordmark "zora": o "o" é um sol nascente sobre a linha do horizonte. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Zora"
      className={`font-display inline-flex items-baseline text-3xl font-semibold tracking-tight text-ink ${className}`}
    >
      <span aria-hidden>z</span>
      <svg aria-hidden viewBox="0 0 24 24" className="mx-px h-[0.78em] w-[0.78em] translate-y-[0.04em]">
        <path d="M2 15a10 10 0 0 1 20 0z" fill="var(--color-sun)" />
        <path d="M1 19.5h22" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 1.5v2.5M3.8 5.3l1.7 1.7M20.2 5.3l-1.7 1.7" stroke="var(--color-honey)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span aria-hidden>ra</span>
    </span>
  );
}
