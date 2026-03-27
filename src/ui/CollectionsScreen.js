/**
 * ALCHEMY CLASH: COLLECTIONS SCREEN (GDD-ALIGNED)
 * Parchment-style view of all unlocked elements and owned cards.
 * Earth-tone / pastel alchemy UI – soft, mystical, no neon.
 */

import { ELEMENT_DATABASE } from '../alchemy/ElementData.js';
import { CARD_DATABASE } from '../cards/CardData.js';
import gsap from 'gsap';

export class CollectionsScreen {
    constructor(parent, elementSystem) {
        this.parent = parent;
        this.elementSystem = elementSystem;
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="collections-screen" class="game-screen active-screen">
                <div id="collections-header">
                    <div id="collections-title">COLLECTIONS</div>
                    <button id="back-from-collections-btn" class="aaa-button small">← BACK TO HUB</button>
                </div>
                
                <div id="collections-tabs">
                    <button id="tab-elements" class="tab-btn active">ELEMENTS</button>
                    <button id="tab-cards" class="tab-btn">CARDS</button>
                </div>
                
                <div id="collections-content">
                    <div id="elements-list" class="collection-grid"></div>
                    <div id="cards-list" class="collection-grid hidden"></div>
                </div>
            </div>`;

        this.renderElements();
        this.renderCards();
        this.setupTabs();

        document.getElementById('back-from-collections-btn').onclick = () => {
            // Return to hub (handled by caller)
            if (typeof this.onBack === 'function') this.onBack();
        };
    }

    setupTabs() {
        const tabElements = document.getElementById('tab-elements');
        const tabCards = document.getElementById('tab-cards');
        const listElements = document.getElementById('elements-list');
        const listCards = document.getElementById('cards-list');

        tabElements.onclick = () => {
            tabElements.classList.add('active');
            tabCards.classList.remove('active');
            listElements.classList.remove('hidden');
            listCards.classList.add('hidden');
        };

        tabCards.onclick = () => {
            tabCards.classList.add('active');
            tabElements.classList.remove('active');
            listCards.classList.remove('hidden');
            listElements.classList.add('hidden');
        };
    }

    renderElements() {
        const container = document.getElementById('elements-list');
        container.innerHTML = '<h3>UNLOCKED ELEMENTS</h3>';
        
        this.elementSystem.getUnlocked().forEach(el => {
            const div = document.createElement('div');
            div.className = 'collection-item element';
            div.innerHTML = `
                <span class="icon">${el.icon}</span>
                <span class="name">${el.name}</span>
                <span class="desc">${el.desc}</span>
            `;
            container.appendChild(div);
        });
    }

    renderCards() {
        const container = document.getElementById('cards-list');
        container.innerHTML = '<h3>OWNED CARDS</h3>';
        
        Object.keys(CARD_DATABASE).forEach(key => {
            const card = CARD_DATABASE[key];
            const div = document.createElement('div');
            div.className = 'collection-item card';
            div.innerHTML = `
                <div class="card-frame">
                    <div class="cost">${card.cost}</div>
                    <div class="name">${card.name}</div>
                    <div class="power">POW ${card.power}</div>
                </div>
            `;
            container.appendChild(div);
        });
    }
}