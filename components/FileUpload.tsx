'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { detectLanguage } from '@/lib/language-detect';
import { useDiffStore } from '@/lib/store';

interface FileUploadProps {
  side: 'original' | 'modified';
  onClose: () => void;
}

export default function FileUpload({ side, onClose }: FileUploadProps) {
  const { setOriginal, setModified, setLanguage } = useDiffStore();
  const [loadedFile, setLoadedFile] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (!content) return;

        setLoadedFile(file.name);
        if (side === 'original') {
          setOriginal(content);
        } else {
          setModified(content);
        }

        const lang = detectLanguage(file.name);
        if (lang !== 'plaintext') {
          setLanguage(lang);
        }

        onClose();
      };
      reader.readAsText(file);
    },
    [side, setOriginal, setModified, setLanguage, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'text/*': [], 'application/json': [], 'application/xml': [] },
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-elevated)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Close upload"
      >
        <X size={18} />
      </button>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        style={{ width: '320px', padding: '40px 24px' }}
      >
        <input {...getInputProps()} id={`file-upload-${side}`} />
        <Upload size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
        <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
          {isDragActive ? 'Drop the file here' : 'Drag & drop a file'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          or <span style={{ color: 'var(--brand-purple-light)', cursor: 'pointer', fontWeight: 500 }}>browse files</span>
        </p>
        <p style={{ fontSize: '11px', marginTop: '8px', opacity: 0.5 }}>
          Text, code, JSON, XML files supported
        </p>
      </div>

      {loadedFile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--diff-add-text)',
            fontSize: '13px',
          }}
        >
          <FileText size={14} />
          {loadedFile} loaded!
        </div>
      )}
    </div>
  );
}
