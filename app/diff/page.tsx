'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import DiffEditor from '@/components/DiffEditor';
import DiffStats from '@/components/DiffStats';
import Toolbar from '@/components/Toolbar';
import FileUpload from '@/components/FileUpload';

export default function DiffPage() {
  const [uploadTarget, setUploadTarget] = useState<'original' | 'modified' | null>(null);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      <Navbar />

      {/* Toolbar */}
      <Toolbar onShowUpload={(side) => setUploadTarget(side)} />

      {/* Editor area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {uploadTarget ? (
          <FileUpload
            side={uploadTarget}
            onClose={() => setUploadTarget(null)}
          />
        ) : (
          <DiffEditor />
        )}
      </div>

      {/* Stats bar */}
      <DiffStats />
    </div>
  );
}
