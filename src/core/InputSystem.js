/**
 * ALCHEMY CLASH: INPUT SYSTEM (GDD-ALIGNED)
 * Gentle parchment-style drag & drop for alchemy cards. Soft hover lift only.
 * Integrates cleanly with DuelManager and new earth-tone visuals.
 */

import * as THREE from 'three';

export class InputSystem {
    constructor(engine, duelMgr) {
        this.engine = engine;
        this.duelMgr = duelMgr;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.selectedCard = null;
        this.isDragging = false;

        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.originalPos = new THREE.Vector3();

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('pointerdown', (e) => this.onDown(e));
        window.addEventListener('pointermove', (e) => this.onMove(e));
        window.addEventListener('pointerup', (e) => this.onUp(e));
    }

    updateMouse(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onDown(e) {
        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);

        const intersects = this.raycaster.intersectObjects(this.engine.scene.children, true);
        const cardHit = intersects.find(i => i.object.userData?.type === 'CARD');

        if (cardHit && cardHit.object.userData.owner === 'PLAYER' && !cardHit.object.userData.isPlayed) {
            this.selectedCard = cardHit.object;
            this.isDragging = true;
            this.originalPos.copy(this.selectedCard.position);

            if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
                this.offset.copy(this.intersection).sub(this.selectedCard.position);
            }

            // Gentle lift
            gsap.to(this.selectedCard.position, { z: 1.5, duration: 0.2 });
        }
    }

    onMove(e) {
        if (!this.isDragging || !this.selectedCard) return;

        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);

        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
            const newPos = this.intersection.sub(this.offset);
            this.selectedCard.position.x = newPos.x;
            this.selectedCard.position.y = newPos.y;
        }
    }

    onUp(e) {
        if (!this.selectedCard) return;

        const success = this.duelMgr.tryPlayCard(this.selectedCard);

        if (!success) {
            gsap.to(this.selectedCard.position, {
                x: this.originalPos.x,
                y: this.originalPos.y,
                z: this.originalPos.z,
                duration: 0.3
            });
        }

        this.selectedCard = null;
        this.isDragging = false;
    }
}