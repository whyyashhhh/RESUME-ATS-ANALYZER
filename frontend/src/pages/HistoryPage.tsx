import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { api } from '../lib/api';

type HistoryItem = {
  id: number;
  file_name: string;
  target_role: string | null;
  ats_score: number;
  keyword_score: number;
  created_at: string;
};

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    window.location.href = '/login';
  };

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await api.get('/analysis-history', { params: query ? { q: query } : undefined });
        if (isMounted) {
          setItems(response.data.items);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load previous analyses.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    void fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
      <Sidebar onLogout={handleLogout} />
      <section className="grid gap-6">
        <header className="glass-panel p-6 md:p-8">
          <p className="section-title">History</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white">Previous analyses</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Search, filter, and revisit earlier ATS scans to compare changes over time.
          </p>

          <div className="mt-6 max-w-xl">
            <input className="field" placeholder="Search by role or file name" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </header>

        {isLoading ? <p className="text-sm text-slate-300">Loading history...</p> : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="grid gap-4">
          {items.map((item) => (
            <Link key={item.id} className="glass-panel flex flex-col gap-4 p-6 transition hover:border-brand-200/30 hover:bg-white/10 md:flex-row md:items-center md:justify-between" to={`/analysis/${item.id}`}>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-brand-200">{item.target_role || 'Target role not set'}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{item.file_name}</h2>
                <p className="mt-2 text-sm text-slate-300">Scored on {new Date(item.created_at).toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">ATS {item.ats_score}</span>
                <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">Keywords {item.keyword_score}%</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
