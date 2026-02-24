import { useState } from 'react';
import { mockRAGDocuments } from '../lib/mockData';
import type { RAGDocument } from '../types';
import {
  Database,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig: Record<
  RAGDocument['status'],
  { icon: React.ReactNode; label: string; color: string }
> = {
  indexed: {
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    label: 'Indexed',
    color: 'bg-green-100 text-green-700',
  },
  processing: {
    icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4 text-red-500" />,
    label: 'Error',
    color: 'bg-red-100 text-red-700',
  },
};

export default function AdminRepository() {
  const [documents] = useState<RAGDocument[]>(mockRAGDocuments);
  const [search, setSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const filtered = documents.filter((d) =>
    search
      ? d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" />
          RAG Repository
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage the internal legal knowledge base for AI-powered precedent
          matching
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Total Documents</p>
          <p className="text-2xl font-bold text-slate-900">
            {documents.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Indexed</p>
          <p className="text-2xl font-bold text-green-600">
            {documents.filter((d) => d.status === 'indexed').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600">
            {documents.filter((d) => d.status === 'processing').length}
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all mb-8 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <Upload
          className={`w-8 h-8 mx-auto mb-2 ${
            dragActive ? 'text-indigo-500' : 'text-slate-400'
          }`}
        />
        <p className="text-sm font-medium text-slate-700 mb-1">
          Upload documents to the legal knowledge base
        </p>
        <p className="text-xs text-slate-500">
          PDF, DOCX, TXT — Documents will be chunked, embedded, and indexed in
          Vertex AI Vector Search
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Document
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Size
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((doc) => {
              const sc = statusConfig[doc.status];
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {doc.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(doc.uploadedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-600">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {doc.uploadedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatSize(doc.fileSize)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}
                    >
                      {sc.icon}
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
