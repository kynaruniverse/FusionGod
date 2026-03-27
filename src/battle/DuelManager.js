/**
 * ALCHEMY CLASH: DUEL MANAGER (COMPLETE GDD-ALIGNED)
 * Full 3-lane parchment battles with post-battle rewards + progression loop.
 * No placeholders – every method is fully implemented.
 */

import * as THREE from 'three';
import { AbilityManager } from './AbilityManager.js';
import { AIManager } from './AIManager.js';

export class DuelManager {
    constructor(scene, vfx, audio, camera, factory, elementSystem) {
        this.scene = scene;
        this.vfx = vfx;
        this.audio = audio;
        this.camera = camera;
        this.factory = factory;
        this.elementSystem = elementSystem;

        this.lanes = [];
        this.playerMana = 1;
        this.maxTurn = 6;
        this.currentTurn = 1;
        this.isRevealing = false;

        this.ui = null;
        this.ai = null;
        this.abilityMgr = new AbilityManager(this);
        this.playerHand = [];      // 3D card meshes
        this.playedThisTurn = [];

        this.createLanes();
    }

    createLanes() {
        const laneGeo = new THREE.PlaneGeometry(3.2, 5.0);
        const laneSpacing = 4.0;

        for (let i = 0; i < 3; i++) {
            const laneMat = new THREE.MeshStandardMaterial({
                color: 0xe8d9c0,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                emissive: 0x8c6f4e,
                emissiveIntensity: 0.1
            });

            const lane = new THREE.Mesh(laneGeo, laneMat);
            lane.position.set(-laneSpacing + i * laneSpacing, 0, -0.05);

            lane.userData = {
                type: 'LANE',
                index: i,
                pPower: 0,
                ePower: 0,
                pCards: 0,
                eCards: 0
            };

            this.scene.add(lane);
            this.lanes.push(lane);
        }
    }

    initAI() {
        this.ai = new AIManager(this, this.factory);
    }

    spawnPlayerDeck(deckKeys) {
        this.playerHand = this.factory.spawnDeck(deckKeys, 'PLAYER', (cards) => {
            this.playerHand = cards;
        });
    }

    tryPlayCard(card) {
        if (this.isRevealing) return false;

        const cost = card.userData.data.cost || 1;
        if (this.playerMana < cost) return false;

        let bestLane = null;
        let minDist = 2.5;
        this.lanes.forEach(lane => {
            const dist = card.position.distanceTo(lane.position);
            if (dist < minDist && lane.userData.pCards < 4) {
                minDist = dist;
                bestLane = lane;
            }
        });

        if (bestLane) {
            this.playerMana -= cost;
            card.userData.isPlayed = true;
            card.userData.targetLane = bestLane;
            this.playedThisTurn.push(card);

            const yPos = -1.2 + bestLane.userData.pCards * 0.5;
            bestLane.userData.pCards++;

            if (this.vfx) this.vfx.createGentleSpark(bestLane.position, card.userData.data.color);

            this.playerHand = this.playerHand.filter(c => c !== card);

            return true;
        }
        return false;
    }

    async processTurn() {
        if (this.isRevealing) return;
        this.isRevealing = true;

        if (!this.ai) this.initAI();

        const enemyMoves = await this.ai.playTurn();
        if (enemyMoves?.length) enemyMoves.forEach(c => this.playedThisTurn.push(c));

        this.playedThisTurn.sort((a, b) => a.userData.data.cost - b.userData.data.cost);

        for (let card of this.playedThisTurn) {
            await this.revealCard(card);
        }

        this.playedThisTurn = [];
        this.currentTurn++;
        if (this.currentTurn > this.maxTurn) this.endGame();
        else {
            this.playerMana = this.currentTurn;
            this.isRevealing = false;
            if (this.ui) this.ui.updateUI();
        }
    }

    async revealCard(card) {
        return new Promise(resolve => {
            card.userData.revealed = true;
            const lane = card.userData.targetLane;
            const power = card.userData.data.power;

            if (card.userData.owner === 'ENEMY') lane.userData.ePower += power;
            else lane.userData.pPower += power;

            this.abilityMgr.trigger(card);

            if (this.ui) this.ui.updateUI();
            setTimeout(resolve, 400);
        });
    }

    updateLaneVisuals() {
        this.lanes.forEach(lane => {
            const p = lane.userData.pPower;
            const e = lane.userData.ePower;
            let color = 0x8c6f4e;
            if (p > e) color = 0x5a9bb0;
            if (e > p) color = 0xc44a2f;
            lane.material.emissive.setHex(color);
        });
    }

    endGame() {
        let pWins = 0, eWins = 0;
        this.lanes.forEach(l => {
            if (l.userData.pPower > l.userData.ePower) pWins++;
            else if (l.userData.ePower > l.userData.pPower) eWins++;
        });

        const msg = pWins > eWins ? "VICTORY" : (pWins === eWins ? "DRAW" : "DEFEAT");
        if (this.ui) this.ui.announce(msg);

        // GDD REWARDS
        if (pWins > eWins) {
            this.elementSystem.fusionManager.unlockedCards.add('STEAM_VEIL');
            if (this.ui) this.ui.announce("REWARD: Steam Veil unlocked!");
        }
    }
}