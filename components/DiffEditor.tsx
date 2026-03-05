'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { editor as MonacoEditorType } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { useDiffStore } from '@/lib/store';
import { computeDiff } from '@/lib/diff-engine';
import { ArrowLeftToLine, X } from 'lucide-react';

// Dynamically import Monaco
const MonacoDiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => ({ default: mod.DiffEditor })),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        gap: '10px',
        height: '100%',
      }}
    >
      <span
        style={{
          width: '18px',
          height: '18px',
          border: '2px solid var(--brand-purple)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      Loading editor…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ---------- Unified view ---------- */
function UnifiedView() {
  const { original, modified, options } = useDiffStore();

  const chunks = useMemo(
    () => computeDiff(original, modified, { ...options, granularity: 'lines' }),
    [original, modified, options]
  );

  return (
    <div className="unified-diff" style={{ flex: 1, overflowY: 'auto', margin: '0', borderRadius: 0, border: 'none' }}>
      {chunks.map((chunk, i) => {
        const lines = chunk.value.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();
        return lines.map((line, j) => (
          <div
            key={`${i}-${j}`}
            className={`unified-diff-line ${chunk.added ? 'diff-line-added' : chunk.removed ? 'diff-line-removed' : ''}`}
          >
            <div
              className="diff-line-gutter"
              style={{
                color: chunk.added
                  ? 'var(--diff-add-text)'
                  : chunk.removed
                  ? 'var(--diff-remove-text)'
                  : 'var(--text-muted)',
              }}
            >
              {chunk.added ? '+' : chunk.removed ? '-' : ' '}
            </div>
            <div className="diff-content">{line}</div>
          </div>
        ));
      })}
    </div>
  );
}

/* ---------- Main DiffEditor ---------- */
export default function DiffEditor() {
  const { original, modified, language, viewMode, options, setOriginal, setModified } = useDiffStore();
  const monacoRef = useRef<Monaco | null>(null);
  const diffEditorRef = useRef<MonacoEditorType.IStandaloneDiffEditor | null>(null);

  const [changes, setChanges] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [activeChangeIndex, setActiveChangeIndex] = useState<number>(-1);
  const [scrollTop, setScrollTop] = useState(0);
  const [widgetTop, setWidgetTop] = useState(-1000);

  const [editorOriginal, setEditorOriginal] = useState(original);
  const [editorModified, setEditorModified] = useState(modified);

  useEffect(() => {
    if (!diffEditorRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditorOriginal(original);
      return;
    }
    const model = diffEditorRef.current.getModel()?.original;
    if (model && model.getValue() !== original) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditorOriginal(original);
    }
  }, [original]);

  useEffect(() => {
    if (!diffEditorRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditorModified(modified);
      return;
    }
    const model = diffEditorRef.current.getModel()?.modified;
    if (model && model.getValue() !== modified) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditorModified(modified);
    }
  }, [modified]);

  const applyTheme = (monaco: Monaco) => {
    const savedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('wtd-theme') : null;
    monaco.editor.setTheme(savedTheme === 'light' ? 'wtd-light' : 'wtd-dark');
  };

  const handleEditorMount = (
    _editor: MonacoEditorType.IStandaloneDiffEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco;
    diffEditorRef.current = _editor;

    monaco.editor.defineTheme('wtd-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#111118',
        'editor.lineHighlightBackground': '#191925',
        'diffEditor.insertedTextBackground': '#22c55e18',
        'diffEditor.removedTextBackground': '#ef444418',
        'diffEditor.insertedLineBackground': '#22c55e10',
        'diffEditor.removedLineBackground': '#ef444410',
        'editorGutter.background': '#0e0e18',
      },
    });

    monaco.editor.defineTheme('wtd-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f0f0f8',
        'diffEditor.insertedTextBackground': '#22c55e20',
        'diffEditor.removedTextBackground': '#ef444420',
        'diffEditor.insertedLineBackground': '#22c55e10',
        'diffEditor.removedLineBackground': '#ef444410',
        'editorGutter.background': '#f8f8fc',
      },
    });

    applyTheme(monaco);

    // Listen to changes on both original and modified models
    const originalModel = _editor.getModel()?.original;
    const modifiedModel = _editor.getModel()?.modified;

    if (originalModel) {
      originalModel.onDidChangeContent(() => {
        setOriginal(originalModel.getValue());
      });
    }

    if (modifiedModel) {
      modifiedModel.onDidChangeContent(() => {
        setModified(modifiedModel.getValue());
      });
    }

    _editor.onDidUpdateDiff(() => {
      const lineChanges = _editor.getLineChanges() || [];
      setChanges(lineChanges);
      setActiveChangeIndex(prev => {
        if (lineChanges.length === 0) return -1;
        if (prev >= lineChanges.length) return 0;
        return prev === -1 ? 0 : prev;
      });
    });

    _editor.getOriginalEditor().onDidScrollChange((e) => {
      setScrollTop(e.scrollTop);
    });
  };

  // Update Monaco theme when data-theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (monacoRef.current) {
        applyTheme(monacoRef.current);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const editorOptions: MonacoEditorType.IDiffEditorConstructionOptions = {
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    renderWhitespace: options.ignoreWhitespace ? 'none' : 'selection',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    renderSideBySide: viewMode === 'split',
    readOnly: viewMode === 'unified',
    originalEditable: viewMode === 'split',
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrollToChange = (change: any) => {
      if (!diffEditorRef.current) return;
      const editor = diffEditorRef.current.getModifiedEditor();
      const line = change.modifiedStartLineNumber || change.originalStartLineNumber || 1;
      editor.revealLineInCenter(line);
    };

    const handleNext = () => {
      if (changes.length === 0) return;
      const next = (activeChangeIndex + 1) % changes.length;
      setActiveChangeIndex(next);
      scrollToChange(changes[next]);
    };

    const handlePrev = () => {
      if (changes.length === 0) return;
      const next = activeChangeIndex - 1 < 0 ? changes.length - 1 : activeChangeIndex - 1;
      setActiveChangeIndex(next);
      scrollToChange(changes[next]);
    };

    const handleMergeAllLeft = () => setOriginal(modified);
    const handleMergeAllRight = () => setModified(original);

    window.addEventListener('wtd-next-diff', handleNext);
    window.addEventListener('wtd-prev-diff', handlePrev);
    window.addEventListener('wtd-merge-left', handleMergeAllLeft);
    window.addEventListener('wtd-merge-right', handleMergeAllRight);

    return () => {
      window.removeEventListener('wtd-next-diff', handleNext);
      window.removeEventListener('wtd-prev-diff', handlePrev);
      window.removeEventListener('wtd-merge-left', handleMergeAllLeft);
      window.removeEventListener('wtd-merge-right', handleMergeAllRight);
    };
  }, [changes, activeChangeIndex, modified, original, setOriginal, setModified]);

  const mergeLines = (lines: string[], start: number, end: number, newLines: string[]) => {
    const arr = [...lines];
    if (end === 0) {
      arr.splice(start, 0, ...newLines);
    } else {
      arr.splice(start - 1, end - start + 1, ...newLines);
    }
    return arr;
  };

  const handleInlineAction = (action: 'merge' | 'ignore') => {
    if (!changes[activeChangeIndex]) return;
    const change = changes[activeChangeIndex];
    const origLines = original.split('\n');
    const modLines = modified.split('\n');

    if (action === 'merge') {
      const newLines = change.modifiedEndLineNumber === 0 
        ? [] 
        : modLines.slice(change.modifiedStartLineNumber - 1, change.modifiedEndLineNumber);
      const newOrig = mergeLines(origLines, change.originalStartLineNumber, change.originalEndLineNumber, newLines);
      setOriginal(newOrig.join('\n'));
    } else {
      const newLines = change.originalEndLineNumber === 0 
        ? [] 
        : origLines.slice(change.originalStartLineNumber - 1, change.originalEndLineNumber);
      const newMod = mergeLines(modLines, change.modifiedStartLineNumber, change.modifiedEndLineNumber, newLines);
      setModified(newMod.join('\n'));
    }
  };

  useEffect(() => {
    if (diffEditorRef.current && changes[activeChangeIndex] && viewMode === 'split') {
      const editor = diffEditorRef.current.getModifiedEditor();
      const line = changes[activeChangeIndex].modifiedStartLineNumber || 1;
      // Ensure the widget doesn't clip at the top of the editor bounding box
      const topPos = editor.getTopForLineNumber(line) - scrollTop;
      setWidgetTop(Math.max(20, topPos));
    } else {
      setWidgetTop(-1000);
    }
  }, [changes, activeChangeIndex, viewMode, scrollTop]);

  if (viewMode === 'unified') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <UnifiedView />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <MonacoDiffEditor
        original={editorOriginal}
        modified={editorModified}
        language={language}
        onMount={handleEditorMount}
        options={editorOptions}
        height="100%"
        theme="wtd-dark"
      />
      
      {/* Inline Action Widget */}
      {viewMode === 'split' && changes.length > 0 && activeChangeIndex !== -1 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `${widgetTop}px`,
            transform: 'translate(-50%, -12px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            boxShadow: 'var(--shadow-md)',
            transition: 'top 0.1s ease-out',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginRight: '4px', fontWeight: 600 }}>
            {activeChangeIndex + 1}/{changes.length}
          </span>
          <button
            onClick={() => handleInlineAction('merge')}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 6px', color: 'var(--brand-purple-light)' }}
            title="Merge Left (Accept)"
          >
            <ArrowLeftToLine size={13} /> Merge
          </button>
          <div style={{ width: '1px', height: '12px', background: 'var(--border)', margin: '0 2px' }} />
          <button
            onClick={() => handleInlineAction('ignore')}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 6px', color: 'var(--diff-remove-text)' }}
            title="Ignore (Revert to Original)"
          >
            <X size={13} /> Ignore
          </button>
        </div>
      )}
    </div>
  );
}
