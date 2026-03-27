/**
 * ALCHEMY CLASH: STATE-BASED MAIN ORCHESTRATOR
 * Swaps clean screens (Splash -> Menu -> Deck Builder -> Battle) to solve overlap issues.
 */

// Critical: Ensure these paths match your case-sensitive folder sidebar exactly
import { Engine3D } from './src/core/Engine3D.js';
import { CardFactory } from './src/core/CardFactory.js';
import { InputSystem } from './src/core/InputSystem.js';
import { DuelManager } from './src/game/DuelManager.js';
import { VFXManager } from './src/core/VFXManager.js';
import { Interface } from './src/ui/Interface.js';
import { AIManager } from './src/game/AIManager.js';
import { Environment } from './src/core/Environment.js';
import { AudioManager } from './src/core/AudioManager.js';
import { DeckBuilder } from './src/ui/DeckBuilder.js';

class GameBootstrapper {
    constructor() {
        console.log("-----------------------------------------");
        console.log("ALCHEMY CLASH: Init (New State Architecture)");
        
        // 1. Core Systems Init
        this.app = null;
        this.duel = null;
        this.input = null;
        this.audio = new AudioManager();
        
        // 2. The Dynamic UI Hub
        this.uiHub = document.getElementById('ui-container');
        this.battleContainer = document.getElementById('game-container');
        
        // 3. Kickoff the flow: Screen 1: Splash
        this.initSplashScreen();
    }

    /**
     * CLEAN STATE 1: AAA Splash Screen
     * Simple, centered, impossible to overlap.
     */
    initSplashScreen() {
        console.log("State: Splash");
        this.uiHub.innerHTML = ''; // Sanitize container

        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.className = 'game-screen';
        splash.innerHTML = `
            <div id="splash-logo">
                <div id="splash-title">ALCHEMY<br>CLASH</div>
                <div id="splash-subtext">MASTER THE ELEMENTS</div>
            </div>
            <button id="enter-arena-btn" class="aaa-button">ENTER ARENA</button>
        `;
        
        this.uiHub.appendChild(splash);

        // Transition in with GSAP (Guarantees display: flex)
        requestAnimationFrame(() => splash.classList.add('active-screen'));

        // Bind the button. This WILL work now because nothing else exists.
        const enterBtn = document.getElementById('enter-arena-btn');
        if (enterBtn) {
            enterBtn.onclick = () => {
                console.log("Arena Entered: Splashing Menu.");
                if (this.audio) this.audio.play('SNAP', 0.5); // Feedback!
                this.gotoMenuState(splash);
            };
        } else {
            console.error("Critical: Splash button not found.");
        }
    }

    /**
     * CLEAN STATE 2: Marvel Snap Menu
     * Transition from Splash to the main hub.
     */
    gotoMenuState(outgoingScreen) {
        gsap.to(outgoingScreen, { opacity: 0, duration: 0.4, onComplete: () => {
            outgoingScreen.remove(); // Kill the old screen entirely
            this.initMenuScreen();
        }});
    }

    initMenuScreen() {
        console.log("State: Menu (Snap Style)");
        
        const menu = document.createElement('div');
        menu.id = 'menu-screen';
        menu.className = 'game-screen';
        menu.innerHTML = `
            <div id="menu-top">
                <div id="menu-player">
                    <div id="player-avatar"></div>
                    <div id="player-meta">
                        <div id="player-level">LVL 70</div>
                        <div id="player-name">TRASHMASTER</div>
                    </div>
                </div>
                <div id="menu-resources">
                    <div class="resource-pill">💎 150</div>
                    <div class="resource-pill gold">🎫 300</div>
                </div>
            </div>

            <div id="menu-center">
                <div id="seasonal-mission-banner">
                    <div>SEASONAL<br>MISSIONS</div>
                </div>
            </div>

            <div id="menu-bottom">
                <div id="menu-subtext">MASTER THE ELEMENTS</div>
                <div id="play-btn-wrapper">
                    <div id="current-deck-label">STARTER DECK</div>
                    <button id="main-play-btn" class="play-button">PLAY</button>
                </div>
                <div id="bottom-nav">
                    <div class="nav-item">Shop</div>
                    <div class="nav-item active-nav">Main</div>
                    <div class="nav-item">Decks</div>
                </div>
            </div>
        `;

        this.uiHub.appendChild(menu);
        requestAnimationFrame(() => menu.classList.add('active-screen'));

        // Marvel Snap logic: "PLAY" opens DeckBuilder first.
        const playBtn = document.getElementById('main-play-btn');
        if (playBtn) {
            playBtn.onclick = () => {
                console.log("Play Clicked: Transitioning to Deck Builder.");
                if (this.audio) this.audio.play('CLICK', 0.5);
                this.gotoDeckBuilderState(menu);
            };
        }
    }

