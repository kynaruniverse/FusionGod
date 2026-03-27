// ============================================================
// ALCHEMY CLASH — Alchemy Book Screen
// Design: Illuminated Manuscript + Soft Naturalism
// Parchment book with tabbed pages, ink illustrations
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { ELEMENTS, CARDS, ElementCategory } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import NavBar from '@/components/NavBar';

const BOOK_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/alchemy-book-cover-KP56ab5CaYiwaeEKXD59K3.webp';
const CARD_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/card-template-bg-AxCKUmDtzwWhDmcqjA3sGc.webp';

const CATEGORIES: { id: ElementCategory | 'cards'; label: string; icon: string }[] = [
  { id: 'base', label: 'Base Elements', icon: '🌍' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'materials', label: 'Materials', icon: '⚙️' },
  { id: 'life', label: 'Life', icon: '✨' },
  { id: 'magic', label: 'Magic', icon: '🌟' },
  { id: 'advanced', label: 'Advanced', icon: '🏆' },
  { id: 'cards', label: 'Cards', icon: '🃏' },
];

const ELEMENT_COLORS: Record<string, { bg: string; glow: string }> = {
  fire: { bg: '#c2410c', glow: '#ff6b2b' },
  water: { bg: '#1d4ed8', glow: '#60a5fa' },
  earth: { bg: '#78350f', glow: '#d97706' },
  air: { bg: '#64748b', glow: '#cbd5e1' },
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
};

const RARITY_COLORS = { common: '#78716c', uncommon: '#16a34a', rare: '#2563eb', legendary: '#d4a843' };

function getColor(id: string) {
  return ELEMENT_COLORS[id] || { bg: '#4a2c0a', glow: '#d4a843' };
}

