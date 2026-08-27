import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../components/PageContainer';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import { LogIn, UserCheck, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [gstinOrEmail, setGstinOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, mockLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gstinOrEmail.trim()) {
      setError("GSTIN or Email is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(gstinOrEmail, password);
      navigate('/');
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLoginClick = async () => {
    setError("");
    setLoading(true);
    try {
      await mockLogin();
      navigate('/');
    } catch (err) {
      setError("Mock login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto my-4 w-full max-w-xl min-w-0 px-3 sm:my-8 sm:px-6">
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 font-sans shadow-md sm:p-6 md:p-8">
          <div className="mb-5 text-center sm:mb-6">
            <div className="mb-3 inline-flex rounded-full bg-navy p-3 text-amber shadow-xs">
              <LogIn className="h-6 w-6" />
            </div>
            <h2 className="break-words text-xl font-bold text-navy sm:text-2xl">Taxpayer Login</h2>
            <p className="mx-auto mt-1 max-w-md break-words text-xs leading-5 text-slate-500 sm:text-sm">
              Access your GSTR-3B return dashboard and citizen assistant.
            </p>
          </div>

          <div className="mb-5 flex min-w-0 flex-col gap-3 rounded-lg border border-amber/30 bg-amber/10 p-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex min-w-0 items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
              <div className="min-w-0">
                <p className="break-words text-xs font-bold text-navy">Hackathon Demo Persona</p>
                <p className="break-words text-[11px] leading-4 text-slate-600">Login instantly as Ramesh (Nagpur Hardware)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMockLoginClick}
              disabled={loading}
              className="min-h-10 w-full shrink-0 rounded-md bg-navy px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1a3f6e] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer sm:w-auto"
            >
              Instant Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="gstinOrEmail"
              label="GSTIN / Username / Email"
              required
              value={gstinOrEmail}
              onChange={(e) => {
                setGstinOrEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. 27AAAAA1234A1Z5 or ramesh@gst.gov.in"
            />

            <FormField
              id="password"
              label="Password"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your password"
            />

            {error && (
              <Alert type="error" title="Authentication Error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#1a3f6e] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <UserCheck className="h-4 w-4 shrink-0" />
              <span className="truncate">{loading ? 'Logging in...' : 'Login to Dashboard'}</span>
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs leading-5 text-slate-500 sm:mt-6">
            New to GST Portal?{' '}
            <Link to="/register" className="font-bold text-blue-700 hover:underline">
              Register New Taxpayer
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
