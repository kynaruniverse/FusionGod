/**
 * ALCHEMY CLASH: VFX MANAGER (GDD-ALIGNED)
 * Gentle earth-tone / pastel alchemy effects only. Soft sparkles, smoke, magic dust.
 * No neon, no cyber. Supports createGentleSpark used by DuelManager.
 */

import * as THREE from 'three';

export class VFXManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.textureLoader = new THREE.TextureLoader();
        this.glowTexture = this.createGentleGlowTexture();
    }

    createGentleGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Gentle alchemy spark (used by cards, abilities, lanes)
     */
    createGentleSpark(position, color = 0x8c6f4e, count = 8) {
        const material = new THREE.PointsMaterial({
            map: this.glowTexture,
            color: color,
            size: 0.12,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(new THREE.BufferGeometry(), material);
        points.position.copy(position);

        const velocities = [];
        for (let i = 0; i < count; i++) {
            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.08,
                (Math.random() - 0.5) * 0.08 + 0.03,
                (Math.random() - 0.5) * 0.08
            ));
        }
        points.userData = { velocities, life: 1.0, decay: 0.025 };

        this.scene.add(points);
        this.particles.push(points);
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            const vel = p.userData.velocities;

            for (let j = 0; j < vel.length; j++) {
                p.geometry.attributes.position.array[j * 3] += vel[j].x;
                p.geometry.attributes.position.array[j * 3 + 1] += vel[j].y;
                p.geometry.attributes.position.array[j * 3 + 2] += vel[j].z;
                vel[j].y -= 0.002; // soft gravity
            }
            p.geometry.attributes.position.needsUpdate = true;

            p.userData.life -= p.userData.decay;
            p.material.opacity = p.userData.life;

            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
            }
        }
    }
}