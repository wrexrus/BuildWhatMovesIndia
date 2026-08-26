import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { OFFLINE_TOOLS_MAP } from '../data/offlineToolsData';
import { Download, FileText, CheckCircle2, ChevronRight, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const OfflineToolPage = () => {
  const { toolId } = useParams();
  const [showChecksumInfo, setShowChecksumInfo] = useState(false);

  // Fallback to 'returns' if toolId not matched
  const tool = OFFLINE_TOOLS_MAP[toolId] || OFFLINE_TOOLS_MAP["returns"];

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Official GST Portal Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-100/80 px-4 py-2.5 rounded-lg border border-slate-200">
          <Link to="/" className="hover:text-navy text-blue-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">Downloads</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">{tool.title}</span>
        </div>

        {/* Main Content Box (Clean Official Style) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
          
          {/* Header Title */}
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#3F6F9F]">
              {tool.title} Version {tool.version}
            </h1>
          </div>

          {/* Description & Download Action */}
          <div className="mb-6 leading-relaxed text-sm text-slate-800">
            <p className="mb-4">
              {tool.description}{' '}
              <a
                href={tool.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 hover:underline bg-blue-50 px-3 py-1 rounded border border-blue-200 ml-1"
              >
                <span>Download</span>
                <Download className="w-4 h-4 text-blue-700" />
              </a>
            </p>

            {/* Package Contents List */}
            <div className="mt-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
              <h3 className="font-bold text-navy text-sm mb-3">
                Your downloaded ({tool.title}) zip file contains:
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                {tool.packageContents.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-5 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Important!</span>
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-amber-900">
                <li>
                  Before you extract and run the downloaded file, ensure that the file is not corrupted.{' '}
                  <button
                    onClick={() => setShowChecksumInfo(!showChecksumInfo)}
                    className="font-bold text-blue-800 underline cursor-pointer"
                  >
                    Click here to know more about checksum values.
                  </button>
                </li>
                <li>Go through the <strong>Readme</strong> document before you begin installation.</li>
                <li>Double-click on the installer file to install the offline tool.</li>
              </ul>

              {showChecksumInfo && (
                <div className="mt-3 p-4 bg-white rounded border border-amber-300 text-slate-700 space-y-2">
                  <h4 className="font-bold text-navy text-xs flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>How do I know if downloaded ZIP file is not corrupt?</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Match the SHA-256 checksum value generated on your computer with the official checksum published by the GST portal. If there is an exact match, your downloaded package is 100% authentic and safe to install.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* System Requirements Section */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-base font-bold text-[#3F6F9F] mb-2">
              System Requirement
            </h2>
            <h3 className="text-xs font-bold text-slate-700 mb-4">
              To use the tool efficiently, ensure that you have the following installed on your system:
            </h3>

            <ol className="list-decimal list-inside space-y-3 text-xs text-slate-700">
              <li className="leading-relaxed">
                <strong className="text-navy">Operating System:</strong> {tool.sysReq.os}
              </li>

              <li className="leading-relaxed">
                <strong className="text-navy">Supported Web Browsers:</strong> You need one of these browsers installed on your system:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-slate-600">
                  {tool.sysReq.browsers.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </li>

              <li className="leading-relaxed">
                <strong className="text-navy">Microsoft Excel:</strong> {tool.sysReq.excel}
              </li>

              <li className="text-slate-500">
                Alternatively, for any lower version, the tool will open in a default browser.
              </li>
            </ol>
          </div>

        </div>

      </div>
    </PageContainer>
  );
};

export default OfflineToolPage;