    /**
     * CLEAN STATE 3: Deck Builder
     * Transition from Menu to DeckBuilder.
     */
    gotoDeckBuilderState(outgoingScreen) {
        gsap.to(outgoingScreen, { opacity: 0, duration: 0.3, onComplete: () => {
            outgoingScreen.remove();
            
            // Critical: The existing src/ui/DeckBuilder.js must be capable 
            // of injecting its own HTML into #ui-container.
            try {
                // Initialize Deck Builder with the start callback
                new DeckBuilder(this.uiHub, (selectedDeck) => {
                    console.log("Deck Locked:", selectedDeck);
                    if (this.audio) this.audio.play('START', 0.5);
                    this.gotoBattleState(selectedDeck);
                });
            } catch (e) {
                console.error("Critical: DeckBuilder failed. Is src/ui/DeckBuilder.js correct?", e);
            }
        }});
    }

    /**
     * CLEAN STATE 4: The AAA Battle
     * Transition from the pure 2D interface into the 3D game world.
     */
    gotoBattleState(playerDeck) {
        console.log("State: Battle (Cinematic Jump)");
        
        // 1. Sterilize the pure 2D interface hub
        gsap.to(this.uiHub, { opacity: 0, duration: 0.3, onComplete: () => {
            this.uiHub.innerHTML = '';
            
            // 2. Initialize the heavy 3D Systems now (saves memory)
            this.init3DSystems(playerDeck);
            
            // 3. Initialize the Battle HUD (Over the 3D scene)
            this.initBattleHUD();
            
            // 4. Reveal the 3D container
            this.battleContainer.style.display = 'block';
            gsap.to(this.battleContainer, { opacity: 1, duration: 1, delay: 0.5 });
            gsap.to(this.uiHub, { opacity: 1, duration: 0.5, delay: 1.5 }); // HUD Fades back in
        }});
    }

    /**
     * Lazily initialize the 3D engine only when needed
     */
    init3DSystems(playerDeck) {
        console.log("Initializing 3D Systems...");
        
        this.app = new Engine3D();
        const world = new Environment(this.app.scene);
        const vfx = new VFXManager(this.app.scene);
        this.app.setVFX(vfx);

        // Game Rules
        this.duel = new DuelManager(this.app.scene, vfx, this.audio);
        this.factory = new CardFactory(this.app.scene);
        this.ai = new AIManager(this.duel, this.factory);

        // Battle HUD reference (needs duel injected)
        this.ui = new Interface(this.duel);
        
        // Final Dependencies
        this.duel.ui = this.ui;
        this.duel.ai = this.ai;
        this.input = new InputSystem(this.app, this.duel);
        this.input.enabled = false; // Initially disable interaction

        // Trigger the AAA jump!
        this.app.transitionToBattle();
        
        // Spawn cards and start
        this.factory.spawnDeck(playerDeck, 'PLAYER', () => {
            console.log("Cards Spawned. Match Start!");
            this.input.enabled = true; // Match begins!
            this.ui.announce("ROUND 1");
            this.ui.updateUI();
        });
    }

    /**
     * CLEAN STATE 4: Battle HUD (Injects back over 3D world)
     */
    initBattleHUD() {
        console.log("Injecting Battle HUD");
        
        const battleHUD = document.createElement('div');
        battleHUD.id = 'battle-screen';
        battleHUD.className = 'game-screen';
        battleHUD.innerHTML = `
            <div id="score-container">
                <div class="lane-ui">
                    <div class="enemy-score" id="enemy-0">0</div>
                    <div class="lane-score" id="score-0">0</div>
                </div>
                <div class="lane-ui">
                    <div class="enemy-score" id="enemy-1">0</div>
                    <div class="lane-score" id="score-1">0</div>
                </div>
                <div class="lane-ui">
                    <div class="enemy-score" id="enemy-2">0</div>
                    <div class="lane-score" id="score-2">0</div>
                </div>
            </div>

            <div id="announcer">MATCH START</div>

            <div id="bottom-bar">
                <div class="mana-container">
                    <div class="mana-hex">
                        <span id="mana-value">1</span>
                    </div>
                    <div class="mana-label">ENERGY</div>
                </div>
                <button id="end-turn-btn">END TURN</button>
            </div>
        `;
        
        this.uiHub.appendChild(battleHUD);
        requestAnimationFrame(() => battleHUD.classList.add('active-screen'));
    }
}

// Global initialization on load
window.addEventListener('DOMContentLoaded', () => {
    window.Game = new GameBootstrapper();
});
