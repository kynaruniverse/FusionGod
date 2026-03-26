const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 450, height: 800
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('card-frame', 'https://labs.phaser.io/assets/sprites/cardBack_red.png');
    this.load.image('fire', 'https://labs.phaser.io/assets/sprites/muzzleflash2.png');
    this.load.image('wolf', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    // 1. Setup Stats & Hand
    this.playerStats = { hp: 100, maxHp: 100, gold: 0, depth: 1 };
    this.discoveredEntries = JSON.parse(localStorage.getItem('fusion_discovery')) || ['fire', 'water', 'wolf'];
    this.slotPositions = [65, 145, 225, 305, 385]; 
    this.handY = 700;

    // 2. Setup HUD (Using ui.js)
    this.hpText = this.add.text(20, 20, '', { fontFamily: 'Orbitron', fontSize: '24px', color: '#ff4b2b' });
    this.goldText = this.add.text(20, 50, '', { fontFamily: 'Orbitron', fontSize: '20px', color: '#ffd700' });
    updateHUD(this);

    // 3. Hand Area & Starting Cards
    this.add.rectangle(225, 700, 400, 150, 0x1a1a1a).setStrokeStyle(2, 0xffd700, 0.5);
    createCard(this, 150, 700, ELEMENT_DATA['fire']);
    createCard(this, 300, 700, ELEMENT_DATA['wolf']);

    // 4. Dungeon Row
    this.dungeonRow = [];
    this.fillDungeonRow = () => {
        const keys = Object.keys(DUNGEON_DATA); // ['slime', 'goblin', 'gold_stash', 'spike_trap']
        
        for (let i = 0; i < 3; i++) {
            if (!this.dungeonRow[i]) {
                let randomKey = keys[Math.floor(Math.random() * keys.length)];
                let data = DUNGEON_DATA[randomKey];
                
                let card = createDungeonCard(this, 100 + (i * 125), -200, data);
                this.dungeonRow[i] = card;
                
                // Slide in animation
                this.tweens.add({
                    targets: card,
                    y: 200,
                    duration: 600,
                    ease: 'Back.easeOut',
                    delay: i * 150
                });
            }
        }
    };

    this.fillDungeonRow();
}

function createCard(scene, x, y, data) {
    let container = scene.add.container(x, y);
    let bg = scene.add.sprite(0, 0, 'card-frame').setScale(1.2);
    let title = scene.add.text(0, 45, data.name, { fontFamily: 'MedievalSharp', fontSize: '22px', color: '#ffd700' }).setOrigin(0.5);
    let stats = scene.add.text(0, 75, `ATK:${data.atk} HP:${data.hp}`, { fontFamily: 'Orbitron', fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    container.add([bg, title, stats]);
    container.setSize(bg.width, bg.height).setInteractive({ draggable: true });
    container.cardData = JSON.parse(JSON.stringify(data)); // Deep copy data
    container.isPlayerCard = true;

    scene.input.setDraggable(container);
    container.on('drag', (p, x, y) => { container.setPosition(x, y); container.setDepth(100); });
    container.on('dragend', () => { 
        container.setDepth(0); 
        if (!checkFusion(scene, container)) organizeHand(scene); 
    });

    scene.time.delayedCall(10, () => organizeHand(scene));
    return container;
}

function checkFusion(scene, draggedCard) {
    let targets = scene.children.list.filter(c => c instanceof Phaser.GameObjects.Container && c !== draggedCard);
    let actionTaken = false;

    targets.forEach(target => {
        if (Phaser.Math.Distance.Between(draggedCard.x, draggedCard.y, target.x, target.y) < 60) {
            if (target.isPlayerCard) { performFusion(scene, draggedCard, target); actionTaken = true; }
            else if (target.isEnemy) {
                if (target.cardData.type === 'enemy') {
                    performBattle(scene, draggedCard, target);
                } else if (target.cardData.type === 'loot') {
                    collectLoot(scene, draggedCard, target);
                } else if (target.cardData.type === 'hazard') {
                    triggerTrap(scene, draggedCard, target);
                }
                actionTaken = true;
            }
        }
    });
    return actionTaken;
}

function performBattle(scene, player, enemy) {
    enemy.cardData.hp -= player.cardData.atk;
    scene.playerStats.hp -= enemy.cardData.atk;
    updateHUD(scene);
    scene.cameras.main.shake(100, 0.01);

    if (enemy.cardData.hp <= 0) {
        scene.playerStats.gold += 10;
        updateHUD(scene);
        enemy.destroy();
        player.destroy();
        scene.time.delayedCall(300, () => scene.fillDungeonRow());
    }
}

function performFusion(scene, cardA, cardB) {
    cardA.disableInteractive(); cardB.disableInteractive();
    scene.tweens.add({
        targets: cardA, x: cardB.x, y: cardB.y, scale: 0.2, duration: 200,
        onComplete: () => {
            const prefix = FUSION_NAMES.prefixes[cardA.cardData.id] || "Mystic";
            const suffix = FUSION_NAMES.suffixes[cardB.cardData.id] || "Entity";
            const newName = `${prefix} ${suffix}`;
            
            const newStats = {
                id: 'hybrid', name: newName,
                atk: cardA.cardData.atk + cardB.cardData.atk,
                hp: cardA.cardData.hp + cardB.cardData.hp
            };

            cardA.destroy(); cardB.destroy();
            let res = createCard(scene, cardB.x, cardB.y, newStats);
            unlockDiscovery(scene, newName.toLowerCase().replace(/\s/g, '_'), newName);
        }
    });
}

function createDungeonCard(scene, x, y, data) {
    let container = scene.add.container(x, y);
    let bg = scene.add.rectangle(0, 0, 100, 140, 0x330000).setStrokeStyle(2, 0xff0000);
    let nameText = scene.add.text(0, -40, data.name, { fontSize: '14px', fontFamily: 'MedievalSharp' }).setOrigin(0.5);
    let hpText = scene.add.text(0, 20, `HP: ${data.hp}`, { fontSize: '18px', color: '#ff0000' }).setOrigin(0.5);
    container.add([bg, nameText, hpText]);
    container.cardData = JSON.parse(JSON.stringify(data));
    container.isEnemy = true;
    return container;
}

function collectLoot(scene, playerCard, lootCard) {
    const amount = lootCard.cardData.gold || 10;
    scene.playerStats.gold += amount;
    
    // AAA Visual: Floating text for gold
    createToast(scene, `💰 +${amount} Gold!`);
    updateHUD(scene);

    lootCard.destroy();
    playerCard.destroy(); // Card is "used" to collect the loot
    scene.time.delayedCall(300, () => scene.fillDungeonRow());
}

function triggerTrap(scene, playerCard, trapCard) {
    const dmg = trapCard.cardData.damage || 10;
    scene.playerStats.hp -= dmg;
    
    // AAA Visual: Red flash and shake
    scene.cameras.main.flash(200, 150, 0, 0); 
    createToast(scene, `⚠️ TRAP! -${dmg} HP`);
    updateHUD(scene);

    trapCard.destroy();
    playerCard.destroy(); // Card sacrificed to bypass trap
    
    if (scene.playerStats.hp <= 0) {
        alert("Killed by a trap!");
        location.reload();
    } else {
        scene.time.delayedCall(300, () => scene.fillDungeonRow());
    }
}

function update() {}
