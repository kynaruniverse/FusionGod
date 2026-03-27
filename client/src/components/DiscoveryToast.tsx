// ============================================================
// ALCHEMY CLASH — Discovery Toast
// Shows animated notification when a new element is discovered
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getElementById } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const ELEMENT_COLORS: Record<string, { bg: string; glow: string }> = {
  wizard: { bg: '#6b21a8', glow: '#d8b4fe' },
  golem: { bg: '#44403c', glow: '#a8a29e' },
  firebolt: { bg: '#c2410c', glow: '#fbbf24' },
  storm_knight: { bg: '#312e81', glow: '#818cf8' },
  forest_guardian: { bg: '#14532d', glow: '#86efac' },
  sea_serpent: { bg: '#134e4a', glow: '#5eead4' },
  phoenix: { bg: '#991b1b', glow: '#fca5a5' },
  crystal_mage: { bg: '#5b21b6', glow: '#c4b5fd' },
  iron_golem: { bg: '#1f2937', glow: '#9ca3af' },
  thunder_hawk: { bg: '#78350f', glow: '#fde047' },
  steam: { bg: '#94a3b8', glow: '#e2e8f0' },
  mud: { bg: '#713f12', glow: '#a16207' },
  lava: { bg: '#991b1b', glow: '#ef4444' },
  storm: { bg: '#3730a3', glow: '#818cf8' },
  plant: { bg: '#15803d', glow: '#4ade80' },
  lightning: { bg: '#a16207', glow: '#fbbf24' },
  ice: { bg: '#0e7490', glow: '#67e8f9' },
  sand: { bg: '#b45309', glow: '#fcd34d' },
  smoke: { bg: '#374151', glow: '#9ca3af' },
  dust: { bg: '#a8a29e', glow: '#d6d3d1' },
  stone: { bg: '#57534e', glow: '#a8a29e' },
  metal: { bg: '#3f3f46', glow: '#a1a1aa' },
  glass: { bg: '#0891b2', glow: '#a5f3fc' },
  wood: { bg: '#92400e', glow: '#d97706' },
  ash: { bg: '#1c1917', glow: '#78716c' },
  crystal: { bg: '#6d28d9', glow: '#c4b5fd' },
  life: { bg: '#059669', glow: '#6ee7b7' },
  seed: { bg: '#65a30d', glow: '#bef264' },
  beast: { bg: '#b45309', glow: '#fbbf24' },
  human: { bg: '#c2410c', glow: '#fb923c' },
  spirit: { bg: '#7c3aed', glow: '#ddd6fe' },
  magic: { bg: '#7e22ce', glow: '#e879f9' },
  rune: { bg: '#4338ca', glow: '#a5b4fc' },
  potion: { bg: '#be185d', glow: '#f9a8d4' },
  energy_core: { bg: '#b45309', glow: '#fde047' },
};

function getColor(id: string) {
  return ELEMENT_COLORS[id] || { bg: '#4a2c0a', glow: '#d4a843' };
}

export default function DiscoveryToast() {
  const { state, clearNewDiscovery } = useGame();
  const [visible, setVisible] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState<string | null>(null);

  useEffect(() => {
    if (state.newDiscovery) {
      setCurrentDiscovery(state.newDiscovery);
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        clearNewDiscovery();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state.newDiscovery, clearNewDiscovery]);

  const el = currentDiscovery ? getElementById(currentDiscovery) : null;
  if (!el) return null;

  const c = getColor(el.id);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-16 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            transform: 'translateX(-50%)',
            background: 'rgba(20,10,0,0.92)',
            border: `1.5px solid ${c.glow}66`,
            boxShadow: `0 0 30px ${c.glow}44, 0 8px 24px rgba(0,0,0,0.4)`,
            backdropFilter: 'blur(8px)',
            minWidth: 220,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `radial-gradient(circle, ${c.glow}55, ${c.bg})`,
              border: `1.5px solid ${c.glow}`,
              boxShadow: `0 0 12px ${c.glow}66`,
            }}
          >
            {el.emoji}
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: '#d4a843', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              ✦ New Discovery!
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: 'rgba(245,230,200,0.95)', fontWeight: 700 }}>
              {el.name}
            </div>
            {el.isCard && (
              <div style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', color: 'rgba(212,168,67,0.7)', fontStyle: 'italic' }}>
                🃏 Battle card unlocked!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