export default function BookScreen() {
  const { state } = useGame();
  const [activePage, setActivePage] = useState<ElementCategory | 'cards'>('base');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const discovered = state.discoveredElements;

  const pageElements = activePage === 'cards'
    ? []
    : ELEMENTS.filter(e => e.category === activePage);

  const pageCards = activePage === 'cards'
    ? CARDS.filter(c => discovered.has(c.elementId))
    : [];

  const discoveredOnPage = activePage === 'cards'
    ? pageCards.length
    : pageElements.filter(e => discovered.has(e.id)).length;

  const totalOnPage = activePage === 'cards'
    ? CARDS.length
    : pageElements.length;

  const selectedEl = selectedElement ? ELEMENTS.find(e => e.id === selectedElement) : null;
  const selectedCard = selectedElement ? CARDS.find(c => c.id === selectedElement) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0800' }}>
      <NavBar />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Book cover / tabs */}
        <div
          className="md:w-48 flex md:flex-col items-center md:items-stretch gap-1 p-3 overflow-x-auto md:overflow-y-auto"
          style={{
            background: 'rgba(20,10,0,0.85)',
            borderRight: '1px solid rgba(212,168,67,0.2)',
          }}
        >
          {/* Book cover thumbnail */}
          <div
            className="hidden md:block w-full h-32 rounded mb-3 bg-cover bg-center"
            style={{ backgroundImage: `url(${BOOK_BG})`, opacity: 0.8 }}
          />

          <h3 className="hidden md:block text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{
            fontFamily: "'Cinzel', serif",
            color: 'rgba(212,168,67,0.6)',
          }}>
            Chapters
          </h3>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActivePage(cat.id); setSelectedElement(null); }}
              className="flex items-center gap-2 px-3 py-2 rounded text-left transition-all whitespace-nowrap md:whitespace-normal"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.65rem',
                letterSpacing: '0.05em',
                background: activePage === cat.id ? 'rgba(212,168,67,0.15)' : 'transparent',
                color: activePage === cat.id ? '#d4a843' : 'rgba(245,230,200,0.5)',
                border: activePage === cat.id ? '1px solid rgba(212,168,67,0.3)' : '1px solid transparent',
                borderRadius: '4px',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Page content */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8 0%, #e8d0a0 100%)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"), linear-gradient(135deg, #f5e6c8 0%, #e8d0a0 100%)`,
          }}
        >
          {/* Page header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{
                fontFamily: "'Cinzel', serif",
                color: '#2d1a06',
                letterSpacing: '0.08em',
              }}>
                {CATEGORIES.find(c => c.id === activePage)?.icon} {CATEGORIES.find(c => c.id === activePage)?.label}
              </h2>
              <p className="text-xs mt-0.5" style={{
                fontFamily: "'Lora', serif",
                color: '#6b4c1e',
                fontStyle: 'italic',
              }}>
                {discoveredOnPage} of {totalOnPage} discovered
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(45,26,6,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalOnPage > 0 ? (discoveredOnPage / totalOnPage) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, #d4a843, #f5c842)',
                }}
              />
            </div>
          </div>

          <div
            className="w-full h-px mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(45,26,6,0.3), transparent)' }}
          />

          {/* Element grid */}
          {activePage !== 'cards' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {pageElements.map(el => {
                const isDiscovered = discovered.has(el.id);
                const c = getColor(el.id);
                return (
                  <motion.button
                    key={el.id}
                    onClick={() => setSelectedElement(selectedElement === el.id ? null : el.id)}
                    whileHover={isDiscovered ? { scale: 1.05 } : {}}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all"
                    style={{
                      background: selectedElement === el.id ? 'rgba(212,168,67,0.15)' : 'rgba(245,230,200,0.5)',
                      border: selectedElement === el.id
                        ? '1.5px solid rgba(212,168,67,0.6)'
                        : '1.5px solid rgba(45,26,6,0.15)',
                      opacity: isDiscovered ? 1 : 0.4,
                      cursor: isDiscovered ? 'pointer' : 'default',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{
                        background: isDiscovered
                          ? `radial-gradient(circle at 35% 35%, ${c.glow}55, ${c.bg})`
                          : 'rgba(45,26,6,0.1)',
                        border: isDiscovered ? `1.5px solid ${c.glow}55` : '1.5px solid rgba(45,26,6,0.1)',
                        filter: isDiscovered ? 'none' : 'grayscale(1)',
                      }}
                    >
                      {isDiscovered ? el.emoji : '?'}
                    </div>
                    <span
                      className="text-center leading-tight"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.55rem',
                        color: isDiscovered ? '#2d1a06' : '#a08060',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {isDiscovered ? el.name : '???'}
                    </span>
                    {el.isCard && isDiscovered && (
                      <span className="text-xs" title="This element is a battle card!">🃏</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Cards grid */}
          {activePage === 'cards' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CARDS.map(card => {
                const isDiscovered = discovered.has(card.elementId);
                const el = ELEMENTS.find(e => e.id === card.elementId);
                const c = getColor(card.elementId);
                const rarityColor = RARITY_COLORS[card.rarity];
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => isDiscovered && setSelectedElement(selectedElement === card.id ? null : card.id)}
                    whileHover={isDiscovered ? { scale: 1.03, y: -2 } : {}}
                    className="relative rounded-lg overflow-hidden text-left"
                    style={{
                      background: isDiscovered ? `url(${CARD_BG}) center/cover` : 'rgba(45,26,6,0.1)',
                      border: selectedElement === card.id
                        ? `2px solid ${rarityColor}`
                        : `1.5px solid ${isDiscovered ? rarityColor + '66' : 'rgba(45,26,6,0.1)'}`,
                      opacity: isDiscovered ? 1 : 0.35,
                      cursor: isDiscovered ? 'pointer' : 'default',
                      minHeight: 120,
                      boxShadow: isDiscovered ? `0 4px 16px ${c.glow}33` : 'none',
                    }}
                  >
                    {isDiscovered ? (
                      <div className="p-3 flex flex-col gap-1" style={{ background: 'rgba(245,230,200,0.75)' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{el?.emoji}</span>
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: rarityColor + '22',
                              color: rarityColor,
                              border: `1px solid ${rarityColor}44`,
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.5rem',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {card.rarity.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', color: '#2d1a06', fontWeight: 700 }}>
                          {card.name}
                        </div>
                        <div className="flex gap-2 text-xs" style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: '#6b4c1e' }}>
                          <span>⚡ {card.cost}</span>
                          <span>⚔️ {card.power}</span>
                          <span style={{ color: c.bg, textTransform: 'capitalize' }}>{card.type}</span>
                        </div>
                        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', color: '#4a2c0a', fontStyle: 'italic', lineHeight: 1.4 }}>
                          {card.abilityDescription}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 flex flex-col items-center justify-center h-full gap-2">
                        <span className="text-3xl opacity-20">?</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', color: '#a08060' }}>
                          Undiscovered
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Selected element detail panel */}
          <AnimatePresence>
            {selectedElement && (selectedEl || selectedCard) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(245,230,200,0.85)',
                  border: '1.5px solid rgba(212,168,67,0.4)',
                  boxShadow: '0 4px 20px rgba(45,26,6,0.15)',
                }}
              >
                {selectedEl && activePage !== 'cards' && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                      style={{
                        background: `radial-gradient(circle, ${getColor(selectedEl.id).glow}55, ${getColor(selectedEl.id).bg})`,
                        border: `2px solid ${getColor(selectedEl.id).glow}66`,
                        boxShadow: `0 0 16px ${getColor(selectedEl.id).glow}44`,
                      }}
                    >
                      {selectedEl.emoji}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#2d1a06', fontWeight: 700 }}>
                        {selectedEl.name}
                      </h3>
                      <p style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', color: '#6b4c1e', fontStyle: 'italic' }}>
                        Tier {selectedEl.tier} · {selectedEl.category} · {selectedEl.tag}
                      </p>
                      {selectedEl.isCard && (
                        <p style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: '#7e22ce', marginTop: 4 }}>
                          🃏 This element manifests as a battle card
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {selectedCard && activePage === 'cards' && (
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#2d1a06', fontWeight: 700 }}>
                      {selectedCard.name}
                    </h3>
                    <p style={{ fontFamily: "'Lora', serif", fontSize: '0.75rem', color: '#6b4c1e', fontStyle: 'italic', marginTop: 4 }}>
                      {selectedCard.flavorText}
                    </p>
                    <div className="mt-2 p-2 rounded" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
                      <p style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: '#4a2c0a' }}>
                        <strong>Ability:</strong> {selectedCard.abilityDescription}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
