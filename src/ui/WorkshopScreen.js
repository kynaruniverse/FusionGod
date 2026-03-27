/**
 * ALCHEMY CLASH: WORKSHOP SCREEN (COMPLETE GDD-ALIGNED)
 * Full fusion UI + card reward display.
 */

import { ELEMENT_DATABASE } from '../alchemy/ElementData.js';
import gsap from 'gsap';

export class WorkshopScreen {
    constructor(parent, elementSystem) {
        this.parent = parent;
        this.elementSystem = elementSystem;
        this.onComplete = null;
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="workshop-screen" class="game-screen active-screen">
                <div id="workshop-header">
                    <div id="workshop-title">FUSION WORKSHOP</div>
                    <button id="back-to-hub-btn" class="aaa-button small">← BACK</button>
                </div>
                <div id="book-of-elements"><h3>UNLOCKED ELEMENTS</h3><div id="element-grid"></div></div>
                <div id="fusion-area">
                    <div id="fusion-slot-a" class="fusion-slot">DROP FIRST</div>
                    <div id="fusion-plus">+</div>
                    <div id="fusion-slot-b" class="fusion-slot">DROP SECOND</div>
                    <button id="fuse-btn" class="aaa-button" disabled>FUSE</button>
                </div>
                <div id="fusion-result"></div>
            </div>`;

        this.renderElementGrid();
        this.setupDragAndDrop();

        document.getElementById('back-to-hub-btn').onclick = () => this.onComplete?.();
    }

    renderElementGrid() {
        const grid = document.getElementById('element-grid');
        grid.innerHTML = '';
        this.elementSystem.getUnlocked().forEach(el => {
            const item = document.createElement('div');
            item.className = 'element-item';
            item.innerHTML = `<span class="elem-icon">\( {el.icon}</span><span class="elem-name"> \){el.name}</span>`;
            item.draggable = true;
            item.dataset.key = Object.keys(ELEMENT_DATABASE).find(k => ELEMENT_DATABASE[k] === el);
            item.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', item.dataset.key));
            grid.appendChild(item);
        });
    }

    setupDragAndDrop() {
        const slotA = document.getElementById('fusion-slot-a');
        const slotB = document.getElementById('fusion-slot-b');
        const fuseBtn = document.getElementById('fuse-btn');

        [slotA, slotB].forEach(slot => {
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => {
                e.preventDefault();
                const key = e.dataTransfer.getData('text/plain');
                slot.dataset.key = key;
                slot.textContent = ELEMENT_DATABASE[key].name;
                this.checkCanFuse();
            });
        });

        fuseBtn.onclick = () => this.performFusion();
    }

    checkCanFuse() {
        const a = document.getElementById('fusion-slot-a').dataset.key;
        const b = document.getElementById('fusion-slot-b').dataset.key;
        document.getElementById('fuse-btn').disabled = !(a && b && a !== b);
    }

    performFusion() {
        const a = document.getElementById('fusion-slot-a').dataset.key;
        const b = document.getElementById('fusion-slot-b').dataset.key;
        const result = this.elementSystem.fuse(a, b);

        const resultEl = document.getElementById('fusion-result');
        if (result) {
            resultEl.innerHTML = `<span class="success">✨ ${result} UNLOCKED!</span>`;
            if (this.elementSystem.fusionManager.getUnlockedCards().length > 0) {
                resultEl.innerHTML += `<br><small>New card available in deck builder</small>`;
            }
            gsap.fromTo(resultEl, {scale:0.6, opacity:0}, {scale:1, opacity:1, duration:0.6});
            this.renderElementGrid();
        } else {
            resultEl.innerHTML = `<span class="fail">No new fusion</span>`;
        }

        document.getElementById('fusion-slot-a').textContent = 'DROP FIRST';
        document.getElementById('fusion-slot-b').textContent = 'DROP SECOND';
        document.getElementById('fuse-btn').disabled = true;
    }
}