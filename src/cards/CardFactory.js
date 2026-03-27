/**
 * ALCHEMY CLASH: CARD FACTORY (GDD-ALIGNED)
 * Soft earth-tone / pastel alchemy visuals. No cyber/neon.
 * Creates 3D cards with parchment-style materials and gentle glows.
 */

import * as THREE from 'three';
import { CARD_DATABASE } from './CardData.js';
import { gsap } from 'gsap';

export class CardFactory {
    constructor(scene, vfxManager) {
        this.scene = scene;
        this.vfx = vfxManager;
        this.loader = new THREE.TextureLoader();
        this.textureCache = new Map();
    }

    getTexture(url) {
        if (!this.textureCache.has(url)) {
            const tex = this.loader.load(url);
            tex.anisotropy = 8;
            tex.colorSpace = THREE.SRGBColorSpace;
            this.textureCache.set(url, tex);
        }
        return this.textureCache.get(url);
    }

    createCard(cardKey, x, y, owner = 'PLAYER') {
        const data = CARD_DATABASE[cardKey];
        if (!data) {
            console.error(`CardFactory: Card key ${cardKey} not found`);
            return null;
        }

        const geometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);

        const edgeColor = data.color || 0x8c6f4e; // earth-tone default
        const emissiveIntensity = { 'LEGENDARY': 0.25, 'EPIC': 0.18, 'RARE': 0.12, 'COMMON': 0.06 }[data.rarity] || 0.08;

        const sideMat = new THREE.MeshStandardMaterial({
            color: edgeColor,
            metalness: 0.3,
            roughness: 0.7,
            emissive: edgeColor,
            emissiveIntensity
        });

        const frontMat = new THREE.MeshStandardMaterial({
            map: this.getTexture(data.texture || 'assets/cards/default.png'),
            metalness: 0.1,
            roughness: 0.8
        });

        const backMat = new THREE.MeshStandardMaterial({
            color: 0xe8d9c0, // parchment beige
            emissive: 0x5a9bb0,
            emissiveIntensity: 0.08,
            metalness: 0.2,
            roughness: 0.9
        });

        const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(x, y, 0);

        mesh.userData = {
            type: 'CARD',
            data: { ...data },
            owner,
            isPlayed: false,
            revealed: false,
            targetLane: null
        };

        this.scene.add(mesh);
        return mesh;
    }
    
    spawnDeck(deckList = [], owner = 'PLAYER', onComplete = null) {
    if (!deckList.length) return [];
    const cards = [];
        const startX = owner === 'PLAYER' ? -5 : 5;
        const startY = owner === 'PLAYER' ? -7 : 7;

        deckList.forEach((cardKey, index) => {
            const card = this.createCard(cardKey, startX + (index * 0.6 - 1.2), startY, owner);
            if (!card) return;

            if (owner === 'ENEMY') card.rotation.y = Math.PI;

            gsap.fromTo(card.position, 
                { y: startY + 3, z: -2 }, 
                { y: card.position.y, z: 0, duration: 0.6, delay: index * 0.08, ease: "power2.out" }
            );

            cards.push(card);
        });

        if (onComplete) onComplete(cards);
        return cards;
    }
}