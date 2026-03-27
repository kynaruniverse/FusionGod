// ============================================================
// ALCHEMY CLASH — Title Screen
// Design: Illuminated Manuscript + Soft Naturalism
// Warm parchment hero, Cinzel title, animated particles
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/alchemy-hero-bg-fbv5NSHYwxEPjjcv55cZtK.webp';

function DustParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 3, height: 3,
        background: 'rgba(212,168,67,0.6)',
        animation: `dust-float ${3 + Math.random() * 4}s ease-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        ...style,
      }}
    />
  );
}

export default function TitleScreen() {
  const { setScreen, state } = useGame();
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${20 + Math.random() * 60}%`,
    }))
  );

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#1a1008' }}
    >
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          filter: 'brightness(0.45) saturate(1.2)',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,6,2,0.85) 100%)'
      }} />

      {/* Dust particles */}
      {particles.map(p => (
        <DustParticle key={p.id} style={{ left: p.left, top: p.top }} />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Ouroboros / emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-7xl select-none"
          style={{ filter: 'drop-shadow(0 0 20px rgba(212,168,67,0.8))' }}
        >
          ⚗️
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold tracking-widest uppercase"
            style={{
              fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
              color: '#d4a843',
              textShadow: '0 0 30px rgba(212,168,67,0.5), 0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.15em',
            }}
          >
            Alchemy
          </h1>
          <h1
            className="text-4xl md:text-6xl font-bold tracking-widest uppercase"
            style={{
              fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
              color: '#f5e6c8',
              textShadow: '0 0 20px rgba(245,230,200,0.3), 0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.2em',
            }}
          >
            Clash
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base md:text-lg max-w-md"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            color: 'rgba(245,230,200,0.7)',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
          }}
        >
          "Begin with nothing but raw elements… and through discovery, create life, magic, and power."
        </motion.p>

        {/* Stats row */}
        {state.totalDiscoveries > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-6 text-sm"
            style={{ fontFamily: "'Crimson Pro', 'Crimson Text', Georgia, serif", color: 'rgba(212,168,67,0.8)' }}
          >
            <span>⚗️ {state.totalDiscoveries} discovered</span>
            <span>⚔️ {state.battlesWon} battles won</span>
            <span>✨ {state.essence} essence</span>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <button
            onClick={() => setScreen('fusion')}
            className="relative px-8 py-4 text-lg font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'linear-gradient(135deg, rgba(212,168,67,0.9), rgba(180,130,40,0.9))',
              color: '#1a0f00',
              border: '1px solid rgba(212,168,67,0.6)',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(212,168,67,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              letterSpacing: '0.12em',
            }}
          >
            ⚗️ Begin Fusion
          </button>

          <button
            onClick={() => setScreen('book')}
            className="px-8 py-3 text-base tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'rgba(245,230,200,0.08)',
              color: 'rgba(245,230,200,0.85)',
              border: '1px solid rgba(245,230,200,0.25)',
              borderRadius: '4px',
              letterSpacing: '0.1em',
            }}
          >
            📖 Alchemy Book
          </button>

          <button
            onClick={() => setScreen('deck')}
            className="px-8 py-3 text-base tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'rgba(245,230,200,0.08)',
              color: 'rgba(245,230,200,0.85)',
              border: '1px solid rgba(245,230,200,0.25)',
              borderRadius: '4px',
              letterSpacing: '0.1em',
            }}
          >
            🃏 Deck Builder
          </button>

          <button
            onClick={() => setScreen('battle')}
            className="px-8 py-3 text-base tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Cinzel', serif",
              background: 'rgba(139,58,42,0.3)',
              color: 'rgba(245,200,180,0.9)',
              border: '1px solid rgba(139,58,42,0.5)',
              borderRadius: '4px',
              letterSpacing: '0.1em',
            }}
          >
            ⚔️ Enter Battle
          </button>
        </motion.div>
      </div>

      {/* Bottom ornament */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 text-center"
        style={{ color: 'rgba(212,168,67,0.5)', fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em' }}
      >
        ✦ ALCHEMY CLASH ✦
      </motion.div>
    </div>
  );
}
