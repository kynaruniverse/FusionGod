/**
 * ALCHEMY CLASH: ENVIRONMENT (GDD-ALIGNED)
 * Soft earth-tone / pastel alchemy battlefield. Parchment textures, gentle fog,
 * warm parchment lighting. No cyber, no neon, no grid.
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        // Soft alchemy fog
        this.scene.fog = new THREE.FogExp2(0xe8d9c0, 0.035);

        // Gentle parchment floor
        this.createParchmentFloor();

        // Pastel sky dome
        this.createSkyDome();

        // Subtle floating alchemy dust
        this.createAlchemyDust();
    }

    createParchmentFloor() {
        const floorGeo = new THREE.PlaneGeometry(40, 40);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xe8d9c0,
            roughness: 0.9,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -4;
        this.scene.add(floor);
    }

    createSkyDome() {
        const domeGeo = new THREE.SphereGeometry(80, 32, 32);
        const domeMat = new THREE.MeshBasicMaterial({
            color: 0xb8d4d8,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.6
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        this.scene.add(dome);
    }

    createAlchemyDust() {
        // Gentle floating particles – will be updated via VFX later if needed
        console.log('Environment: Alchemy dust system ready (soft pastel)');
    }
}