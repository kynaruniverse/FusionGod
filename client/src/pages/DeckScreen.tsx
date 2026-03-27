// ============================================================
// ALCHEMY CLASH — Deck Builder Screen
// Design: Illuminated Manuscript + Soft Naturalism
// Build a 14-card deck from discovered cards
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { CARDS, ELEMENTS, RARITY_COLORS } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import NavBar from '@/components/NavBar';

const CARD_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/card-template-bg-AxCKUmDtzwWhDmcqjA3sGc.webp';

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
};

function getColor(id: string) {
  return ELEMENT_COLORS[id] || { bg: '#4a2c0a', glow: '#d4a843' };
}

export default function DeckScreen() {
  const { state, addCardToDeck, removeCardFromDeck, startBattle } = useGame();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const discoveredCards = CARDS.filter(c => state.discoveredElements.has(c.elementId));
  const deckCards = state.playerDeck.map(id => CARDS.find(c => c.id === id)).filter(Boolean) as typeof CARDS;

  const deckCount = state.playerDeck.length;
  const isInDeck = (id: string) => state.playerDeck.includes(id);
  const countInDeck = (id: string) => state.playerDeck.filter(x => x === id).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0800' }}>
      <NavBar />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Available cards */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8 0%, #e8d0a0 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{
                fontFamily: "'Cinzel', serif",
                color: '#2d1a06',
                letterSpacing: '0.08em',
              }}>
                🃏 Card Collection
              </h2>
              <p className="text-xs mt-0.5" style={{
                fontFamily: "'Lora', serif",
                color: '#6b4c1e',
                fontStyle: 'italic',
              }}>
                {discoveredCards.length} cards discovered — click to add to deck
              </p>
            </div>
          </div>

          {discoveredCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <span className="text-5xl opacity-30">🃏</span>
              <p style={{ fontFamily: "'Lora', serif", color: '#6b4c1e', fontStyle: 'italic', textAlign: 'center' }}>
                No cards discovered yet.<br />
                Combine advanced elements in the Fusion Workshop to unlock cards.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {discoveredCards.map(card => {
                const el = ELEMENTS.find(e => e.id === card.elementId);
                const c = getColor(card.elementId);
                const rarityColor = RARITY_COLORS[card.rarity];
                const inDeck = countInDeck(card.id);
                const isSelected = selectedCard === card.id;

                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      background: `url(${CARD_BG}) center/cover`,
                      border: isSelected
                        ? `2px solid ${rarityColor}`
                        : `1.5px solid ${rarityColor}55`,
                      boxShadow: isSelected
                        ? `0 0 20px ${c.glow}66, 0 4px 16px rgba(0,0,0,0.3)`
                        : `0 2px 8px rgba(0,0,0,0.2)`,
                    }}
                    onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  >
                    <div className="p-3" style={{ background: 'rgba(245,230,200,0.82)' }}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{el?.emoji}</span>
                        <div className="flex items-center gap-1">
                          {inDeck > 0 && (
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: 'rgba(212,168,67,0.9)',
                                color: '#1a0f00',
                                fontFamily: "'Cinzel', serif",
                                fontSize: '0.5rem',
                              }}
                            >
                              ×{inDeck}
                            </span>
                          )}
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: rarityColor + '22',
                              color: rarityColor,
                              border: `1px solid ${rarityColor}44`,
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.5rem',
                            }}
                          >
                            {card.rarity.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.72rem', color: '#2d1a06', fontWeight: 700, marginBottom: 2 }}>
                        {card.name}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-2 mb-1" style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '0.7rem', color: '#6b4c1e' }}>
                        <span title="Energy Cost">⚡ {card.cost}</span>
                        <span title="Power">⚔️ {card.power}</span>
                        <span style={{ color: c.bg, textTransform: 'capitalize' }}>{card.type}</span>
                      </div>

                      {/* Ability */}
                      <div style={{ fontFamily: "'Lora', serif", fontSize: '0.58rem', color: '#4a2c0a', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {card.abilityDescription}
                      </div>

                      {/* Add/Remove buttons */}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={e => { e.stopPropagation(); addCardToDeck(card.id); }}
                          disabled={deckCount >= 14}
                          className="flex-1 py-1 text-xs rounded transition-all"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: '0.55rem',
                            background: deckCount < 14 ? 'rgba(212,168,67,0.85)' : 'rgba(45,26,6,0.1)',
                            color: deckCount < 14 ? '#1a0f00' : '#a08060',
                            border: 'none',
                            letterSpacing: '0.05em',
                          }}
                        >
                          + Add
                        </button>
                        {inDeck > 0 && (
                          <button
                            onClick={e => { e.stopPropagation(); removeCardFromDeck(card.id); }}
                            className="flex-1 py-1 text-xs rounded transition-all"
                            style={{
                              fontFamily: "'Cinzel', serif",
                              fontSize: '0.55rem',
                              background: 'rgba(139,58,42,0.2)',
                              color: '#8b3a2a',
                              border: '1px solid rgba(139,58,42,0.3)',
                              letterSpacing: '0.05em',
                            }}
                          >
                            − Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Current deck */}
        <div
          className="md:w-64 flex flex-col"
          style={{
            background: 'rgba(20,10,0,0.92)',
            borderLeft: '1px solid rgba(212,168,67,0.2)',
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: 'rgba(212,168,67,0.2)' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: '#d4a843', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
              Your Deck
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,230,200,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(deckCount / 14) * 100}%`,
                    background: deckCount >= 14 ? '#d4a843' : 'rgba(212,168,67,0.6)',
                  }}
                />
              </div>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', color: 'rgba(212,168,67,0.7)' }}>
                {deckCount}/14
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
            {deckCards.length === 0 ? (
              <p style={{ fontFamily: "'Lora', serif", fontSize: '0.7rem', color: 'rgba(245,230,200,0.3)', fontStyle: 'italic', textAlign: 'center', marginTop: 16 }}>
                Your deck is empty.<br />Add cards from the left.
              </p>
            ) : (
              deckCards.map((card, i) => {
                const el = ELEMENTS.find(e => e.id === card.elementId);
                const rarityColor = RARITY_COLORS[card.rarity];
                return (
                  <motion.div
                    key={`${card.id}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded"
                    style={{
                      background: 'rgba(245,230,200,0.06)',
                      border: `1px solid ${rarityColor}33`,
                    }}
                  >
                    <span className="text-lg">{el?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: 'rgba(245,230,200,0.85)', fontWeight: 600 }}>
                        {card.name}
                      </div>
                      <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '0.6rem', color: 'rgba(212,168,67,0.6)' }}>
                        ⚡{card.cost} · ⚔️{card.power}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCardFromDeck(card.id)}
                      className="text-xs opacity-40 hover:opacity-80 transition-opacity"
                      style={{ color: '#f87171' }}
                    >
                      ×
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Battle button */}
          <div className="p-4 border-t" style={{ borderColor: 'rgba(212,168,67,0.2)' }}>
            <button
              onClick={startBattle}
              className="w-full py-3 font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                background: deckCount >= 3
                  ? 'linear-gradient(135deg, rgba(139,58,42,0.9), rgba(100,30,20,0.9))'
                  : 'rgba(245,230,200,0.08)',
                color: deckCount >= 3 ? 'rgba(245,200,180,0.95)' : 'rgba(245,230,200,0.25)',
                border: `1px solid ${deckCount >= 3 ? 'rgba(139,58,42,0.6)' : 'rgba(245,230,200,0.1)'}`,
                borderRadius: '4px',
                cursor: deckCount >= 3 ? 'pointer' : 'not-allowed',
              }}
            >
              ⚔️ Enter Battle
            </button>
            {deckCount < 3 && (
              <p className="text-center mt-1" style={{ fontFamily: "'Lora', serif", fontSize: '0.6rem', color: 'rgba(245,230,200,0.3)', fontStyle: 'italic' }}>
                Need at least 3 cards
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
