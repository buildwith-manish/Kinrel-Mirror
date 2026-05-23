'use client';

import { useEffect, useState } from 'react';
import KinrelLogo from '@/components/brand/KinrelLogo';
import KinrelIcon from '@/components/brand/KinrelIcon';

// useSyncExternalStore-safe hydration fix
const emptySubscribe = () => () => {};
function useHasMounted() {
  return useState(false)[1] !== undefined || true;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#13141E',
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#13141E',
        color: '#F5F0EE',
        fontFamily: "var(--kinrel-font-body, 'DM Sans', sans-serif)",
      }}
    >
      {/* ── Hero Section ──────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          gap: '40px',
        }}
      >
        {/* Animated Logo */}
        <div style={{ animation: 'kinrel-fade-in 0.8s ease-out both' }}>
          <KinrelLogo
            size="xl"
            layout="vertical"
            showSubtitle
            animated
            palette="orange"
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '520px',
            animation: 'kinrel-slide-up 0.8s ease-out 0.3s both',
          }}
        >
          <h2
            style={{
              fontFamily: "var(--kinrel-font-display, 'Outfit', sans-serif)",
              fontSize: '20px',
              fontWeight: 700,
              color: '#F5F0EE',
              marginBottom: '8px',
              letterSpacing: '0.01em',
            }}
          >
            Your Family&apos;s Living Archive
          </h2>
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#C9B4A8',
              margin: 0,
            }}
          >
            Build interactive family trees in 14 Indian languages with
            AI-powered kinship naming, WhatsApp integration, and cultural
            sensitivity.
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'kinrel-slide-up 0.8s ease-out 0.5s both',
          }}
        >
          {[
            { label: 'Languages', value: '14', color: '#E8612A' },
            { label: 'Relationships', value: '46', color: '#F59240' },
            { label: 'Festivals', value: '8', color: '#4CAF7A' },
            { label: 'WCAG', value: 'AA', color: '#60A5FA' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '16px 20px',
                borderRadius: '14px',
                backgroundColor: '#191B2C',
                border: '1px solid rgba(255,255,255,0.10)',
                textAlign: 'center',
                boxShadow: `0 0 24px 0 rgba(232, 97, 42, 0.06)`,
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  fontFamily: "var(--kinrel-font-display, 'Outfit', sans-serif)",
                  color: stat.color,
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#8A7A72',
                  letterSpacing: '0.06em',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            width: '100%',
            animation: 'kinrel-slide-up 0.8s ease-out 0.7s both',
          }}
        >
          {[
            {
              title: 'Design System',
              pack: 'Pack 01',
              desc: 'Complete token system: colors, typography, spacing, elevation. Brand palette: Orange #E8612A with amber/ember accents.',
              icon: '🎨',
            },
            {
              title: 'Accessibility',
              pack: 'Pack 06',
              desc: 'WCAG 2.1 AA compliant. 14 Indian languages, keyboard navigation, cultural sensitivity, screen reader support.',
              icon: '♿',
            },
            {
              title: 'Brand & Motion',
              pack: 'Pack 12',
              desc: 'K-graph icon, Outfit/DM Sans fonts, ignite/heritage gradients, festival themes, ceremonial animations.',
              icon: '✨',
            },
          ].map((feature) => (
            <div
              key={feature.pack}
              style={{
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: '#191B2C',
                border: '1px solid rgba(255,255,255,0.10)',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 0 32px 0 rgba(232, 97, 42, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>{feature.icon}</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#E8612A',
                    fontFamily: "var(--kinrel-font-display, 'Outfit', sans-serif)",
                  }}
                >
                  {feature.pack} — {feature.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: '#C9B4A8',
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          style={{
            animation: 'kinrel-scale-in 0.6s ease-out 0.9s both',
          }}
        >
          <button
            style={{
              padding: '14px 32px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #E8612A 0%, #F59240 100%)',
              color: '#F5F0EE',
              fontFamily: "var(--kinrel-font-body, 'DM Sans', sans-serif)",
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              boxShadow: '0 0 32px 0 rgba(232, 97, 42, 0.28)',
              transition: 'transform 0.15s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow =
                '0 0 48px 0 rgba(232, 97, 42, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow =
                '0 0 32px 0 rgba(232, 97, 42, 0.28)';
            }}
          >
            Get Started
          </button>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <KinrelIcon size={20} palette="orange" />
          <span
            style={{
              fontFamily: "var(--kinrel-font-body, 'DM Sans', sans-serif)",
              fontSize: '12px',
              color: '#C9B4A8',
              letterSpacing: '0.26em',
            }}
          >
            by Daxelo
          </span>
        </div>
        <p
          style={{
            fontSize: '11px',
            color: '#8A7A72',
            margin: 0,
          }}
        >
          Built with ❤️ for Indian Families
        </p>
      </footer>
    </div>
  );
}
