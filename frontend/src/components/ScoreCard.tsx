type ScoreCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: 'brand' | 'accent' | 'slate';
};

const toneStyles = {
  brand: 'from-brand-500/30 to-brand-700/10',
  accent: 'from-accent-500/30 to-accent-700/10',
  slate: 'from-white/10 to-white/5',
} as const;

export function ScoreCard({ title, value, subtitle, tone = 'brand' }: ScoreCardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneStyles[tone]} p-5 shadow-panel backdrop-blur-xl`}>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-300">{title}</p>
      <div className="mt-3 text-4xl font-semibold text-white">{value}</div>
      {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-300">{subtitle}</p> : null}
    </div>
  );
}
