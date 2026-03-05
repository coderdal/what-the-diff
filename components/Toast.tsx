'use client';

import { useState, useEffect } from 'react';
import { Check, Link, Copy } from 'lucide-react';
import { useDiffStore } from '@/lib/store';
import { encodeState } from '@/lib/share';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onDone: () => void;
}

export function Toast({ message, type = 'success', onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="toast animate-fade-in"
      style={{
        borderColor: type === 'success' ? 'var(--diff-add-border)' : 'var(--diff-remove-border)',
        color: type === 'success' ? 'var(--diff-add-text)' : 'var(--diff-remove-text)',
      }}
    >
      {type === 'success' ? <Check size={14} /> : null}
      {message}
    </div>
  );
}

export function ShareButton() {
  const { original, modified, language } = useDiffStore();
  const [toast, setToast] = useState<string | null>(null);

  const share = () => {
    const encoded = encodeState({ original, modified, language });
    const url = `${window.location.origin}/diff?state=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast('Share link copied!');
    }).catch(() => {
      setToast('Failed to copy link');
    });
  };

  return (
    <>
      <button
        id="share-btn"
        onClick={share}
        className="btn btn-ghost btn-sm"
        title="Copy shareable link"
      >
        <Link size={15} />
        Share
      </button>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button onClick={copy} className="btn btn-ghost btn-sm" title="Copy to clipboard">
      {copied ? <Check size={13} style={{ color: 'var(--diff-add-text)' }} /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
