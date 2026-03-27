// ============================================================
// ALCHEMY CLASH — Battle Screen
// Design: Illuminated Manuscript + Soft Naturalism
// 4-lane parchment board, card placement, reveal phase
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { CARDS, ELEMENTS, RARITY_COLORS } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';

const BATTLE_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663485321204/Nyy6frn7XRmy8DiFi7oMc9/battle-arena-bg-C2KamkzQRZVzEycSY5WN7k.webp';
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

function BattleCard({ card, isEnemy, revealed, winner }: {
  card: typeof CARDS[0] | null;
  isEnemy: boolean;
  revealed: boolean;
  winner: 'player' | 'enemy' | 'tie' | null;
}) {
  const el = card ? ELEMENTS.find(e => e.id === card.elementId) : null;
  const c = card ? getColor(card.elementId) : null;
  const rarityColor = card ? RARITY_COLORS[card.rarity] : undefined;

  if (!card) {
    return (
      <div
        className="w-full h-full rounded-lg flex items-center justify-center"
        style={{
          background: 'rgba(245,230,200,0.06)',
          border: '1.5px dashed rgba(212,168,67,0.2)',
          minHeight: 90,
        }}
      >
        <span style={{ color: 'rgba(212,168,67,0.2)', fontSize: '1.2rem' }}>
          {isEnemy ? '?' : '+'}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={revealed ? { rotateY: 90, opacity: 0 } : {}}
      animate={revealed ? { rotateY: 0, opacity: 1 } : {}}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full h-full rounded-lg overflow-hidden relative"
      style={{
        background: `url(${CARD_BG}) center/cover`,
        border: `1.5px solid ${rarityColor}66`,
        boxShadow: winner === (isEnemy ? 'enemy' : 'player')
          ? `0 0 20px ${c?.glow}88, 0 0 40px ${c?.glow}44`
          : winner === 'tie' ? '0 0 10px rgba(212,168,67,0.4)' : 'none',
        minHeight: 90,
      }}
    >
      <div
        className="absolute inset-0 flex flex-col p-2 gap-0.5"
        style={{ background: 'rgba(245,230,200,0.82)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl">{el?.emoji}</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', color: rarityColor, letterSpacing: '0.06em' }}>
            {card.rarity.toUpperCase()}
          </span>
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', color: '#2d1a06', fontWeight: 700, lineHeight: 1.2 }}>
          {card.name}
        </div>
        <div className="flex gap-1.5" style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '0.65rem', color: '#6b4c1e' }}>
          <span>⚡{card.cost}</span>
          <span>⚔️{card.power}</span>
        </div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.52rem', color: '#4a2c0a', fontStyle: 'italic', lineHeight: 1.3 }}>
          {card.abilityDescription}
        </div>
      </div>
    </motion.div>
  );
}

