function createToast(scene, message) {
    let toast = scene.add.container(225, -100);
    let bg = scene.add.rectangle(0, 0, 320, 60, 0xffd700).setAlpha(0.9);
    let txt = scene.add.text(0, 0, message, {
        fontFamily: 'MedievalSharp', fontSize: '18px', color: '#000'
    }).setOrigin(0.5);
    
    toast.add([bg, txt]);
    scene.tweens.add({
        targets: toast,
        y: 100,
        duration: 500,
        ease: 'Back.easeOut',
        yoyo: true,
        hold: 2000,
        onComplete: () => toast.destroy()
    });
}

function updateHUD(scene) {
    scene.hpText.setText(`❤️ HP: ${scene.playerStats.hp}`);
    scene.goldText.setText(`💰 GOLD: ${scene.playerStats.gold}`);
}
