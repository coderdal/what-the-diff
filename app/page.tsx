import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  GitCompare,
  Zap,
  Lock,
  Code2,
  ArrowLeftRight,
  FileUp,
  Link as LinkIcon,
  ArrowRight,
  CheckCircle,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: 'Split & Unified View',
    desc: 'Toggle between side-by-side split view and a compact unified diff format instantly.',
    color: '#7c3aed',
  },
  {
    icon: Code2,
    title: 'Syntax Highlighting',
    desc: 'Auto-detects 24+ languages including JS, Python, Go, Rust, SQL, and more.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Real-time Diff',
    desc: 'Differences update instantly as you type. No need to hit "compare" button.',
    color: '#f59e0b',
  },
  {
    icon: Lock,
    title: '100% Private',
    desc: 'All diffing runs entirely in your browser. Nothing is ever sent to any server.',
    color: '#22c55e',
  },
  {
    icon: FileUp,
    title: 'File Upload',
    desc: 'Drag & drop any text or code file. Language is auto-detected from the extension.',
    color: '#ec4899',
  },
  {
    icon: LinkIcon,
    title: 'Shareable Links',
    desc: 'Share your diff with one click. The full state is encoded in the URL.',
    color: '#06b6d4',
  },
];

const SAMPLE_DIFF_LINES = [
  { type: 'unchanged', content: 'function greet(name) {' },
  { type: 'removed',   content: '  const message = "Hello, " + name;' },
  { type: 'added',     content: '  const message = `Hello, ${name}!`;' },
  { type: 'unchanged', content: '  console.log(message);' },
  { type: 'unchanged', content: '  return message;' },
  { type: 'unchanged', content: '}' },
  { type: 'added',     content: '' },
  { type: 'added',     content: 'function farewell(name) {' },
  { type: 'added',     content: '  return `Goodbye, ${name}!`;' },
  { type: 'added',     content: '}' },
];

export default function LandingPage() {
  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          textAlign: 'center',
          padding: '100px 24px 80px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(124, 58, 237, 0.12)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--brand-purple-light)',
            marginBottom: '32px',
          }}
        >
          <GitCompare size={13} />
          Free · Private · Fast
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          <span className="gradient-text">Compare.</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Diff. Merge.</span>
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}
        >
          The diff checker built for developers. Paste code, upload files, and instantly
          see every change — highlighted beautifully.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/diff" className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
            Start Diffing
            <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="btn btn-ghost"
            style={{ fontSize: '15px', padding: '12px 28px' }}
          >
            See how it works
          </a>
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            marginTop: '40px',
            flexWrap: 'wrap',
          }}
        >
          {['No sign-up required', '24+ languages', 'Works offline', 'Open source'].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}
            >
              <CheckCircle size={13} style={{ color: 'var(--diff-add-text)' }} />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Mini demo preview */}
      <section
        id="how-it-works"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Fake window chrome */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
            <span
              style={{
                marginLeft: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              greet.js — diff
            </span>
          </div>

          {/* Diff lines preview */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              lineHeight: '22px',
              padding: '16px 0',
            }}
          >
            {SAMPLE_DIFF_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  background:
                    line.type === 'added'
                      ? 'var(--diff-add-bg)'
                      : line.type === 'removed'
                      ? 'var(--diff-remove-bg)'
                      : 'transparent',
                  borderLeft:
                    line.type === 'added'
                      ? '3px solid var(--diff-add-border)'
                      : line.type === 'removed'
                      ? '3px solid var(--diff-remove-border)'
                      : '3px solid transparent',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    color:
                      line.type === 'added'
                        ? 'var(--diff-add-text)'
                        : line.type === 'removed'
                        ? 'var(--diff-remove-text)'
                        : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    userSelect: 'none',
                    flexShrink: 0,
                    lineHeight: '22px',
                  }}
                >
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                <span
                  style={{
                    padding: '0 16px',
                    color:
                      line.type === 'added'
                        ? 'var(--diff-add-text)'
                        : line.type === 'removed'
                        ? 'var(--diff-remove-text)'
                        : 'var(--text-primary)',
                    whiteSpace: 'pre',
                  }}
                >
                  {line.content}
                </span>
              </div>
            ))}
          </div>

          {/* Stats bar in preview */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '16px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <span style={{ color: 'var(--diff-add-text)' }}>+5 additions</span>
            <span style={{ color: 'var(--diff-remove-text)' }}>-1 deletion</span>
            <Link
              href="/diff"
              style={{
                marginLeft: 'auto',
                color: 'var(--brand-purple-light)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Try it yourself <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px 100px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '460px', margin: '0 auto' }}>
            Professional-grade diff tooling, right in your browser. No setup, no account, no limits.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="feature-card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: 'center',
          padding: '80px 24px 100px',
          background: 'linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.05))',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          Ready to diff?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '36px' }}>
          No login. No limits. Just paste and compare.
        </p>
        <Link href="/diff" className="btn btn-primary animate-pulse-glow" style={{ fontSize: '16px', padding: '14px 36px' }}>
          Open WhatTheDiff
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer / About Developer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '60px 24px 40px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.2))',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Developer Info */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Built by Muhammed Erdal
            </h3>
            <p style={{ marginBottom: '24px', lineHeight: 1.6, fontSize: '15px' }}>
              Feel free to connect with me!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a 
                href="https://github.com/coderdal/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px' }}
              >
                <Github size={18} />
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/muhammederdal/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px' }}
              >
                <Linkedin size={18} color="#3b82f6" />
                LinkedIn
              </a>
              <a 
                href="mailto:contact@erdal.net.tr" 
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px' }}
              >
                <Mail size={18} color="#22c55e" />
                Email
              </a>
            </div>
          </div>

          <div style={{ width: '40px', height: '2px', background: 'var(--border)', borderRadius: '2px' }}></div>

          {/* Copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <GitCompare size={14} style={{ color: 'var(--brand-purple-light)' }} />
            <span>WhatTheDiff © {new Date().getFullYear()} - Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
