function organizeHand(scene) {
    const slotPositions = [65, 145, 225, 305, 385];
    const handY = 700;

    let cards = scene.children.list.filter(child => child.isPlayerCard && child.active);

    cards.forEach((card, index) => {
        if (index < 5) {
            scene.tweens.add({
                targets: card,
                x: slotPositions[index],
                y: handY,
                duration: 300,
                ease: 'Power2'
            });
        }
    });
}
