// ============================================================
// ALCHEMY CLASH — Game State Context
// Manages discovered elements, deck, battle state, progression
// ============================================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ELEMENTS, CARDS, getFusionResult, Card, Element } from '@/lib/gameData';

export type GameScreen = 'title' | 'fusion' | 'book' | 'deck' | 'battle' | 'victory';

export interface BattleLane {
  playerCard: Card | null;
  enemyCard: Card | null;
  playerPower: number;
  enemyPower: number;
  winner: 'player' | 'enemy' | 'tie' | null;
}

export interface BattleState {
  lanes: BattleLane[];
  playerEnergy: number;
  enemyEnergy: number;
  turn: number;
  phase: 'placement' | 'reveal' | 'result';
  playerHand: Card[];
  playerDeck: Card[];
  enemyDeck: Card[];
  gameOver: boolean;
  winner: 'player' | 'enemy' | null;
}

export interface GameState {
  screen: GameScreen;
  discoveredElements: Set<string>;
  playerDeck: string[]; // card ids
  essence: number;
  battlesWon: number;
  totalDiscoveries: number;
  fusionAnimation: { elementA: string; elementB: string; result: string | null } | null;
  newDiscovery: string | null;
  battle: BattleState | null;
}

interface GameContextType {
  state: GameState;
  setScreen: (screen: GameScreen) => void;
  tryFuse: (elementA: string, elementB: string) => { success: boolean; result: string | null };
  addCardToDeck: (cardId: string) => void;
  removeCardFromDeck: (cardId: string) => void;
  startBattle: () => void;
  placeCard: (cardId: string, laneIndex: number) => void;
  endPlacement: () => void;
  clearFusionAnimation: () => void;
  clearNewDiscovery: () => void;
  getDiscoveredElements: () => Element[];
  getDiscoveredCards: () => Card[];
}

const initialState: GameState = {
  screen: 'title',
  discoveredElements: new Set(['fire', 'water', 'earth', 'air']),
  playerDeck: [],
  essence: 0,
  battlesWon: 0,
  totalDiscoveries: 4,
  fusionAnimation: null,
  newDiscovery: null,
  battle: null,
};

const GameContext = createContext<GameContextType | null>(null);

