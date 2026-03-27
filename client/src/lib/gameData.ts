// ============================================================
// ALCHEMY CLASH — Game Data
// All elements, fusion recipes, cards, and abilities
// ============================================================

export type ElementCategory = 'base' | 'nature' | 'materials' | 'life' | 'magic' | 'advanced';
export type ElementTag = 'fire' | 'water' | 'earth' | 'air' | 'life' | 'magic' | 'metal' | 'energy' | 'nature' | 'human' | 'storm' | 'construct';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type CardType = 'entity' | 'spell' | 'hybrid';
export type AbilityTrigger = 'on_reveal' | 'ongoing' | 'end_of_turn' | 'passive' | 'conditional';

export interface Element {
  id: string;
  name: string;
  emoji: string;
  category: ElementCategory;
  tag: ElementTag;
  color: string; // tailwind bg color class
  glowColor: string; // css color for glow
  tier: 1 | 2 | 3;
  isCard: boolean;
  discovered: boolean;
}

export interface FusionRecipe {
  ingredients: [string, string];
  result: string;
}

export interface Ability {
  trigger: AbilityTrigger;
  description: string;
  effect: (state: any) => any; // runtime effect
}

export interface Card {
  id: string;
  elementId: string;
  name: string;
  type: CardType;
  cost: number;
  power: number;
  rarity: Rarity;
  tag: ElementTag;
  abilityDescription: string;
  abilityTrigger: AbilityTrigger;
  flavorText: string;
}

