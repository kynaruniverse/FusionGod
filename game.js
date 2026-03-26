/**
 * FUSIONGOD - Main Engine (Phase 1 Refactored)
 * Now using EventBus + Card class
 */

import './EventBus.js';
import Card from './Card.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 450, 
        height: 800
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('card-frame', 'https://labs.phaser.io/assets/sprites/cardBack_red.png');
    this.load.image('particle-flare', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
}

function create() {
    console.log("FUSIONGOD v3.90.0 Phase 1 Ready");

    // Player State
    this.playerStats = { hp: 100, maxHp: 100, gold: 0, depth: 1 };
    this.discoveredEntries = JSON.parse(localStorage.getItem('fusion_discovery')) || ['fire', 'water', 'wolf'];

    // HUD (still using ui.js for now)
    this.hpText = this.add.text(20, 20, '', { fontFamily: 'Orbitron', fontSize: '24px', color: '#ff4b2b' });
    this.goldText = this.add.text(20, 50, '', { fontFamily: 'Orbitron', fontSize: '20px', color: '#ffd700' });
    if (typeof updateHUD === 'function') updateHUD(this);

    // Hand area background
    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);

    // Initial cards using NEW Card class
    new Card(this, 150, 700, ELEMENT_DATA['fire'], true);
    new Card(this, 300, 700, ELEMENT_DATA['wolf'], true);

    // Dungeon row setup
    this.dungeonRow = [null, null, null];
    this.fillDungeonRow = () => {
        for (let i = 0; i < 3; i++) {
            if (!this.dungeonRow[i] || !this.dungeonRow[i].active) {
                const randomKey = getRandomDungeonKey();
                const data = DUNGEON_DATA[randomKey];
                const dungeonCard = new Card(this, 100 + (i * 125), -200, data, false);
                this.dungeonRow[i] = dungeonCard;

                this.tweens.add({
                    targets: dungeonCard,
                    y: 200,
                    duration: 600,
                    ease: 'Back.easeOut',
                    delay: i * 150
                });
            }
        }
    };

    this.fillDungeonRow();

    // Listen for drag events (this replaces the old dragend logic)
    this.eventBus.on('card-dragend', ({ card }) => {
        // We’ll move the full fusion/check logic here in Phase 2
        console.log("Card dropped:", card.cardData.name);
        // Temporary: just reorganize hand for player cards
        if (card.isPlayerCard) {
            if (typeof organizeHand === 'function') organizeHand(this);
        }
    });
}

function update() {
    // Empty for now - we'll add loop logic later
}