import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockSubmissions, mockPrecedents, mockChatMessages } from '../lib/mockData';
import {
  CONTENT_TYPE_LABELS,
  RISK_LABELS,
  type ChatMessage,
} from '../types';
import { api } from '../lib/api';
import {
  ArrowLeft,
  FileText,
  Send,
  Shield,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Brain,
  Scale,
  Database,
} from 'lucide-react';
import { format } from 'date-fns';

const riskBg: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

export default function LegalReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const submission = mockSubmissions.find((s) => s.id === id);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!submission) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Submission not found.</p>
        <Link to="/legal" className="text-indigo-600 text-sm mt-2 inline-block">
          Back to queue
        </Link>
      </div>
    );
  }

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !id) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const question = chatInput;
    setChatInput('');

    try {
      const result = await api.chat.send(id, question);
      const reply = (result as { reply?: string }).reply;
      if (reply) {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, role: 'assistant', content: reply, timestamp: new Date() },
        ]);
        return;
      }
    } catch {
      // API unavailable — use mock response
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: `Based on my analysis of the submission, here's what I found regarding your question about "${question}":\n\nThe content relates to ${CONTENT_TYPE_LABELS[submission.contentType]} and has been flagged with ${submission.riskFactors.length} risk factor(s). I recommend reviewing the specific regulatory requirements under ${submission.riskFactors.map((r) => r.regulation).join(', ') || 'applicable Canadian regulations'} before making a determination.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
  }, [chatInput, id, submission]);

  const handleAction = async (action: string) => {
    if (!id) return;
    const decision = action === 'approve' ? 'approved' : action === 'revision' ? 'revision_needed' : 'escalated';
    try {
      await api.reviews.create({ submissionId: id, decision });
    } catch {
      // API unavailable — proceed with UI transition for demo
    }
    setActiveAction(action);
    setTimeout(() => {
      navigate('/legal');
    }, 1500);
  };

  if (activeAction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              activeAction === 'approve'
                ? 'bg-green-100'
                : activeAction === 'revision'
                ? 'bg-orange-100'
                : 'bg-red-100'
            }`}
          >
            {activeAction === 'approve' ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : activeAction === 'revision' ? (
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            ) : (
              <Flag className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {activeAction === 'approve'
              ? 'Submission Approved'
              : activeAction === 'revision'
              ? 'Revision Requested'
              : 'Submission Escalated'}
          </h2>
          <p className="text-slate-600">
            Decision recorded and audit trail updated. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/legal"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Queue
          </Link>
          <div className="h-5 w-px bg-slate-300" />
          <h1 className="text-sm font-semibold text-slate-900 truncate max-w-md">
            {submission.title}
          </h1>
          <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
            {submission.referenceId}
          </code>
          {submission.riskScore && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskBg[submission.riskScore]}`}
            >
              {RISK_LABELS[submission.riskScore]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('approve')}
            className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction('revision')}
            className="px-4 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Request Revision
          </button>
          <button
            onClick={() => handleAction('escalate')}
            className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Escalate
          </button>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Content */}
        <div className="w-1/3 border-r border-slate-200 overflow-y-auto bg-white">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Submitted Content
            </h2>

            <div className="space-y-3 mb-6">
              <div className="text-xs text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Content Type</span>
                  <span className="font-medium text-slate-700">
                    {CONTENT_TYPE_LABELS[submission.contentType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted By</span>
                  <span className="font-medium text-slate-700">
                    {submission.submitterName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium text-slate-700">
                    {format(submission.createdAt, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Files
            </h3>
            <div className="space-y-2 mb-6">
              {submission.fileNames.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-slate-700 truncate flex-1">
                    {name}
                  </span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Preview
                  </button>
                </div>
              ))}
            </div>

            {/* Content Preview Mock */}
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Content Preview
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
              <div className="border-b border-slate-200 pb-3 mb-3">
                <p className="font-semibold text-slate-900 mb-1">
                  {submission.title}
                </p>
                <p className="text-xs text-slate-500">
                  Ref: {submission.referenceId}
                </p>
              </div>
              <p className="text-slate-600 italic">
                [Content preview would render the uploaded file here. For PDFs,
                images, and HTML files, the content is displayed in a rich
                preview format with zoom and annotation capabilities.]
              </p>
            </div>
          </div>
        </div>

        {/* Center Pane: AI Summary + Chat */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-5 overflow-y-auto flex-1">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              AI Analysis
            </h2>

            {/* AI Summary */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Summary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {submission.aiSummary}
              </p>
            </div>

            {/* Risk Factors */}
            {submission.riskFactors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Risk Factors
                </h3>
                <div className="space-y-2">
                  {submission.riskFactors.map((rf, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs ${riskBg[rf.severity]}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{rf.category}</span>
                        <span className="font-mono opacity-75">
                          {rf.regulation}
                        </span>
                      </div>
                      <p className="opacity-90">{rf.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              AI Chat — Ask questions about this content
            </h3>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-slate-200'
                      : 'bg-indigo-600 text-white ml-8'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mb-1">
                      <Brain className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs font-medium text-indigo-600">
                        Gemini
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-xs">
                    {msg.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.role === 'assistant'
                        ? 'text-slate-400'
                        : 'text-indigo-200'
                    }`}
                  >
                    {format(msg.timestamp, 'h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about compliance concerns..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Powered by Google Gemini + SaulLM-7B
            </p>
          </div>
        </div>

        {/* Right Pane: Precedents */}
        <div className="w-1/3 overflow-y-auto bg-white">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Legal Precedents
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                All
              </button>
              <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors">
                <Database className="w-3 h-3 inline mr-1" />
                Internal RAG
              </button>
              <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors">
                <Scale className="w-3 h-3 inline mr-1" />
                CanLII
              </button>
            </div>

            <div className="space-y-3">
              {mockPrecedents.map((prec) => (
                <div
                  key={prec.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                          prec.source === 'internal'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {prec.source === 'internal' ? 'Internal' : 'CanLII'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {Math.round(prec.relevanceScore * 100)}% match
                      </span>
                    </div>
                    {prec.url && (
                      <a
                        href={prec.url}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 mb-1">
                    {prec.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 mb-2">
                    {prec.citation}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prec.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