function HandCard({ card, onPlay, disabled }: {
  card: typeof CARDS[0];
  onPlay: () => void;
  disabled: boolean;
}) {
  const el = ELEMENTS.find(e => e.id === card.elementId);
  const c = getColor(card.elementId);
  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.06, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onPlay}
      disabled={disabled}
      className="relative rounded-lg overflow-hidden flex-shrink-0"
      style={{
        width: 72,
        background: `url(${CARD_BG}) center/cover`,
        border: `1.5px solid ${rarityColor}66`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="p-1.5" style={{ background: 'rgba(245,230,200,0.82)' }}>
        <div className="text-lg text-center">{el?.emoji}</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', color: '#2d1a06', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
          {card.name}
        </div>
        <div className="flex justify-center gap-1" style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '0.55rem', color: '#6b4c1e' }}>
          <span>⚡{card.cost}</span>
          <span>⚔️{card.power}</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function BattleScreen() {
  const { state, setScreen, startBattle, placeCard, endPlacement } = useGame();
  const [selectedHandCard, setSelectedHandCard] = useState<string | null>(null);
  const [revealDone, setRevealDone] = useState(false);

  useEffect(() => {
    if (!state.battle) {
      startBattle();
    }
  }, []);

  useEffect(() => {
    if (state.battle?.phase === 'reveal') {
      const t = setTimeout(() => setRevealDone(true), 1200);
      return () => clearTimeout(t);
    }
    setRevealDone(false);
  }, [state.battle?.phase]);

  if (!state.battle) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0f0800' }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div style={{ color: 'rgba(245,230,200,0.5)', fontFamily: "'Cinzel', serif" }}>
            Preparing battle...
          </div>
        </div>
      </div>
    );
  }

  const battle = state.battle;
  const isPlacement = battle.phase === 'placement';
  const isReveal = battle.phase === 'reveal';

  const handleLaneClick = (laneIndex: number) => {
    if (!isPlacement || !selectedHandCard) return;
    if (battle.lanes[laneIndex].playerCard) return;
    placeCard(selectedHandCard, laneIndex);
    setSelectedHandCard(null);
  };

  const handleHandCardClick = (cardId: string) => {
    if (!isPlacement) return;
    setSelectedHandCard(prev => prev === cardId ? null : cardId);
  };

  const playerWins = battle.lanes.filter(l => l.winner === 'player').length;
  const enemyWins = battle.lanes.filter(l => l.winner === 'enemy').length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0800' }}>
      <NavBar />

      {/* Arena */}
      <div
        className="flex-1 relative overflow-hidden flex flex-col"
        style={{
          backgroundImage: `url(${BATTLE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(10,5,0,0.5)' }} />

        <div className="relative z-10 flex flex-col h-full p-3 gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div style={{ fontFamily: "'Cinzel', serif", color: '#d4a843', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              ⚔️ BATTLE — Turn {battle.turn}
            </div>
            <div className="flex gap-4 text-xs" style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: 'rgba(245,230,200,0.7)' }}>
              <span>Enemy ⚡ {battle.enemyEnergy}</span>
              <span>You ⚡ {battle.playerEnergy}</span>
            </div>
          </div>

          {/* Phase indicator */}
          <div className="text-center">
            <span
              className="px-3 py-1 rounded text-xs uppercase tracking-widest"
              style={{
                fontFamily: "'Cinzel', serif",
                background: isPlacement ? 'rgba(212,168,67,0.15)' : 'rgba(139,58,42,0.2)',
                color: isPlacement ? '#d4a843' : '#f87171',
                border: `1px solid ${isPlacement ? 'rgba(212,168,67,0.3)' : 'rgba(248,113,113,0.3)'}`,
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
              }}
            >
              {isPlacement ? '📍 Placement Phase' : isReveal ? '✨ Reveal Phase' : '🏆 Result'}
            </span>
          </div>

          {/* Enemy side label */}
          <div className="text-center" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: 'rgba(248,113,113,0.6)', letterSpacing: '0.1em' }}>
            — ENEMY —
          </div>

          {/* Lanes */}
          <div className="flex gap-2 flex-1">
            {battle.lanes.map((lane, i) => {
              const laneWinner = lane.winner;
              const isSelected = selectedHandCard !== null && !lane.playerCard && isPlacement;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col gap-2"
                >
                  {/* Lane label */}
                  <div className="text-center" style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.55rem',
                    color: 'rgba(212,168,67,0.4)',
                    letterSpacing: '0.1em',
                  }}>
                    Lane {i + 1}
                  </div>

                  {/* Enemy card */}
                  <div className="flex-1">
                    {isReveal || !isPlacement ? (
                      <BattleCard
                        card={lane.enemyCard}
                        isEnemy={true}
                        revealed={isReveal}
                        winner={laneWinner}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(139,58,42,0.1)',
                          border: '1.5px dashed rgba(248,113,113,0.2)',
                          minHeight: 90,
                        }}
                      >
                        <span style={{ color: 'rgba(248,113,113,0.3)', fontSize: '1.2rem' }}>?</span>
                      </div>
                    )}
                  </div>

                  {/* Lane result */}
                  <AnimatePresence>
                    {isReveal && laneWinner && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-1 rounded"
                        style={{
                          background: laneWinner === 'player'
                            ? 'rgba(212,168,67,0.2)'
                            : laneWinner === 'enemy'
                            ? 'rgba(248,113,113,0.15)'
                            : 'rgba(245,230,200,0.1)',
                          border: `1px solid ${laneWinner === 'player' ? 'rgba(212,168,67,0.4)' : laneWinner === 'enemy' ? 'rgba(248,113,113,0.3)' : 'rgba(245,230,200,0.2)'}`,
                        }}
                      >
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.08em',
                          color: laneWinner === 'player' ? '#d4a843' : laneWinner === 'enemy' ? '#f87171' : 'rgba(245,230,200,0.6)' }}>
                          {laneWinner === 'player' ? `⚔️ ${lane.playerPower}` : laneWinner === 'enemy' ? `🗡️ ${lane.enemyPower}` : '— TIE —'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Center divider */}
                  <div className="h-px" style={{ background: 'rgba(212,168,67,0.2)' }} />

                  {/* Player card */}
                  <div
                    className="flex-1 cursor-pointer transition-all"
                    onClick={() => handleLaneClick(i)}
                    style={{
                      outline: isSelected ? '2px solid rgba(212,168,67,0.6)' : 'none',
                      outlineOffset: 2,
                      borderRadius: 8,
                    }}
                  >
                    {lane.playerCard ? (
                      <BattleCard
                        card={lane.playerCard}
                        isEnemy={false}
                        revealed={isReveal}
                        winner={laneWinner}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: isSelected ? 'rgba(212,168,67,0.12)' : 'rgba(245,230,200,0.06)',
                          border: isSelected ? '1.5px dashed rgba(212,168,67,0.6)' : '1.5px dashed rgba(212,168,67,0.2)',
                          minHeight: 90,
                        }}
                      >
                        <span style={{ color: isSelected ? 'rgba(212,168,67,0.7)' : 'rgba(212,168,67,0.2)', fontSize: '1.2rem' }}>
                          {isSelected ? '▼' : '+'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Player side label */}
          <div className="text-center" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: 'rgba(212,168,67,0.6)', letterSpacing: '0.1em' }}>
            — YOU —
          </div>

          {/* Hand */}
          {isPlacement && (
            <div>
              <div className="text-xs mb-2" style={{
                fontFamily: "'Cinzel', serif",
                color: 'rgba(212,168,67,0.5)',
                letterSpacing: '0.08em',
                fontSize: '0.6rem',
              }}>
                Your Hand — click a card, then click a lane to place it
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {battle.playerHand.map((card, i) => (
                  <div
                    key={`${card.id}-${i}`}
                    onClick={() => handleHandCardClick(card.id)}
                    style={{
                      outline: selectedHandCard === card.id ? '2px solid rgba(212,168,67,0.8)' : 'none',
                      outlineOffset: 2,
                      borderRadius: 8,
                    }}
                  >
                    <HandCard
                      card={card}
                      onPlay={() => {}}
                      disabled={battle.playerEnergy < card.cost}
                    />
                  </div>
                ))}
                {battle.playerHand.length === 0 && (
                  <p style={{ fontFamily: "'Lora', serif", fontSize: '0.65rem', color: 'rgba(245,230,200,0.3)', fontStyle: 'italic' }}>
                    No cards in hand
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {isPlacement && (
              <button
                onClick={endPlacement}
                className="flex-1 py-2.5 font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  background: 'linear-gradient(135deg, rgba(139,58,42,0.9), rgba(100,30,20,0.9))',
                  color: 'rgba(245,200,180,0.95)',
                  border: '1px solid rgba(139,58,42,0.6)',
                  borderRadius: '4px',
                }}
              >
                ⚔️ End Turn — Reveal
              </button>
            )}

            {isReveal && revealDone && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col gap-2"
                >
                  {/* Result banner */}
                  <div
                    className="py-3 rounded text-center"
                    style={{
                      background: battle.winner === 'player'
                        ? 'rgba(212,168,67,0.2)'
                        : 'rgba(139,58,42,0.2)',
                      border: `1px solid ${battle.winner === 'player' ? 'rgba(212,168,67,0.5)' : 'rgba(139,58,42,0.5)'}`,
                    }}
                  >
                    <div style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1rem',
                      color: battle.winner === 'player' ? '#d4a843' : '#f87171',
                      letterSpacing: '0.1em',
                    }}>
                      {battle.winner === 'player' ? '🏆 Victory!' : '💀 Defeat'}
                    </div>
                    <div style={{
                      fontFamily: "'Lora', serif",
                      fontSize: '0.7rem',
                      color: 'rgba(245,230,200,0.6)',
                      fontStyle: 'italic',
                      marginTop: 2,
                    }}>
                      {playerWins} lanes won · {enemyWins} lanes lost
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={startBattle}
                      className="flex-1 py-2 font-semibold uppercase tracking-wider transition-all hover:scale-105"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        background: 'linear-gradient(135deg, rgba(212,168,67,0.9), rgba(180,130,40,0.9))',
                        color: '#1a0f00',
                        border: '1px solid rgba(212,168,67,0.6)',
                        borderRadius: '4px',
                      }}
                    >
                      ⚔️ Battle Again
                    </button>
                    <button
                      onClick={() => setScreen('fusion')}
                      className="flex-1 py-2 font-semibold uppercase tracking-wider transition-all hover:scale-105"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        background: 'rgba(245,230,200,0.08)',
                        color: 'rgba(245,230,200,0.7)',
                        border: '1px solid rgba(245,230,200,0.2)',
                        borderRadius: '4px',
                      }}
                    >
                      ⚗️ Fuse More
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
