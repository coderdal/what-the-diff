'use client';

import { useEffect } from 'react';
import { Columns2, AlignLeft, Download, Trash2, Upload as UploadIcon, Code, ArrowUp, ArrowDown, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import { useDiffStore } from '@/lib/store';
import { SUPPORTED_LANGUAGES } from '@/lib/language-detect';
import { decodeState } from '@/lib/share';
import { buildUnifiedPatch } from '@/lib/diff-engine';
import DiffOptions from './DiffOptions';
import { ShareButton } from './Toast';

interface ToolbarProps {
  onShowUpload: (side: 'original' | 'modified') => void;
}

export default function Toolbar({ onShowUpload }: ToolbarProps) {
  const { language, viewMode, original, modified, setLanguage, setViewMode, clear } = useDiffStore();

  // Load shared context from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    if (state) {
      const decoded = decodeState(state);
      if (decoded) {
        useDiffStore.setState({
          original: decoded.original,
          modified: decoded.modified,
          language: decoded.language,
          hasResult: true,
        });
      }
    }
  }, []);

  const downloadPatch = () => {
    const patch = buildUnifiedPatch(original, modified);
    const blob = new Blob([patch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatthediff.diff';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="toolbar">
      {/* Language selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Code size={14} style={{ color: 'var(--text-secondary)' }} />
        <select
          id="language-select"
          className="select"
          style={{ width: '150px' }}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {SUPPORTED_LANGUAGES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="divider" />

      {/* View mode toggle */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '3px', border: '1px solid var(--border)' }}>
        <button
          id="split-view-btn"
          onClick={() => setViewMode('split')}
          className={`btn btn-ghost btn-sm ${viewMode === 'split' ? 'active' : ''}`}
          style={{ padding: '4px 10px', border: 'none' }}
        >
          <Columns2 size={14} />
          Split
        </button>
        <button
          id="unified-view-btn"
          onClick={() => setViewMode('unified')}
          className={`btn btn-ghost btn-sm ${viewMode === 'unified' ? 'active' : ''}`}
          style={{ padding: '4px 10px', border: 'none' }}
        >
          <AlignLeft size={14} />
          Unified
        </button>
      </div>

      <div className="divider" />

      {/* Diff Navigation */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('wtd-prev-diff'))}
          className="btn btn-ghost btn-sm"
          title="Previous Diff"
          disabled={viewMode === 'unified' || (!original && !modified)}
        >
          <ArrowUp size={14} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('wtd-next-diff'))}
          className="btn btn-ghost btn-sm"
          title="Next Diff"
          disabled={viewMode === 'unified' || (!original && !modified)}
        >
          <ArrowDown size={14} />
        </button>
      </div>

      <div className="divider" />

      {/* Merging */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('wtd-merge-left'))}
          className="btn btn-ghost btn-sm"
          title="Copy Modified to Original"
          disabled={!original && !modified}
        >
          <ArrowLeftToLine size={14} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('wtd-merge-right'))}
          className="btn btn-ghost btn-sm"
          title="Copy Original to Modified"
          disabled={!original && !modified}
        >
          <ArrowRightToLine size={14} />
        </button>
      </div>

      <div className="divider" />

      {/* Upload buttons */}
      <button
        id="upload-original-btn"
        onClick={() => onShowUpload('original')}
        className="btn btn-ghost btn-sm"
        title="Upload original file"
      >
        <UploadIcon size={13} />
        Upload Original
      </button>
      <button
        id="upload-modified-btn"
        onClick={() => onShowUpload('modified')}
        className="btn btn-ghost btn-sm"
        title="Upload modified file"
      >
        <UploadIcon size={13} />
        Upload Modified
      </button>

      <div className="divider" />

      {/* Options */}
      <DiffOptions />

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <ShareButton />

        <button
          id="download-btn"
          onClick={downloadPatch}
          className="btn btn-ghost btn-sm"
          title="Download as .diff patch file"
          disabled={!original && !modified}
        >
          <Download size={13} />
          Export
        </button>

        <button
          id="clear-btn"
          onClick={clear}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--diff-remove-text)' }}
          title="Clear both panes"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>
    </div>
  );
}
