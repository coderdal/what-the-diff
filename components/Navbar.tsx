'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitCompare, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            background: 'var(--brand-gradient)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GitCompare size={18} color="white" />
        </div>
        <span
          style={{
            fontSize: '17px',
            fontWeight: 700,
            background: 'var(--brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          WhatTheDiff
        </span>
      </Link>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {pathname !== '/diff' && (
          <Link
            href="/diff"
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '7px 14px' }}
          >
            <ExternalLink size={13} />
            Open Diff
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