// ── Base Elements (always discovered) ──────────────────────
export const ELEMENTS: Element[] = [
  // Tier 1 — Base
  { id: 'fire', name: 'Fire', emoji: '🔥', category: 'base', tag: 'fire', color: 'bg-orange-700', glowColor: '#c2410c', tier: 1, isCard: false, discovered: true },
  { id: 'water', name: 'Water', emoji: '💧', category: 'base', tag: 'water', color: 'bg-blue-600', glowColor: '#2563eb', tier: 1, isCard: false, discovered: true },
  { id: 'earth', name: 'Earth', emoji: '🪨', category: 'base', tag: 'earth', color: 'bg-amber-800', glowColor: '#92400e', tier: 1, isCard: false, discovered: true },
  { id: 'air', name: 'Air', emoji: '🌬️', category: 'base', tag: 'air', color: 'bg-sky-300', glowColor: '#7dd3fc', tier: 1, isCard: false, discovered: true },

  // Tier 1 — Nature
  { id: 'steam', name: 'Steam', emoji: '♨️', category: 'nature', tag: 'water', color: 'bg-slate-400', glowColor: '#94a3b8', tier: 1, isCard: false, discovered: false },
  { id: 'mud', name: 'Mud', emoji: '🟫', category: 'nature', tag: 'earth', color: 'bg-yellow-900', glowColor: '#78350f', tier: 1, isCard: false, discovered: false },
  { id: 'dust', name: 'Dust', emoji: '🌫️', category: 'nature', tag: 'earth', color: 'bg-stone-400', glowColor: '#a8a29e', tier: 1, isCard: false, discovered: false },
  { id: 'lava', name: 'Lava', emoji: '🌋', category: 'nature', tag: 'fire', color: 'bg-red-700', glowColor: '#b91c1c', tier: 1, isCard: false, discovered: false },
  { id: 'storm', name: 'Storm', emoji: '⛈️', category: 'nature', tag: 'storm', color: 'bg-indigo-600', glowColor: '#4338ca', tier: 1, isCard: false, discovered: false },
  { id: 'plant', name: 'Plant', emoji: '🌿', category: 'nature', tag: 'nature', color: 'bg-green-600', glowColor: '#16a34a', tier: 1, isCard: false, discovered: false },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', category: 'nature', tag: 'energy', color: 'bg-yellow-400', glowColor: '#facc15', tier: 1, isCard: false, discovered: false },
  { id: 'ice', name: 'Ice', emoji: '🧊', category: 'nature', tag: 'water', color: 'bg-cyan-300', glowColor: '#67e8f9', tier: 1, isCard: false, discovered: false },
  { id: 'sand', name: 'Sand', emoji: '🏜️', category: 'nature', tag: 'earth', color: 'bg-yellow-300', glowColor: '#fde047', tier: 1, isCard: false, discovered: false },
  { id: 'smoke', name: 'Smoke', emoji: '💨', category: 'nature', tag: 'air', color: 'bg-gray-500', glowColor: '#6b7280', tier: 1, isCard: false, discovered: false },

  // Tier 1 — Materials
  { id: 'stone', name: 'Stone', emoji: '🪨', category: 'materials', tag: 'earth', color: 'bg-stone-500', glowColor: '#78716c', tier: 1, isCard: false, discovered: false },
  { id: 'metal', name: 'Metal', emoji: '⚙️', category: 'materials', tag: 'metal', color: 'bg-zinc-500', glowColor: '#71717a', tier: 1, isCard: false, discovered: false },
  { id: 'glass', name: 'Glass', emoji: '🔮', category: 'materials', tag: 'earth', color: 'bg-cyan-200', glowColor: '#a5f3fc', tier: 1, isCard: false, discovered: false },
  { id: 'wood', name: 'Wood', emoji: '🪵', category: 'materials', tag: 'nature', color: 'bg-amber-700', glowColor: '#b45309', tier: 1, isCard: false, discovered: false },
  { id: 'ash', name: 'Ash', emoji: '🌑', category: 'materials', tag: 'fire', color: 'bg-gray-700', glowColor: '#374151', tier: 1, isCard: false, discovered: false },
  { id: 'crystal', name: 'Crystal', emoji: '💎', category: 'materials', tag: 'earth', color: 'bg-violet-400', glowColor: '#a78bfa', tier: 1, isCard: false, discovered: false },

  // Tier 2 — Life
  { id: 'life', name: 'Life', emoji: '✨', category: 'life', tag: 'life', color: 'bg-emerald-500', glowColor: '#10b981', tier: 2, isCard: false, discovered: false },
  { id: 'seed', name: 'Seed', emoji: '🌱', category: 'life', tag: 'nature', color: 'bg-lime-600', glowColor: '#65a30d', tier: 2, isCard: false, discovered: false },
  { id: 'beast', name: 'Beast', emoji: '🐺', category: 'life', tag: 'life', color: 'bg-amber-600', glowColor: '#d97706', tier: 2, isCard: false, discovered: false },
  { id: 'human', name: 'Human', emoji: '🧑', category: 'life', tag: 'human', color: 'bg-orange-400', glowColor: '#f97316', tier: 2, isCard: false, discovered: false },
  { id: 'spirit', name: 'Spirit', emoji: '👻', category: 'life', tag: 'magic', color: 'bg-purple-300', glowColor: '#c084fc', tier: 2, isCard: false, discovered: false },

  // Tier 2 — Magic
  { id: 'magic', name: 'Magic', emoji: '🌟', category: 'magic', tag: 'magic', color: 'bg-purple-600', glowColor: '#9333ea', tier: 2, isCard: false, discovered: false },
  { id: 'rune', name: 'Rune', emoji: '🔣', category: 'magic', tag: 'magic', color: 'bg-indigo-500', glowColor: '#6366f1', tier: 2, isCard: false, discovered: false },
  { id: 'potion', name: 'Potion', emoji: '⚗️', category: 'magic', tag: 'magic', color: 'bg-pink-500', glowColor: '#ec4899', tier: 2, isCard: false, discovered: false },
  { id: 'energy_core', name: 'Energy Core', emoji: '⚛️', category: 'magic', tag: 'energy', color: 'bg-yellow-500', glowColor: '#eab308', tier: 2, isCard: false, discovered: false },

  // Tier 3 — Advanced Constructs (Cards)
  { id: 'wizard', name: 'Wizard', emoji: '🧙', category: 'advanced', tag: 'magic', color: 'bg-purple-700', glowColor: '#7e22ce', tier: 3, isCard: true, discovered: false },
  { id: 'golem', name: 'Golem', emoji: '🗿', category: 'advanced', tag: 'construct', color: 'bg-stone-600', glowColor: '#57534e', tier: 3, isCard: true, discovered: false },
  { id: 'firebolt', name: 'Firebolt', emoji: '🔥⚡', category: 'advanced', tag: 'fire', color: 'bg-orange-600', glowColor: '#ea580c', tier: 3, isCard: true, discovered: false },
  { id: 'storm_knight', name: 'Storm Knight', emoji: '⚔️', category: 'advanced', tag: 'storm', color: 'bg-indigo-700', glowColor: '#3730a3', tier: 3, isCard: true, discovered: false },
  { id: 'forest_guardian', name: 'Forest Guardian', emoji: '🌲', category: 'advanced', tag: 'nature', color: 'bg-green-700', glowColor: '#15803d', tier: 3, isCard: true, discovered: false },
  { id: 'sea_serpent', name: 'Sea Serpent', emoji: '🐉', category: 'advanced', tag: 'water', color: 'bg-teal-600', glowColor: '#0d9488', tier: 3, isCard: true, discovered: false },
  { id: 'phoenix', name: 'Phoenix', emoji: '🦅', category: 'advanced', tag: 'fire', color: 'bg-red-600', glowColor: '#dc2626', tier: 3, isCard: true, discovered: false },
  { id: 'crystal_mage', name: 'Crystal Mage', emoji: '💎', category: 'advanced', tag: 'magic', color: 'bg-violet-600', glowColor: '#7c3aed', tier: 3, isCard: true, discovered: false },
  { id: 'iron_golem', name: 'Iron Golem', emoji: '🤖', category: 'advanced', tag: 'construct', color: 'bg-gray-600', glowColor: '#4b5563', tier: 3, isCard: true, discovered: false },
  { id: 'thunder_hawk', name: 'Thunder Hawk', emoji: '🦅⚡', category: 'advanced', tag: 'storm', color: 'bg-yellow-600', glowColor: '#ca8a04', tier: 3, isCard: true, discovered: false },
];

