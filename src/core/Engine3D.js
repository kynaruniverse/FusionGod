/**
 * ALCHEMY CLASH: ENGINE3D (GDD-ALIGNED)
 * Gentle earth-tone / pastel alchemy visuals. Soft parchment lighting, no neon/cyber.
 * Simple camera and loop – ready for 3-lane battles.
 */

import * as THREE from 'three';

export class Engine3D {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.vfx = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, -2, 14);
        this.camera.lookAt(0, 0, 0);

        this.setupLighting();
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    setupLighting() {
        const hemi = new THREE.HemisphereLight(0xb8d4d8, 0x8c6f4e, 0.7); // soft pastel sky + earth
        this.scene.add(hemi);

        const ambient = new THREE.AmbientLight(0xe8d9c0, 0.6); // parchment warmth
        this.scene.add(ambient);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setVFX(vfxManager) {
        this.vfx = vfxManager;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();

        if (this.vfx && typeof this.vfx.update === 'function') {
            this.vfx.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}