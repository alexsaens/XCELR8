import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Clock,
  Brain,
  FileSearch,
  ArrowRight,
  CheckCircle2,
  Scale,
  BarChart3,
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              XCELR8
            </span>
          </div>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-6">
              <Shield className="w-4 h-4" />
              Built for Canadian Financial Services
            </div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              AI-Powered Marketing &amp; Legal Compliance,{' '}
              <span className="text-indigo-600">Accelerated</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              XCELR8 eliminates the bottleneck between marketing and legal
              teams. Submit content, get AI-powered risk assessment, and receive
              legal approval — all from one unified platform.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="px-6 py-3 text-slate-700 font-medium hover:text-indigo-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50%', label: 'Faster Review Turnaround' },
            { value: '85%+', label: 'AI Risk Assessment Accuracy' },
            { value: '100%', label: 'Audit Trail Coverage' },
            { value: '1-2 days', label: 'Avg. Approval Time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Everything You Need for Compliant Marketing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From content submission to legal approval, XCELR8 streamlines every
            step with AI-powered intelligence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'Dual AI Risk Assessment',
              description:
                'Google Gemini handles content parsing and summarization, while SaulLM-7B provides specialized legal risk scoring against Canadian regulations.',
            },
            {
              icon: FileSearch,
              title: 'Smart Precedent Search',
              description:
                'Automatically surfaces relevant internal decisions and CanLII case law. Build institutional knowledge that improves over time.',
            },
            {
              icon: Clock,
              title: 'Real-Time Status Tracking',
              description:
                'Track every submission from upload to approval. No more lost emails or Slack messages — everything in one place.',
            },
            {
              icon: Shield,
              title: 'Complete Audit Trail',
              description:
                'Every action is logged and traceable. Meet regulatory record-keeping requirements with immutable audit history.',
            },
            {
              icon: Scale,
              title: 'Three-Pane Legal Dashboard',
              description:
                'Review content, AI analysis, and legal precedents side-by-side. Make informed decisions faster with all context at your fingertips.',
            },
            {
              icon: BarChart3,
              title: 'Analytics & Insights',
              description:
                'Track review turnaround times, approval rates, and AI accuracy. Identify bottlenecks and optimize your compliance workflow.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Regulatory */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Built for Canadian Regulatory Compliance
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                XCELR8 is purpose-built for the Canadian financial services
                regulatory landscape, with AI models trained on the frameworks
                that matter to your organization.
              </p>
              <ul className="space-y-3">
                {[
                  'PIPEDA — Personal Information Protection',
                  'OSFI Guidelines — Financial Institution Advertising',
                  'Provincial Securities Regulations',
                  'Ad Standards Canada — Advertising Code',
                  'CASL — Anti-Spam Legislation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ol className="space-y-4">
                {[
                  'Marketing submits content via drag-and-drop upload',
                  'AI analyzes content, extracts IDs, and assesses risk',
                  'Legal reviews with AI summary, chat, and precedents',
                  'Approve, request revisions, or escalate — fully audited',
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Ready to Accelerate Your Compliance Workflow?
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Join financial services teams who have cut their legal review time in
          half with AI-powered compliance.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-lg"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">XCELR8</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; 2026 XCELR8. All rights reserved. Built for Canadian
            Financial Services.
          </p>
        </div>
      </footer>
    </div>
  );
}
