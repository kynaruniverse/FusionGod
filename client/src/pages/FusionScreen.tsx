// ============================================================
// ALCHEMY CLASH — Fusion Screen
// Design: Illuminated Manuscript + Soft Naturalism
// Click or drag elements to combine them
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { ELEMENTS, getElementById, getFusionResult } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import NavBar from '@/components/NavBar';

const WORKSPACE_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/fusion-workspace-bg-jxyv6QLf5QKdRiJjm5VYfd.webp';

const ELEMENT_COLORS: Record<string, { bg: string; glow: string; text: string }> = {
  fire:    { bg: '#c2410c', glow: '#ff6b2b', text: '#fff' },
  water:   { bg: '#1d4ed8', glow: '#60a5fa', text: '#fff' },
  earth:   { bg: '#78350f', glow: '#d97706', text: '#fff' },
  air:     { bg: '#64748b', glow: '#cbd5e1', text: '#fff' },
  steam:   { bg: '#94a3b8', glow: '#e2e8f0', text: '#1e293b' },
  mud:     { bg: '#713f12', glow: '#a16207', text: '#fff' },
  dust:    { bg: '#a8a29e', glow: '#d6d3d1', text: '#1c1917' },
  lava:    { bg: '#991b1b', glow: '#ef4444', text: '#fff' },
  storm:   { bg: '#3730a3', glow: '#818cf8', text: '#fff' },
  plant:   { bg: '#15803d', glow: '#4ade80', text: '#fff' },
  lightning: { bg: '#a16207', glow: '#fbbf24', text: '#fff' },
  ice:     { bg: '#0e7490', glow: '#67e8f9', text: '#fff' },
  sand:    { bg: '#b45309', glow: '#fcd34d', text: '#fff' },
  smoke:   { bg: '#374151', glow: '#9ca3af', text: '#fff' },
  stone:   { bg: '#57534e', glow: '#a8a29e', text: '#fff' },
  metal:   { bg: '#3f3f46', glow: '#a1a1aa', text: '#fff' },
  glass:   { bg: '#0891b2', glow: '#a5f3fc', text: '#fff' },
  wood:    { bg: '#92400e', glow: '#d97706', text: '#fff' },
  ash:     { bg: '#1c1917', glow: '#78716c', text: '#fff' },
  crystal: { bg: '#6d28d9', glow: '#c4b5fd', text: '#fff' },
  life:    { bg: '#059669', glow: '#6ee7b7', text: '#fff' },
  seed:    { bg: '#65a30d', glow: '#bef264', text: '#fff' },
  beast:   { bg: '#b45309', glow: '#fbbf24', text: '#fff' },
  human:   { bg: '#c2410c', glow: '#fb923c', text: '#fff' },
  spirit:  { bg: '#7c3aed', glow: '#ddd6fe', text: '#fff' },
  magic:   { bg: '#7e22ce', glow: '#e879f9', text: '#fff' },
  rune:    { bg: '#4338ca', glow: '#a5b4fc', text: '#fff' },
  potion:  { bg: '#be185d', glow: '#f9a8d4', text: '#fff' },
  energy_core: { bg: '#b45309', glow: '#fde047', text: '#fff' },
  wizard:  { bg: '#6b21a8', glow: '#d8b4fe', text: '#fff' },
  golem:   { bg: '#44403c', glow: '#a8a29e', text: '#fff' },
  firebolt: { bg: '#c2410c', glow: '#fbbf24', text: '#fff' },
  storm_knight: { bg: '#312e81', glow: '#818cf8', text: '#fff' },
  forest_guardian: { bg: '#14532d', glow: '#86efac', text: '#fff' },
  sea_serpent: { bg: '#134e4a', glow: '#5eead4', text: '#fff' },
  phoenix: { bg: '#991b1b', glow: '#fca5a5', text: '#fff' },
  crystal_mage: { bg: '#5b21b6', glow: '#c4b5fd', text: '#fff' },
  iron_golem: { bg: '#1f2937', glow: '#9ca3af', text: '#fff' },
  thunder_hawk: { bg: '#78350f', glow: '#fde047', text: '#fff' },
};

