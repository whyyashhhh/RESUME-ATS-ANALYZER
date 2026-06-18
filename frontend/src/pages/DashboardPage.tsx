import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { ScoreCard } from '../components/ScoreCard';
import { api } from '../lib/api';

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Choose a PDF or DOCX resume before analyzing.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await api.post('/upload-resume', formData, {
        params: { target_role: targetRole },
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const analyzeResponse = await api.post('/analyze-resume', {
        resume_id: uploadResponse.data.resume.id,
        job_description: jobDescription,
        target_role: targetRole,
      });

      navigate(`/analysis/${analyzeResponse.data.id}`);
    } catch (submitError) {
      setError('Analysis failed. Make sure the backend is running and the resume file is valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
      <Sidebar onLogout={handleLogout} />
      <section className="grid gap-6">
        <header className="glass-panel overflow-hidden p-6 md:p-8">
          <div className="max-w-3xl">
            <p className="section-title">Dashboard</p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">Analyze resumes against the real demands of a role</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Upload a resume, paste the job description, and get ATS scoring, keyword gaps, optimization notes, and AI rewrite guidance in one pass.
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-white">Upload and analyze</h3>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-slate-300">
                Target role
                <input className="field" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Resume file
                <input className="field file:mr-4 file:rounded-xl file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950" type="file" accept=".pdf,.docx" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Job description
                <textarea className="field min-h-64 resize-y" placeholder="Paste the job description here" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
              </label>

              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              <div className="flex flex-wrap gap-3">
                <button className="primary-button" disabled={isLoading} type="submit">
                  {isLoading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
                <button className="secondary-button" type="button" onClick={() => navigate('/history')}>
                  View history
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <ScoreCard title="ATS Score" value="84" subtitle="Overall fit for the current target role" tone="brand" />
            <ScoreCard title="Keyword Match" value="72%" subtitle="Strong overlap with role-specific terms" tone="accent" />
            <ScoreCard title="Missing Keywords" value="11" subtitle="Important gaps to weave into the resume" tone="slate" />
          </section>
        </div>
      </section>
    </main>
  );
}
