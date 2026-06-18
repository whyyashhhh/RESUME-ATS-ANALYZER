import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ScoreCard } from '../components/ScoreCard';
import { api } from '../lib/api';

type AnalysisResponse = {
  id: number;
  ats_score: number;
  keyword_score: number;
  analysis_json: {
    insights?: {
      resume_summary?: string;
      strengths?: string[];
      weaknesses?: string[];
      missing_keywords?: string[];
      matched_keywords?: string[];
      skills_identified?: string[];
      ats_optimization_suggestions?: string[];
      resume_rewrite_suggestions?: string[];
      cover_letter_suggestions?: string[];
      interview_questions?: Record<string, string[]>;
      semantic_context?: string[];
    };
    score_breakdown?: Record<string, number>;
  };
};

export function AnalysisResultsPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/analysis/${id}`);
        if (isMounted) {
          setAnalysis(response.data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load the analysis report.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchAnalysis();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const insights = analysis?.analysis_json.insights;
  const breakdown = analysis?.analysis_json.score_breakdown ?? {};

  const downloadReport = async () => {
    try {
      setDownloadError('');
      const response = await api.get(`/analysis/${id}/download`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `analysis-${id}-report.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadRequestError) {
      setDownloadError('Unable to download the report right now.');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-6">
      <section className="glass-panel overflow-hidden p-6 md:p-8">
        <p className="section-title">Analysis report</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white">Resume analysis #{id}</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Review the ATS score, keyword coverage, and the structured AI recommendations generated from the resume and job description pairing.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ScoreCard title="ATS Score" value={analysis?.ats_score ?? '--'} subtitle="Out of 100" tone="brand" />
            <ScoreCard title="Keyword Match" value={`${analysis?.keyword_score ?? '--'}%`} subtitle="Resume vs. job description" tone="accent" />
            <button className="secondary-button sm:col-span-2" onClick={downloadReport} type="button">
              Download report
            </button>
          </div>
        </div>

        {isLoading ? <p className="mt-8 text-sm text-slate-300">Loading analysis...</p> : null}
        {error ? <p className="mt-8 text-sm text-red-300">{error}</p> : null}
        {downloadError ? <p className="mt-4 text-sm text-red-300">{downloadError}</p> : null}

        {analysis ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6">
              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Resume Summary</h2>
                <p className="mt-3 leading-7 text-slate-300">{insights?.resume_summary}</p>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Strengths</h2>
                <ul className="mt-4 grid gap-3 text-slate-300">
                  {(insights?.strengths ?? []).map((item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Weaknesses</h2>
                <ul className="mt-4 grid gap-3 text-slate-300">
                  {(insights?.weaknesses ?? []).map((item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="grid gap-6">
              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Score Breakdown</h2>
                <div className="mt-4 grid gap-4">
                  {Object.entries(breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${Math.min(100, Number(value) * 4)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Missing Keywords</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(insights?.missing_keywords ?? []).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-sm text-accent-50">
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">AI Suggestions</h2>
                <ul className="mt-4 grid gap-3 text-slate-300">
                  {(insights?.ats_optimization_suggestions ?? []).map((item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Cover Letter Ideas</h2>
                <ul className="mt-4 grid gap-3 text-slate-300">
                  {(insights?.cover_letter_suggestions ?? []).map((item) => (
                    <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</li>
                  ))}
                </ul>
              </article>

              <article className="glass-panel p-6">
                <h2 className="text-xl font-semibold text-white">Interview Questions</h2>
                <div className="mt-4 grid gap-4 text-slate-300">
                  {Object.entries(insights?.interview_questions ?? {}).map(([category, questions]) => (
                    <div key={category}>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{category}</p>
                      <ul className="mt-2 grid gap-2">
                        {questions.map((question) => (
                          <li key={question} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{question}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