function getColor(id: string) {
  return ELEMENT_COLORS[id] || { bg: '#4a2c0a', glow: '#d4a843', text: '#fff' };
}

type FusionState = 'idle' | 'fusing' | 'success' | 'fail';

export default function FusionScreen() {
  const { state, tryFuse, clearFusionAnimation, clearNewDiscovery, getDiscoveredElements } = useGame();
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [fusionState, setFusionState] = useState<FusionState>('idle');
  const [resultId, setResultId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [clickTarget, setClickTarget] = useState<'A' | 'B' | null>(null);
  const fusionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const discoveredElements = getDiscoveredElements();

  const handleDragStart = useCallback((id: string) => {
    setDragging(id);
  }, []);

  const handleDropOnSlot = useCallback((slot: 'A' | 'B') => {
    if (!dragging) return;
    if (slot === 'A') setSlotA(dragging);
    else setSlotB(dragging);
    setDragging(null);
  }, [dragging]);

  const handleElementClick = useCallback((id: string) => {
    if (fusionState !== 'idle') return;
    // If clicking on slot A, clear it
    if (slotA === id && clickTarget === null) {
      setSlotA(null);
      return;
    }
    // Fill slots in order
    if (!slotA) {
      setSlotA(id);
    } else if (!slotB) {
      setSlotB(id);
    } else {
      // Replace slot A, shift A→B
      setSlotA(slotB);
      setSlotB(id);
    }
  }, [fusionState, slotA, slotB, clickTarget]);

  const handleFuse = useCallback(() => {
    if (!slotA || !slotB || fusionState !== 'idle') return;
    setFusionState('fusing');

    if (fusionTimeout.current) clearTimeout(fusionTimeout.current);
    fusionTimeout.current = setTimeout(() => {
      const wouldBeNew = !state.discoveredElements.has(getFusionResult(slotA, slotB) || '');
      const { success, result } = tryFuse(slotA, slotB);
      setResultId(result);
      setIsNew(wouldBeNew && success);
      setFusionState(success ? 'success' : 'fail');

      fusionTimeout.current = setTimeout(() => {
        setFusionState('idle');
        setSlotA(null);
        setSlotB(null);
        setResultId(null);
        clearFusionAnimation();
        clearNewDiscovery();
      }, 2400);
    }, 600);
  }, [slotA, slotB, fusionState, tryFuse, state.discoveredElements, clearFusionAnimation, clearNewDiscovery]);

  const resultElement = resultId ? getElementById(resultId) : null;
  const slotAEl = slotA ? getElementById(slotA) : null;
  const slotBEl = slotB ? getElementById(slotB) : null;

  // Preview result
  const previewResult = slotA && slotB && fusionState === 'idle'
    ? getFusionResult(slotA, slotB)
    : null;
  const previewEl = previewResult ? getElementById(previewResult) : null;

  // Category grouping for display
  const categories = ['base', 'nature', 'materials', 'life', 'magic', 'advanced'] as const;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a0f00' }}>
      <NavBar />

      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: `url(${WORKSPACE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(26,15,0,0.4)' }} />

        <div className="relative z-10 flex flex-col items-center pt-4 pb-4 px-4 min-h-full">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-0.5" style={{
            fontFamily: "'Cinzel', serif",
            color: '#d4a843',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            letterSpacing: '0.1em',
          }}>
            Fusion Workshop
          </h2>
          <p className="text-xs mb-4" style={{
            fontFamily: "'Lora', serif",
            color: 'rgba(245,230,200,0.55)',
            fontStyle: 'italic',
          }}>
            Click elements to select them, or drag them into the circles
          </p>

          {/* Fusion area */}
          <div
            className="flex items-center gap-3 mb-4 px-6 py-4 rounded-xl"
            style={{
              background: 'rgba(26,15,0,0.65)',
              border: '1px solid rgba(212,168,67,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* Slot A */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDropOnSlot('A')}
              onClick={() => { if (slotA) setSlotA(null); }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200 cursor-pointer"
              style={{
                background: slotAEl
                  ? `radial-gradient(circle at 35% 35%, ${getColor(slotAEl.id).glow}55, ${getColor(slotAEl.id).bg})`
                  : 'rgba(245,230,200,0.06)',
                border: `2px dashed ${slotAEl ? getColor(slotAEl.id).glow + '88' : 'rgba(212,168,67,0.35)'}`,
                boxShadow: slotAEl ? `0 0 20px ${getColor(slotAEl.id).glow}44` : 'none',
              }}
              title={slotAEl ? `${slotAEl.name} (click to clear)` : 'Slot A — click or drag an element here'}
            >
              {slotAEl
                ? <span style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>{slotAEl.emoji}</span>
                : <span style={{ color: 'rgba(212,168,67,0.25)', fontSize: '1.5rem' }}>A</span>
              }
            </div>

            {/* Center: fuse button + preview */}
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <AnimatePresence mode="wait">
                {fusionState === 'fusing' && (
                  <motion.div key="fusing"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-3xl"
                  >✨</motion.div>
                )}

                {fusionState === 'success' && resultElement && (
                  <motion.div key="success"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        background: `radial-gradient(circle, ${getColor(resultElement.id).glow}66, ${getColor(resultElement.id).bg})`,
                        boxShadow: `0 0 30px ${getColor(resultElement.id).glow}88`,
                        border: `2px solid ${getColor(resultElement.id).glow}`,
                      }}
                    >
                      {resultElement.emoji}
                    </div>
                    {isNew && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          background: 'rgba(212,168,67,0.9)',
                          color: '#1a0f00',
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.5rem',
                          letterSpacing: '0.1em',
                        }}
                      >
                        ✦ NEW!
                      </motion.span>
                    )}
                    <span className="text-xs" style={{ color: 'rgba(245,230,200,0.8)', fontFamily: "'Cinzel', serif", fontSize: '0.6rem' }}>
                      {resultElement.name}
                    </span>
                  </motion.div>
                )}

                {fusionState === 'fail' && (
                  <motion.div key="fail"
                    initial={{ scale: 1 }}
                    animate={{ x: [-5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-2xl">💨</span>
                    <span style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', color: 'rgba(245,230,200,0.5)', fontStyle: 'italic' }}>
                      No reaction
                    </span>
                  </motion.div>
                )}

                {fusionState === 'idle' && (
                  <motion.div key="idle" className="flex flex-col items-center gap-2">
                    {/* Preview hint */}
                    {previewEl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl opacity-60"
                          style={{
                            background: `radial-gradient(circle, ${getColor(previewEl.id).glow}44, ${getColor(previewEl.id).bg}88)`,
                            border: `1.5px dashed ${getColor(previewEl.id).glow}55`,
                          }}
                        >
                          {previewEl.emoji}
                        </div>
                        <span style={{ fontFamily: "'Lora', serif", fontSize: '0.55rem', color: 'rgba(212,168,67,0.5)', fontStyle: 'italic' }}>
                          {!state.discoveredElements.has(previewEl.id) ? '?' : previewEl.name}
                        </span>
                      </motion.div>
                    )}

                    <motion.button
                      onClick={handleFuse}
                      disabled={!slotA || !slotB}
                      whileHover={slotA && slotB ? { scale: 1.1 } : {}}
                      whileTap={slotA && slotB ? { scale: 0.95 } : {}}
                      className="px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        background: slotA && slotB
                          ? 'linear-gradient(135deg, rgba(212,168,67,0.9), rgba(180,130,40,0.9))'
                          : 'rgba(245,230,200,0.08)',
                        color: slotA && slotB ? '#1a0f00' : 'rgba(245,230,200,0.25)',
                        border: `1px solid ${slotA && slotB ? 'rgba(212,168,67,0.6)' : 'rgba(245,230,200,0.1)'}`,
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        cursor: slotA && slotB ? 'pointer' : 'not-allowed',
                      }}
                    >
                      ⚗️ Fuse
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slot B */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDropOnSlot('B')}
              onClick={() => { if (slotB) setSlotB(null); }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200 cursor-pointer"
              style={{
                background: slotBEl
                  ? `radial-gradient(circle at 35% 35%, ${getColor(slotBEl.id).glow}55, ${getColor(slotBEl.id).bg})`
                  : 'rgba(245,230,200,0.06)',
                border: `2px dashed ${slotBEl ? getColor(slotBEl.id).glow + '88' : 'rgba(212,168,67,0.35)'}`,
                boxShadow: slotBEl ? `0 0 20px ${getColor(slotBEl.id).glow}44` : 'none',
              }}
              title={slotBEl ? `${slotBEl.name} (click to clear)` : 'Slot B — click or drag an element here'}
            >
              {slotBEl
                ? <span style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>{slotBEl.emoji}</span>
                : <span style={{ color: 'rgba(212,168,67,0.25)', fontSize: '1.5rem' }}>B</span>
              }
            </div>
          </div>

          {/* Hint */}
          <p className="text-xs mb-3" style={{
            color: 'rgba(245,230,200,0.35)',
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
          }}>
            {!slotA && !slotB ? 'Click any element below to select it for fusion' :
             slotA && !slotB ? `${slotAEl?.name} selected — pick a second element` :
             slotA && slotB ? `Ready! Press Fuse to combine ${slotAEl?.name} + ${slotBEl?.name}` : ''}
          </p>

          {/* Element grid */}
          <div
            className="w-full max-w-2xl rounded-xl p-4 overflow-y-auto"
            style={{
              background: 'rgba(20,10,0,0.7)',
              border: '1px solid rgba(212,168,67,0.2)',
              backdropFilter: 'blur(6px)',
              maxHeight: '45vh',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{
                fontFamily: "'Cinzel', serif",
                color: 'rgba(212,168,67,0.7)',
              }}>
                Discovered Elements ({discoveredElements.length}/{ELEMENTS.length})
              </h3>
              <span style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '0.65rem', color: 'rgba(212,168,67,0.5)' }}>
                ✨ {state.essence} essence
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5">
              {discoveredElements.map(el => {
                const c = getColor(el.id);
                const isInSlot = slotA === el.id || slotB === el.id;
                return (
                  <motion.button
                    key={el.id}
                    draggable
                    onDragStart={() => handleDragStart(el.id)}
                    onClick={() => handleElementClick(el.id)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.93 }}
                    className="flex flex-col items-center gap-1 select-none"
                    title={el.name}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-all"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${c.glow}55, ${c.bg})`,
                        border: isInSlot
                          ? `2px solid ${c.glow}`
                          : `1.5px solid ${c.glow}55`,
                        boxShadow: isInSlot
                          ? `0 0 16px ${c.glow}88, 0 4px 12px ${c.bg}88`
                          : `0 3px 8px ${c.bg}66`,
                        outline: isInSlot ? `2px solid ${c.glow}44` : 'none',
                        outlineOffset: 2,
                      }}
                    >
                      {el.emoji}
                    </div>
                    <span className="text-center leading-tight" style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.52rem',
                      color: isInSlot ? '#d4a843' : 'rgba(245,230,200,0.7)',
                      letterSpacing: '0.03em',
                    }}>
                      {el.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Discovery count */}
          <div className="mt-3 flex gap-4 text-xs" style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            color: 'rgba(212,168,67,0.5)',
          }}>
            <span>🔥 {discoveredElements.filter(e => e.tier === 1).length} tier-1</span>
            <span>⚗️ {discoveredElements.filter(e => e.tier === 2).length} tier-2</span>
            <span>🏆 {discoveredElements.filter(e => e.tier === 3).length} advanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
