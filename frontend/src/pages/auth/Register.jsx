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
      <div className="max-w-xl mx-auto my-8 bg-white p-8 rounded-xl shadow-md border border-slate-200 font-sans">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-navy text-amber rounded-full mb-3 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy">New Taxpayer Registration</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create your GST citizen profile to manage GSTR-3B filings seamlessly.
          </p>
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
            className="w-full bg-navy hover:bg-[#1a3f6e] disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-blue-700 font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
