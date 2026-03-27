/**
 * ALCHEMY CLASH: AUDIO MANAGER (GDD-ALIGNED)
 * Gentle alchemy lab sounds only – soft bubbling, paper rustle, mystical chimes.
 * Earth-tone / pastel theme. No cyber or neon SFX.
 */

export class AudioManager {
    constructor() {
        this.manifest = {
            'CLICK': 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
            'FUSE': 'https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3',
            'PLACE': 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
            'REVEAL': 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
            'BOOST': 'https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3'
        };

        this.enabled = false;
        this.init();
    }

    init() {
        const unlock = () => {
            this.enabled = true;
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
    }

    play(key, volume = 0.6) {
        if (!this.enabled) return;
        const url = this.manifest[key];
        if (url) {
            const audio = new Audio(url);
            audio.volume = volume;
            audio.play().catch(() => {});
        }
    }
}