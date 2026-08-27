import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Building2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Printer,
  Clock,
  TrendingUp,
  Mail,
  MapPin,
  Edit3,
  KeyRound,
  Check,
  X,
  ShieldAlert,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const TaxpayerProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  const [taxpayer, setTaxpayer] = useState({
    name: user?.name || "Ramesh Kumar",
    tradeName: user?.tradeName || "Nagpur Hardware & Sanitary Store",
    gstin: user?.gstin || "27AAAAA1234A1Z5",
    email: user?.email || "ramesh.nagpur@gst.gov.in",
    mobile: user?.mobile || "+91 98765 43210",
    state: user?.state || "Maharashtra (27)",
    annualTurnover: user?.annualTurnover || "₹82,40,000",
    registrationType: "Regular Taxpayer (Composition Exempt)",
    dateOfRegistration: "01 Jul 2017",
    jurisdiction: user?.jurisdiction || "Nagpur South Ward-4, Zone II",
    lastLogin: user?.lastLogin || "Today at 09:30 AM"
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...taxpayer });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  const summary = {
    safetyScore: 85,
    eligibleItc: 18200,
    blockedItc: 6500,
    totalSalesTax: 42500,
    netTaxPayable: 24300,
    matchedCount: 14,
    mismatchCount: 6
  };

  const filingHistory = [
    { form: "GSTR-3B", period: "Jun 2026", arn: "AA270626112233M", date: "18 Jul 2026", status: "FILED", taxPaid: "₹21,400" },
    { form: "GSTR-1", period: "Jun 2026", arn: "AA270626998877K", date: "10 Jul 2026", status: "FILED", taxPaid: "N/A" },
    { form: "GSTR-3B", period: "May 2026", arn: "AA270526776655L", date: "19 Jun 2026", status: "FILED", taxPaid: "₹19,800" },
    { form: "GSTR-1", period: "May 2026", arn: "AA270526443322P", date: "11 Jun 2026", status: "FILED", taxPaid: "N/A" },
    { form: "CMP-08", period: "Q1 FY26", arn: "AA270426554433X", date: "18 Apr 2026", status: "EXEMPT", taxPaid: "₹0" }
  ];

  const pendingActions = [
    {
      id: 1,
      supplier: "Asian Paints",
      invoice: "AP/2026/045",
      tax: "₹4,500",
      reason: "GSTR-1 Not Filed by Supplier",
      actionLabel: "Defer ITC to Next Month",
      severity: "CRITICAL"
    },
    {
      id: 2,
      supplier: "Jaipur Handicrafts",
      invoice: "JQ/2026/089",
      tax: "₹6,000",
      reason: "Tax Rate Mismatch (Portal: ₹12k vs Bill: ₹18k)",
      actionLabel: "Claim ₹12k Portal Amount",
      severity: "WARNING"
    },
    {
      id: 3,
      supplier: "Polycab India",
      invoice: "POLY/2026/178",
      tax: "₹3,600",
      reason: "Duplicate Scanned Entry",
      actionLabel: "Remove Duplicate Entry",
      severity: "CRITICAL"
    }
  ];

  const handleOpenEditModal = () => {
    setEditFormData({ ...taxpayer });
    setIsEditModalOpen(true);
  };

  const handleInitiateOtpVerification = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setIsOtpModalOpen(true);

    if (showToast) {
      showToast(
        `Synthetic OTP sent to registered mobile ${taxpayer.mobile}`,
        'info',
        'Mock OTP Dispatched'
      );
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4']);
    setOtpError('');
  };

  const handleVerifyOtpAndSave = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 4) {
      setOtpError('Please enter all 4 digits of the verification OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      setTaxpayer({ ...editFormData });
      setIsVerifyingOtp(false);
      setIsOtpModalOpen(false);

      if (showToast) {
        showToast(
          'Taxpayer Profile updated & verified via OTP successfully!',
          'success',
          'Profile Verified'
        );
      }
    }, 800);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleDownloadProfilePdf = () => {
    if (showToast) {
      showToast(
        "Downloading Taxpayer Profile & Compliance Report PDF...",
        "success"
      );
    }

    const element = document.createElement("a");
    const file = new Blob([
      `=======================================================\n` +
      `       OFFICIAL TAXPAYER PROFILE & COMPLIANCE SUMMARY   \n` +
      `=======================================================\n` +
      `Taxpayer Legal Name : ${taxpayer.name}\n` +
      `Trade / Business    : ${taxpayer.tradeName}\n` +
      `GSTIN               : ${taxpayer.gstin}\n` +
      `Email               : ${taxpayer.email}\n` +
      `Mobile Number       : ${taxpayer.mobile}\n` +
      `State               : ${taxpayer.state}\n` +
      `Annual Turnover     : ${taxpayer.annualTurnover}\n` +
      `Registration Type   : ${taxpayer.registrationType}\n` +
      `Jurisdiction        : ${taxpayer.jurisdiction}\n` +
      `-------------------------------------------------------\n` +
      `GSTR-3B RECONCILIATION SUMMARY (JULY 2026):\n` +
      `- Safety Filing Score  : ${summary.safetyScore}% (SAFE)\n` +
      `- Matched Invoices     : ${summary.matchedCount}\n` +
      `- Mismatched Invoices  : ${summary.mismatchCount}\n` +
      `- Total Sales Tax      : ₹${summary.totalSalesTax.toLocaleString()}\n` +
      `- Eligible ITC         : ₹${summary.eligibleItc.toLocaleString()}\n` +
      `- Net Tax Payable      : ₹${summary.netTaxPayable.toLocaleString()}\n` +
      `-------------------------------------------------------\n` +
      `Report Generated On    : ${new Date().toLocaleString('en-IN')}\n` +
      `Goods and Services Tax Network (GSTN)\n`
    ], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = `GST_Taxpayer_Profile_${taxpayer.gstin}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-7xl px-3 py-5 font-sans text-ink sm:px-6 sm:py-7 lg:px-8 lg:py-9">

        <div className="mb-6 border-l-4 border-amber bg-amber/10 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-saffron-dark">
                Demo / Prototype
              </p>
              <p className="mt-0.5 text-xs leading-5 text-ink/70 sm:text-[13px]">
                This taxpayer profile uses synthetic data and is a hackathon prototype, not an official GST Portal page.
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide text-saffron-dark/70">
              Mock data
            </span>
          </div>
        </div>

        <section className="mb-7 overflow-hidden rounded-xl bg-navy text-white sm:mb-8">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber/50 bg-white/10 text-amber sm:h-14 sm:w-14">
                  <User className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="break-words text-xl font-bold tracking-tight sm:text-2xl lg:text-[1.75rem]">
                      {taxpayer.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/75">
                    {taxpayer.tradeName}
                  </p>

                  <div className="mt-4 grid gap-2 text-xs text-white/70 sm:grid-cols-2 lg:grid-cols-4">
                    <span className="min-w-0 truncate font-mono">
                      GSTIN: {taxpayer.gstin}
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-amber" />
                      <span className="truncate">{taxpayer.state}</span>
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-amber" />
                      <span className="truncate">{taxpayer.email}</span>
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 shrink-0 text-amber" />
                      <span className="truncate">{taxpayer.mobile}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto lg:min-w-[420px]">
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-amber/90"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={handleDownloadProfilePdf}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>

                <button
                  type="button"
                  onClick={handlePrintSummary}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 border-y border-line bg-white sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-line p-5 sm:border-r lg:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Filing Health
              </p>
              <ShieldCheck className="h-4 w-4 text-green" />
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-navy">
                {summary.safetyScore}%
              </span>
              <span className="text-xs font-semibold text-green">
                Safe to file
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-5 text-muted">
              {summary.matchedCount} of 20 invoices matched with GSTR-2B
            </p>
          </div>

          <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Eligible ITC
              </p>
              <TrendingUp className="h-4 w-4 text-navy" />
            </div>

            <p className="mt-3 text-2xl font-bold text-green">
              ₹{summary.eligibleItc.toLocaleString()}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-muted">
              Available for claim in GSTR-2B
            </p>
          </div>

          <div className="border-b border-line p-5 sm:border-r lg:border-b-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Net Tax Payable
              </p>
              <FileText className="h-4 w-4 text-saffron" />
            </div>

            <p className="mt-3 text-2xl font-bold text-navy">
              ₹{summary.netTaxPayable.toLocaleString()}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-muted">
              Total sales tax ₹{summary.totalSalesTax.toLocaleString()}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Blocked ITC
              </p>
              <AlertTriangle className="h-4 w-4 text-saffron" />
            </div>

            <p className="mt-3 text-2xl font-bold text-saffron-dark">
              ₹{summary.blockedItc.toLocaleString()}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-muted">
              Pending supplier or invoice issues
            </p>
          </div>
        </section>

        <div className="mb-8 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)]">

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Registration
                </p>
                <h2 className="mt-1 text-lg font-bold text-navy">
                  Taxpayer information
                </h2>
              </div>

              <button
                type="button"
                onClick={handleOpenEditModal}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy transition-colors hover:text-navy-hover"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>

            <div className="divide-y divide-line border-y border-line bg-white">
              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Legal Name</p>
                <p className="mt-1 text-sm font-semibold text-ink">{taxpayer.name}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Trade Name</p>
                <p className="mt-1 text-sm font-medium text-ink">{taxpayer.tradeName}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">GSTIN / Unique ID</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-navy">
                  {taxpayer.gstin}
                </p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Email Address</p>
                <p className="mt-1 break-all text-sm font-medium text-ink">{taxpayer.email}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Mobile Number</p>
                <p className="mt-1 text-sm font-medium text-ink">{taxpayer.mobile}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Registration Type</p>
                <p className="mt-1 text-sm font-medium leading-5 text-ink">
                  {taxpayer.registrationType}
                </p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Annual Turnover</p>
                <p className="mt-1 text-sm font-semibold text-green">{taxpayer.annualTurnover}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">State & Code</p>
                <p className="mt-1 text-sm font-medium text-ink">{taxpayer.state}</p>
              </div>

              <div className="px-4 py-3.5">
                <p className="text-[11px] font-medium text-muted">Jurisdictional Office</p>
                <p className="mt-1 text-sm font-medium leading-5 text-ink">
                  {taxpayer.jurisdiction}
                </p>
              </div>
            </div>

            <Link
              to="/gstr3b-simplified"
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover"
            >
              Launch GSTR-3B Dashboard
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="min-w-0">
            <div className="mb-4 flex flex-col gap-2 border-b border-line pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Compliance
                </p>
                <h2 className="mt-1 text-lg font-bold text-navy">
                  Pending action items
                </h2>
              </div>

              <span className="text-xs font-medium text-muted">
                {pendingActions.length} items · July 2026
              </span>
            </div>

            <div className="divide-y divide-line border-y border-line bg-white">
              {pendingActions.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-navy">
                        {item.supplier}
                      </span>
                      <span className="break-all font-mono text-[11px] text-muted">
                        #{item.invoice}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-muted">
                      {item.reason}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-saffron-dark">
                      Tax credit impact: {item.tax}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (showToast) {
                        showToast(
                          `Action initiated for ${item.supplier}: ${item.actionLabel}`,
                          'info'
                        );
                      }
                      navigate('/gstr3b-simplified');
                    }}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-navy bg-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-hover sm:w-auto"
                  >
                    {item.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Filing record
              </p>
              <h2 className="mt-1 text-lg font-bold text-navy">
                GST return filing history
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted">
                Verified ARNs and filing timestamps recorded on the GST Portal
              </p>
            </div>

            <Link
              to="/registration/track-status"
              className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-navy transition-colors hover:text-navy-hover"
            >
              Track Application Status
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto border-y border-line bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-shell/60 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Form Type</th>
                  <th className="px-4 py-3">Return Period</th>
                  <th className="px-4 py-3">ARN Reference</th>
                  <th className="px-4 py-3">Date of Filing</th>
                  <th className="px-4 py-3">Tax Paid</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {filingHistory.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-shell/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-navy">
                      {row.form}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-ink/80">
                      {row.period}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] font-medium text-ink">
                      {row.arn}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-muted">
                      {row.date}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-ink">
                      {row.taxPaid}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <div className="my-auto max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-line bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Profile
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy">
                    Edit taxpayer details
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-shell hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleInitiateOtpVerification}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink">
                    Legal Name (Regulated)
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    disabled
                    className="w-full rounded-md border border-line bg-shell px-3 py-2.5 text-sm text-muted"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink">
                    Trade / Business Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.tradeName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        tradeName: e.target.value
                      })
                    }
                    required
                    className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value
                        })
                      }
                      required
                      className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.mobile}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          mobile: e.target.value
                        })
                      }
                      required
                      className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink">
                      Annual Turnover Category
                    </label>
                    <select
                      value={editFormData.annualTurnover}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          annualTurnover: e.target.value
                        })
                      }
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    >
                      <option value="₹82,40,000">
                        ₹82,40,000 (₹40L - ₹1.5 Cr)
                      </option>
                      <option value="₹1,20,00,000">
                        ₹1.20 Cr (Medium SME)
                      </option>
                      <option value="₹35,00,00,000">
                        ₹35.00 Cr (Large Enterprise)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-ink">
                      Jurisdiction Ward
                    </label>
                    <input
                      type="text"
                      value={editFormData.jurisdiction}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          jurisdiction: e.target.value
                        })
                      }
                      required
                      className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="min-h-10 rounded-md px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:bg-shell hover:text-ink"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover"
                  >
                    <KeyRound className="h-4 w-4 text-amber" />
                    Save & Verify via OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <div className="my-auto w-full max-w-md rounded-t-xl border border-line bg-white p-5 shadow-2xl sm:rounded-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Verification
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy">
                    Synthetic OTP verification
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-shell hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 border-l-4 border-amber bg-amber/10 px-4 py-3">
                <p className="text-xs leading-5 text-ink/75">
                  For this prototype, a 4-digit synthetic verification OTP has been sent to the registered mobile{' '}
                  <span className="font-semibold text-ink">
                    {taxpayer.mobile}
                  </span>{' '}
                  and email.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="inline-flex min-h-9 items-center justify-center rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-xs font-semibold text-saffron-dark transition-colors hover:bg-amber/20"
                >
                  Auto-fill demo OTP: 1234
                </button>
              </div>

              <form
                onSubmit={handleVerifyOtpAndSave}
                className="mt-6"
              >
                <div className="flex justify-start gap-2 sm:gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpDigits[idx]}
                      onChange={(e) =>
                        handleOtpChange(idx, e.target.value)
                      }
                      className="h-12 w-11 rounded-md border border-line bg-shell text-center text-lg font-semibold text-navy focus:border-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/10 sm:w-12"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    {otpError}
                  </p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(false)}
                    className="min-h-10 rounded-md px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:bg-shell hover:text-ink"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isVerifyingOtp ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Verify & Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TaxpayerProfilePage;