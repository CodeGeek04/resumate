'use client';

import { useState } from 'react';

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const formData = new FormData();
      if (resumeFile) formData.append('resumeFile', resumeFile);
      if (resumeText) formData.append('resumeText', resumeText);
      if (jobUrl) formData.append('jobUrl', jobUrl);
      if (jobText) formData.append('jobText', jobText);

      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate resume');
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        // Debug response
        const debugData = await response.json();
        console.log('AI Generated Data:', debugData.generatedData);
        console.log('LaTeX Content:', debugData.latexContent);
        throw new Error(debugData.error + '\n\nCheck console for debug info');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (pdfUrl) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b">
          <h1 className="text-xl font-semibold text-gray-800">Resume Generated</h1>
          <div className="flex gap-3">
            <a
              href={pdfUrl}
              download="resume.pdf"
              className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-900"
            >
              Download
            </a>
            <button
              onClick={() => setPdfUrl(null)}
              className="px-5 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300"
            >
              New
            </button>
          </div>
        </div>
        <iframe src={pdfUrl} className="flex-1 w-full" title="Resume PDF" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 grid grid-cols-2">
        {/* Left Panel */}
        <div className="bg-white border-r flex flex-col">
          <div className="px-8 py-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Your Resume</h2>
          </div>
          <div className="flex-1 p-8 space-y-6 overflow-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <input
                type="file"
                accept=".txt,.md,.pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-800 file:text-white file:text-sm hover:file:bg-slate-900 file:cursor-pointer cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Paste Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Name, contact, experience, education, skills..."
                className="w-full h-64 p-3 border rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white flex flex-col">
          <div className="px-8 py-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
          </div>
          <div className="flex-1 p-8 space-y-6 overflow-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="w-full p-3 border rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full h-64 p-3 border rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-white border-t px-8 py-5">
        {error && (
          <div className="mb-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={loading || (!resumeFile && !resumeText) || (!jobUrl && !jobText)}
            className="px-16 py-3 bg-slate-800 text-white font-medium rounded hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
