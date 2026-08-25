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
      <div className="max-w-xl mx-auto my-8 bg-white p-8 rounded-xl shadow-md border border-slate-200 font-sans">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-navy text-amber rounded-full mb-3 shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Taxpayer Login</h2>
          <p className="text-sm text-slate-500 mt-1">
            Access your GSTR-3B return dashboard and citizen assistant.
          </p>
        </div>

        {/* Quick Mock Login Banner for Ramesh */}
        <div className="mb-6 p-4 bg-amber/10 border border-amber/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-navy shrink-0" />
            <div>
              <p className="text-xs font-bold text-navy">Hackathon Demo Persona</p>
              <p className="text-[11px] text-slate-600">Login instantly as Ramesh (Nagpur Hardware)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleMockLoginClick}
            disabled={loading}
            className="bg-navy hover:bg-[#1a3f6e] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
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
            className="w-full bg-navy hover:bg-[#1a3f6e] disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Login to Dashboard'}</span>
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          New to GST Portal?{' '}
          <Link to="/register" className="text-blue-700 font-bold hover:underline">
            Register New Taxpayer
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
