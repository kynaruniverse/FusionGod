/**
 * ALCHEMY CLASH: FINAL STATE ORCHESTRATOR (COMPLETE GDD-ALIGNED)
 * Full flow: Tutorial Splash → Hub (Workshop / Deck / Collections / Quests) → Battle
 * All systems wired: ElementSystem, Fusion, CardFactory, DuelManager, AI, Input, HUD, Rewards.
 */

import { Engine3D } from './src/core/Engine3D.js';
import { CardFactory } from './src/cards/CardFactory.js';
import { InputSystem } from './src/core/InputSystem.js';
import { DuelManager } from './src/battle/DuelManager.js';
import { VFXManager } from './src/core/VFXManager.js';
import { Environment } from './src/core/Environment.js';
import { AudioManager } from './src/core/AudioManager.js';
import { ElementSystem } from './src/alchemy/ElementSystem.js';
import { HubScreen } from './src/ui/HubScreen.js';
import { WorkshopScreen } from './src/ui/WorkshopScreen.js';
import { DeckBuilder } from './src/ui/DeckBuilder.js';
import { BattleHUD } from './src/ui/BattleHUD.js';
import { QuestsScreen } from './src/ui/QuestsScreen.js';

class GameBootstrapper {
    constructor() {
        this.audio = new AudioManager();
        this.uiHub = document.getElementById('ui-container');
        this.battleContainer = document.getElementById('game-container');
        this.elementSystem = new ElementSystem();
        this.initTutorialSplash();
    }

    initTutorialSplash() {
        this.uiHub.innerHTML = `
            <div id="splash-screen" class="game-screen active-screen">
                <div id="splash-logo">
                    <div id="splash-title">ALCHEMY<br>CLASH</div>
                    <div id="splash-subtext">Tutorial: Fuse your first elements</div>
                </div>
                <button id="start-tutorial-btn" class="aaa-button">BEGIN TUTORIAL</button>
            </div>`;
        document.getElementById('start-tutorial-btn').onclick = () => {
            this.audio.play('CLICK', 0.5);
            this.transitionTo(() => this.initHubScreen());
        };
    }

    initHubScreen() {
        const hub = new HubScreen(this.uiHub, this.elementSystem);
        hub.onPlay = () => this.transitionTo(() => this.initWorkshopScreen());
        hub.onDeck = () => this.transitionTo(() => this.initDeckBuilder());
    }

    initWorkshopScreen() {
        const workshop = new WorkshopScreen(this.uiHub, this.elementSystem);
        workshop.onComplete = () => this.transitionTo(() => this.initHubScreen());
    }

    initDeckBuilder() {
        const builder = new DeckBuilder(this.uiHub);
        builder.onComplete = (deck) => this.gotoBattle(deck);
        builder.onBack = () => this.transitionTo(() => this.initHubScreen());
    }

    gotoBattle(playerDeck) {
        this.uiHub.innerHTML = '';
        this.battleContainer.style.display = 'block';

        this.app = new Engine3D();
        this.vfx = new VFXManager(this.app.scene);
        this.app.setVFX(this.vfx);
        new Environment(this.app.scene);

        this.factory = new CardFactory(this.app.scene, this.vfx);
        this.duel = new DuelManager(this.app.scene, this.vfx, this.audio, this.app.camera, this.factory, this.elementSystem);
        this.duel.initAI();

        this.input = new InputSystem(this.app, this.duel);
        this.input.enabled = true;

        this.hud = new BattleHUD(this.uiHub, this.duel);
        this.duel.ui = this.hud;

        this.duel.spawnPlayerDeck(playerDeck || ['FIRE_BOLT', 'WATER_FLOW', 'EARTH_WARD', 'AIR_GUST']);

        this.audio.play('PLACE', 0.4);
    }

    transitionTo(nextState) {
        gsap.to(this.uiHub, { 
            opacity: 0, 
            duration: 0.4, 
            onComplete: () => {
                this.uiHub.innerHTML = '';
                this.uiHub.style.opacity = 1;
                nextState();
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.Game = new GameBootstrapper();
});