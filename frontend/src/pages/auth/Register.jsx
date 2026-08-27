import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageContainer from '../../components/PageContainer';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import { UserPlus, CheckCircle, Mail } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    gstin: '',
    state: 'Maharashtra (27)',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Taxpayer Legal Name is required.");
      return;
    }

    if (!formData.gstin.trim() || formData.gstin.trim().length !== 15) {
      setError("Valid 15-digit GSTIN is required.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError("Valid email address is mandatory for taxpayer registration.");
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.message || "Failed to register taxpayer.");
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
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="break-words text-xl font-bold text-navy sm:text-2xl">New Taxpayer Registration</h2>
            <p className="mx-auto mt-1 max-w-md break-words text-xs leading-5 text-slate-500 sm:text-sm">
              Create your GST citizen profile to manage GSTR-3B filings seamlessly.
            </p>
          </div>

          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-xs leading-5 text-slate-600 sm:mb-6 sm:px-4">
            <span className="font-semibold text-navy">Hackathon Prototype:</span> This is a demo registration flow and is not an official GST government website.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField
              id="name"
              label="Taxpayer Legal Name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Ramesh Kumar"
            />

            <FormField
              id="tradeName"
              label="Trade / Business Name"
              value={formData.tradeName}
              onChange={(e) => handleChange('tradeName', e.target.value)}
              placeholder="e.g. Nagpur Hardware & Sanitary Store"
            />

            <FormField
              id="gstin"
              label="GSTIN (15-digit)"
              required
              value={formData.gstin}
              onChange={(e) => handleChange('gstin', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="e.g. 27AAAAA1234A1Z5"
              maxLength={15}
            />

            <FormField
              id="email"
              label="Email Address"
              required
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. ramesh.nagpur@gst.gov.in"
            />

            <FormField
              id="password"
              label="Password"
              required
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Choose a password"
            />

            {error && (
              <Alert type="error" title="Registration Error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#1a3f6e] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs leading-5 text-slate-500 sm:mt-6">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-blue-700 hover:underline">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
