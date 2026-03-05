'use client';

import { useState } from 'react';
import { Settings, X, ChevronDown } from 'lucide-react';
import { useDiffStore, DiffGranularity } from '@/lib/store';

export default function DiffOptions() {
  const [open, setOpen] = useState(false);
  const { options, setOptions } = useDiffStore();

  const granularities: { value: DiffGranularity; label: string }[] = [
    { value: 'lines', label: 'Lines' },
    { value: 'words', label: 'Words' },
    { value: 'chars', label: 'Characters' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        id="diff-options-btn"
        onClick={() => setOpen((v) => !v)}
        className={`btn btn-ghost btn-sm ${open ? 'active' : ''}`}
        title="Diff options"
      >
        <Settings size={15} />
        Options
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>

      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            background: 'var(--bg-overlay)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            zIndex: 9999,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Diff Options</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}
              aria-label="Close options"
            >
              <X size={16} />
            </button>
          </div>

          {/* Granularity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Diff By
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {granularities.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setOptions({ granularity: value })}
                  className={`btn btn-ghost btn-sm ${options.granularity === value ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          {[
            { key: 'ignoreWhitespace', label: 'Ignore Whitespace' },
            { key: 'caseSensitive', label: 'Case Sensitive' },
            { key: 'collapseUnchanged', label: 'Collapse Unchanged' },
          ].map(({ key, label }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderTop: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options] as boolean}
                  onChange={(e) => setOptions({ [key]: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}

          {/* Context lines */}
          {options.collapseUnchanged && (
            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Context lines: {options.contextLines}
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={options.contextLines}
                onChange={(e) => setOptions({ contextLines: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--brand-purple)' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