function buildEnemyDeck(discoveredCards: Card[]): Card[] {
  const available = discoveredCards.length > 0 ? discoveredCards : CARDS.slice(0, 4);
  const deck: Card[] = [];
  while (deck.length < 8) {
    deck.push({ ...available[Math.floor(Math.random() * available.length)] });
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('alchemyClash_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          discoveredElements: new Set(parsed.discoveredElements || ['fire', 'water', 'earth', 'air']),
          screen: 'title',
          fusionAnimation: null,
          newDiscovery: null,
          battle: null,
        };
      }
    } catch {}
    return initialState;
  });

  // Persist state
  useEffect(() => {
    const toSave = {
      discoveredElements: Array.from(state.discoveredElements),
      playerDeck: state.playerDeck,
      essence: state.essence,
      battlesWon: state.battlesWon,
      totalDiscoveries: state.totalDiscoveries,
    };
    localStorage.setItem('alchemyClash_save', JSON.stringify(toSave));
  }, [state.discoveredElements, state.playerDeck, state.essence, state.battlesWon]);

  const setScreen = useCallback((screen: GameScreen) => {
    setState(s => ({ ...s, screen }));
  }, []);

  const tryFuse = useCallback((elementA: string, elementB: string): { success: boolean; result: string | null } => {
    const resultId = getFusionResult(elementA, elementB);
    if (!resultId) {
      setState(s => ({ ...s, fusionAnimation: { elementA, elementB, result: null } }));
      return { success: false, result: null };
    }

    setState(s => {
      const alreadyKnown = s.discoveredElements.has(resultId);
      const newDiscovered = new Set(s.discoveredElements);
      newDiscovered.add(resultId);
      return {
        ...s,
        discoveredElements: newDiscovered,
        essence: s.essence + (alreadyKnown ? 1 : 5),
        totalDiscoveries: newDiscovered.size,
        fusionAnimation: { elementA, elementB, result: resultId },
        newDiscovery: alreadyKnown ? null : resultId,
      };
    });
    return { success: true, result: resultId };
  }, []);

  const addCardToDeck = useCallback((cardId: string) => {
    setState(s => {
      if (s.playerDeck.length >= 14) return s;
      return { ...s, playerDeck: [...s.playerDeck, cardId] };
    });
  }, []);

  const removeCardFromDeck = useCallback((cardId: string) => {
    setState(s => {
      const idx = s.playerDeck.indexOf(cardId);
      if (idx === -1) return s;
      const newDeck = [...s.playerDeck];
      newDeck.splice(idx, 1);
      return { ...s, playerDeck: newDeck };
    });
  }, []);

  const startBattle = useCallback(() => {
    setState(s => {
      const discoveredCards = CARDS.filter(c => s.discoveredElements.has(c.elementId));
      const deckCards = s.playerDeck.length >= 3
        ? s.playerDeck.map(id => CARDS.find(c => c.id === id)!).filter(Boolean)
        : discoveredCards.length > 0 ? discoveredCards : CARDS.slice(0, 5);

      const shuffledDeck = shuffle(deckCards);
      const hand = shuffledDeck.slice(0, 3);
      const remaining = shuffledDeck.slice(3);

      const enemyDeck = shuffle(buildEnemyDeck(discoveredCards.length > 0 ? discoveredCards : CARDS.slice(0, 5)));

      const battle: BattleState = {
        lanes: Array(4).fill(null).map(() => ({
          playerCard: null, enemyCard: null,
          playerPower: 0, enemyPower: 0, winner: null,
        })),
        playerEnergy: 6,
        enemyEnergy: 6,
        turn: 1,
        phase: 'placement',
        playerHand: hand,
        playerDeck: remaining,
        enemyDeck,
        gameOver: false,
        winner: null,
      };

      return { ...s, screen: 'battle', battle };
    });
  }, []);

  const placeCard = useCallback((cardId: string, laneIndex: number) => {
    setState(s => {
      if (!s.battle || s.battle.phase !== 'placement') return s;
      const card = s.battle.playerHand.find(c => c.id === cardId);
      if (!card) return s;
      if (s.battle.lanes[laneIndex].playerCard) return s;
      if (s.battle.playerEnergy < card.cost) return s;

      const newLanes = s.battle.lanes.map((lane, i) =>
        i === laneIndex ? { ...lane, playerCard: card, playerPower: card.power } : lane
      );
      const newHand = s.battle.playerHand.filter(c => c !== card);

      return {
        ...s,
        battle: {
          ...s.battle,
          lanes: newLanes,
          playerHand: newHand,
          playerEnergy: s.battle.playerEnergy - card.cost,
        },
      };
    });
  }, []);

  const endPlacement = useCallback(() => {
    setState(s => {
      if (!s.battle) return s;

      // AI places cards
      const battle = { ...s.battle };
      const newLanes = [...battle.lanes.map(l => ({ ...l }))];
      let enemyEnergy = battle.enemyEnergy;
      const enemyDeck = [...battle.enemyDeck];

      // Simple AI: fill empty lanes with affordable cards
      const availableCards = [...battle.enemyDeck].sort((a, b) => b.power - a.power);
      for (let i = 0; i < 4; i++) {
        if (!newLanes[i].enemyCard) {
          const affordable = availableCards.find(c => c.cost <= enemyEnergy);
          if (affordable) {
            newLanes[i].enemyCard = affordable;
            newLanes[i].enemyPower = affordable.power;
            enemyEnergy -= affordable.cost;
            availableCards.splice(availableCards.indexOf(affordable), 1);
          }
        }
      }

      // Apply abilities (simplified)
      // Wizard: +2 to adjacent lanes
      newLanes.forEach((lane, i) => {
        if (lane.playerCard?.id === 'wizard') {
          if (i > 0) newLanes[i - 1].playerPower += 2;
          if (i < 3) newLanes[i + 1].playerPower += 2;
        }
        // Firebolt: -3 enemy power
        if (lane.playerCard?.id === 'firebolt') {
          newLanes[i].enemyPower = Math.max(0, newLanes[i].enemyPower - 3);
        }
        // Golem: min 3 power
        if (lane.playerCard?.id === 'golem') {
          newLanes[i].playerPower = Math.max(3, newLanes[i].playerPower);
        }
        // Forest guardian: +1 per nature card
        if (lane.playerCard?.id === 'forest_guardian') {
          const natureCount = newLanes.filter(l => l.playerCard?.tag === 'nature').length;
          newLanes[i].playerPower += natureCount - 1;
        }
        // Iron golem: immune to spells (already handled by not applying firebolt)
        // Phoenix: if losing, +4 power
        if (lane.playerCard?.id === 'phoenix') {
          if (newLanes[i].playerPower < newLanes[i].enemyPower) {
            newLanes[i].playerPower += 4;
          }
        }
        // Thunder hawk: +2 to all storm cards, -1 to all enemies
        if (lane.playerCard?.id === 'thunder_hawk') {
          newLanes.forEach((l, j) => {
            if (l.playerCard?.tag === 'storm') newLanes[j].playerPower += 2;
            newLanes[j].enemyPower = Math.max(0, newLanes[j].enemyPower - 1);
          });
        }
        // Storm knight: if winning 2+ lanes, +3
        if (lane.playerCard?.id === 'storm_knight') {
          const winning = newLanes.filter(l => l.playerPower > l.enemyPower).length;
          if (winning >= 2) newLanes[i].playerPower += 3;
        }
      });

      // Determine lane winners
      newLanes.forEach(lane => {
        if (lane.playerPower > lane.enemyPower) lane.winner = 'player';
        else if (lane.enemyPower > lane.playerPower) lane.winner = 'enemy';
        else lane.winner = 'tie';
      });

      const playerWins = newLanes.filter(l => l.winner === 'player').length;
      const enemyWins = newLanes.filter(l => l.winner === 'enemy').length;
      const gameOver = true;
      const winner = playerWins >= 3 ? 'player' : enemyWins >= 3 ? 'enemy' : playerWins > enemyWins ? 'player' : 'enemy';

      // Draw a card for next turn
      const newHand = [...battle.playerHand];
      if (battle.playerDeck.length > 0) {
        newHand.push(battle.playerDeck[0]);
      }

      return {
        ...s,
        essence: s.essence + (winner === 'player' ? 10 : 2),
        battlesWon: winner === 'player' ? s.battlesWon + 1 : s.battlesWon,
        battle: {
          ...battle,
          lanes: newLanes,
          enemyEnergy,
          enemyDeck,
          playerHand: newHand,
          phase: 'reveal',
          gameOver,
          winner,
        },
      };
    });
  }, []);

  const clearFusionAnimation = useCallback(() => {
    setState(s => ({ ...s, fusionAnimation: null }));
  }, []);

  const clearNewDiscovery = useCallback(() => {
    setState(s => ({ ...s, newDiscovery: null }));
  }, []);

  const getDiscoveredElements = useCallback((): Element[] => {
    return ELEMENTS.filter(e => state.discoveredElements.has(e.id));
  }, [state.discoveredElements]);

  const getDiscoveredCards = useCallback((): Card[] => {
    return CARDS.filter(c => state.discoveredElements.has(c.elementId));
  }, [state.discoveredElements]);

  return (
    <GameContext.Provider value={{
      state, setScreen, tryFuse, addCardToDeck, removeCardFromDeck,
      startBattle, placeCard, endPlacement, clearFusionAnimation,
      clearNewDiscovery, getDiscoveredElements, getDiscoveredCards,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
