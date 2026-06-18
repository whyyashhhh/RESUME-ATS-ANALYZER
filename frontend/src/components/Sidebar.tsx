import { Link } from 'react-router-dom';

type SidebarProps = {
  onLogout?: () => void;
};

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="glass-panel w-full max-w-xs p-6">
      <div>
        <p className="section-title">Resume AI</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white">ATS Optimizer</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Upload resumes, compare against job descriptions, and turn AI signals into actionable edits.
        </p>
      </div>
      <nav className="mt-8 grid gap-3 text-sm font-medium">
        <Link className="rounded-2xl bg-brand-500 px-4 py-3 text-slate-950 transition hover:bg-brand-100" to="/dashboard">
          Dashboard
        </Link>
        <Link className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200 transition hover:bg-white/5" to="/history">
          History
        </Link>
        <button className="rounded-2xl border border-white/10 px-4 py-3 text-left text-slate-200 transition hover:bg-white/5" onClick={onLogout} type="button">
          Logout
        </button>
      </nav>
    </aside>
  );
}
