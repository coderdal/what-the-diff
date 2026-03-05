'use client';

import { useMemo } from 'react';
import { Plus, Minus, RefreshCw, Equal } from 'lucide-react';
import { useDiffStore } from '@/lib/store';
import { computeDiff, computeStats } from '@/lib/diff-engine';

export default function DiffStats() {
  const { original, modified, options } = useDiffStore();

  const stats = useMemo(() => {
    if (!original && !modified) return null;
    const chunks = computeDiff(original, modified, options);
    return computeStats(chunks);
  }, [original, modified, options]);

  if (!stats) return null;

  return (
    <div className="stats-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="stat-add">
        <Plus size={13} />
        <span>{stats.additions}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>additions</span>
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="stat-remove">
        <Minus size={13} />
        <span>{stats.deletions}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>deletions</span>
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="stat-change">
        <RefreshCw size={12} />
        <span>{stats.totalChanges}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>changes</span>
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="stat-unchanged">
        <Equal size={12} />
        <span>{stats.unchanged}</span>
        <span style={{ fontSize: '11px' }}>unchanged</span>
      </div>

      {stats.totalChanges === 0 && (
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--diff-add-text)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          ✓ Files are identical
        </div>
      )}
    </div>
  );
}