// ── Fusion Recipes ──────────────────────────────────────────
export const FUSION_RECIPES: FusionRecipe[] = [
  // Tier 1 fusions
  { ingredients: ['fire', 'water'], result: 'steam' },
  { ingredients: ['water', 'fire'], result: 'steam' },
  { ingredients: ['earth', 'water'], result: 'mud' },
  { ingredients: ['water', 'earth'], result: 'mud' },
  { ingredients: ['earth', 'air'], result: 'dust' },
  { ingredients: ['air', 'earth'], result: 'dust' },
  { ingredients: ['fire', 'earth'], result: 'lava' },
  { ingredients: ['earth', 'fire'], result: 'lava' },
  { ingredients: ['air', 'water'], result: 'storm' },
  { ingredients: ['water', 'air'], result: 'storm' },
  { ingredients: ['earth', 'water'], result: 'mud' },
  { ingredients: ['air', 'fire'], result: 'lightning' },
  { ingredients: ['fire', 'air'], result: 'lightning' },
  { ingredients: ['water', 'air'], result: 'ice' },
  { ingredients: ['air', 'water'], result: 'ice' },
  { ingredients: ['earth', 'air'], result: 'sand' },
  { ingredients: ['fire', 'air'], result: 'smoke' },
  { ingredients: ['lava', 'air'], result: 'stone' },
  { ingredients: ['air', 'lava'], result: 'stone' },
  { ingredients: ['stone', 'fire'], result: 'metal' },
  { ingredients: ['fire', 'stone'], result: 'metal' },
  { ingredients: ['sand', 'fire'], result: 'glass' },
  { ingredients: ['fire', 'sand'], result: 'glass' },
  { ingredients: ['earth', 'plant'], result: 'wood' },
  { ingredients: ['plant', 'earth'], result: 'wood' },
  { ingredients: ['fire', 'wood'], result: 'ash' },
  { ingredients: ['wood', 'fire'], result: 'ash' },
  { ingredients: ['glass', 'magic'], result: 'crystal' },
  { ingredients: ['magic', 'glass'], result: 'crystal' },
  { ingredients: ['mud', 'life'], result: 'plant' },
  { ingredients: ['life', 'mud'], result: 'plant' },

  // Tier 2 fusions
  { ingredients: ['earth', 'life'], result: 'seed' },
  { ingredients: ['life', 'earth'], result: 'seed' },
  { ingredients: ['steam', 'life'], result: 'life' },
  { ingredients: ['life', 'steam'], result: 'life' },
  { ingredients: ['plant', 'life'], result: 'beast' },
  { ingredients: ['life', 'plant'], result: 'beast' },
  { ingredients: ['beast', 'fire'], result: 'human' },
  { ingredients: ['fire', 'beast'], result: 'human' },
  { ingredients: ['human', 'air'], result: 'spirit' },
  { ingredients: ['air', 'human'], result: 'spirit' },
  { ingredients: ['crystal', 'energy_core'], result: 'magic' },
  { ingredients: ['energy_core', 'crystal'], result: 'magic' },
  { ingredients: ['rune', 'stone'], result: 'rune' },
  { ingredients: ['magic', 'stone'], result: 'rune' },
  { ingredients: ['stone', 'magic'], result: 'rune' },
  { ingredients: ['magic', 'water'], result: 'potion' },
  { ingredients: ['water', 'magic'], result: 'potion' },
  { ingredients: ['metal', 'lightning'], result: 'energy_core' },
  { ingredients: ['lightning', 'metal'], result: 'energy_core' },

  // Tier 3 fusions (card discoveries)
  { ingredients: ['human', 'magic'], result: 'wizard' },
  { ingredients: ['magic', 'human'], result: 'wizard' },
  { ingredients: ['stone', 'life'], result: 'golem' },
  { ingredients: ['life', 'stone'], result: 'golem' },
  { ingredients: ['fire', 'lightning'], result: 'firebolt' },
  { ingredients: ['lightning', 'fire'], result: 'firebolt' },
  { ingredients: ['human', 'storm'], result: 'storm_knight' },
  { ingredients: ['storm', 'human'], result: 'storm_knight' },
  { ingredients: ['beast', 'plant'], result: 'forest_guardian' },
  { ingredients: ['plant', 'beast'], result: 'forest_guardian' },
  { ingredients: ['beast', 'water'], result: 'sea_serpent' },
  { ingredients: ['water', 'beast'], result: 'sea_serpent' },
  { ingredients: ['fire', 'spirit'], result: 'phoenix' },
  { ingredients: ['spirit', 'fire'], result: 'phoenix' },
  { ingredients: ['wizard', 'crystal'], result: 'crystal_mage' },
  { ingredients: ['crystal', 'wizard'], result: 'crystal_mage' },
  { ingredients: ['golem', 'metal'], result: 'iron_golem' },
  { ingredients: ['metal', 'golem'], result: 'iron_golem' },
  { ingredients: ['storm_knight', 'lightning'], result: 'thunder_hawk' },
  { ingredients: ['lightning', 'storm_knight'], result: 'thunder_hawk' },
];

