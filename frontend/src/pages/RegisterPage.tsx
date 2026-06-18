import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/register', { name, email, password });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_name', response.data.user.name);
      localStorage.setItem('user_email', response.data.user.email);
      navigate('/dashboard');
    } catch (submitError) {
      setError('Unable to create the account. Check the form and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="glass-panel w-full max-w-md p-8 md:p-10">
        <p className="section-title">Create account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">Register</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Set up an account to upload resumes, run ATS scoring, and save analysis history.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input className="field" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="field" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="field" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button className="primary-button" disabled={isLoading} type="submit">
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Already have an account?{' '}
          <Link className="font-semibold text-brand-100 hover:text-brand-50" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