// ── Card Definitions ────────────────────────────────────────
export const CARDS: Card[] = [
  {
    id: 'wizard',
    elementId: 'wizard',
    name: 'Wizard',
    type: 'entity',
    cost: 4,
    power: 5,
    rarity: 'rare',
    tag: 'magic',
    abilityDescription: 'On Reveal: +2 power to cards in adjacent lanes.',
    abilityTrigger: 'on_reveal',
    flavorText: '"He who masters the elements, masters fate itself."',
  },
  {
    id: 'golem',
    elementId: 'golem',
    name: 'Golem',
    type: 'entity',
    cost: 3,
    power: 6,
    rarity: 'uncommon',
    tag: 'construct',
    abilityDescription: 'Ongoing: Cannot be reduced below 3 power.',
    abilityTrigger: 'ongoing',
    flavorText: '"Stone given purpose, clay given will."',
  },
  {
    id: 'firebolt',
    elementId: 'firebolt',
    name: 'Firebolt',
    type: 'spell',
    cost: 2,
    power: 3,
    rarity: 'common',
    tag: 'fire',
    abilityDescription: 'On Reveal: Deal -3 power to the enemy card in this lane.',
    abilityTrigger: 'on_reveal',
    flavorText: '"The fastest path between two points is fire."',
  },
  {
    id: 'storm_knight',
    elementId: 'storm_knight',
    name: 'Storm Knight',
    type: 'hybrid',
    cost: 5,
    power: 7,
    rarity: 'rare',
    tag: 'storm',
    abilityDescription: 'On Reveal: If you win 2+ lanes, gain +3 power.',
    abilityTrigger: 'on_reveal',
    flavorText: '"Where lightning walks, victory follows."',
  },
  {
    id: 'forest_guardian',
    elementId: 'forest_guardian',
    name: 'Forest Guardian',
    type: 'entity',
    cost: 3,
    power: 4,
    rarity: 'uncommon',
    tag: 'nature',
    abilityDescription: 'Ongoing: +1 power for each other nature card you have in play.',
    abilityTrigger: 'ongoing',
    flavorText: '"The forest does not forget. Neither does its guardian."',
  },
  {
    id: 'sea_serpent',
    elementId: 'sea_serpent',
    name: 'Sea Serpent',
    type: 'entity',
    cost: 4,
    power: 6,
    rarity: 'rare',
    tag: 'water',
    abilityDescription: 'On Reveal: Move the enemy card in this lane to a random other lane.',
    abilityTrigger: 'on_reveal',
    flavorText: '"The deep does not yield. It swallows."',
  },
  {
    id: 'phoenix',
    elementId: 'phoenix',
    name: 'Phoenix',
    type: 'entity',
    cost: 5,
    power: 5,
    rarity: 'legendary',
    tag: 'fire',
    abilityDescription: 'Passive: If this lane would be lost, gain +4 power instead (once per game).',
    abilityTrigger: 'passive',
    flavorText: '"From ash, glory. From defeat, rebirth."',
  },
  {
    id: 'crystal_mage',
    elementId: 'crystal_mage',
    name: 'Crystal Mage',
    type: 'hybrid',
    cost: 6,
    power: 6,
    rarity: 'legendary',
    tag: 'magic',
    abilityDescription: 'On Reveal: Copy the ability of the highest-power card on the board.',
    abilityTrigger: 'on_reveal',
    flavorText: '"She does not learn spells. She becomes them."',
  },
  {
    id: 'iron_golem',
    elementId: 'iron_golem',
    name: 'Iron Golem',
    type: 'entity',
    cost: 4,
    power: 8,
    rarity: 'uncommon',
    tag: 'construct',
    abilityDescription: 'Passive: Cannot be targeted by spell cards.',
    abilityTrigger: 'passive',
    flavorText: '"Iron does not bend to words. Only to force."',
  },
  {
    id: 'thunder_hawk',
    elementId: 'thunder_hawk',
    name: 'Thunder Hawk',
    type: 'entity',
    cost: 5,
    power: 6,
    rarity: 'legendary',
    tag: 'storm',
    abilityDescription: 'On Reveal: +2 power to all storm cards. Deal -1 to all enemy cards.',
    abilityTrigger: 'on_reveal',
    flavorText: '"The sky itself bows to its wings."',
  },
];

// ── Rarity colors ───────────────────────────────────────────
export type Color = string;
export const RARITY_COLORS: Record<Rarity, Color> = {
  common: '#78716c',
  uncommon: '#16a34a',
  rare: '#2563eb',
  legendary: '#d4a843',
};

export const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(120,113,108,0.3)',
  uncommon: 'rgba(22,163,74,0.4)',
  rare: 'rgba(37,99,235,0.4)',
  legendary: 'rgba(212,168,67,0.6)',
};

// ── Helper functions ────────────────────────────────────────
export function getFusionResult(a: string, b: string): string | null {
  const recipe = FUSION_RECIPES.find(
    r => (r.ingredients[0] === a && r.ingredients[1] === b) ||
         (r.ingredients[0] === b && r.ingredients[1] === a)
  );
  return recipe ? recipe.result : null;
}

export function getElementById(id: string): Element | undefined {
  return ELEMENTS.find(e => e.id === id);
}

export function getCardById(id: string): Card | undefined {
  return CARDS.find(c => c.id === id);
}

export function getDiscoverableElements(discovered: Set<string>): Element[] {
  return ELEMENTS.filter(e => !discovered.has(e.id));
}
