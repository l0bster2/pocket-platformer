class WeaponHandler {

    static update(player) {
        const weapon = player.activeWeapon;
        if (!weapon || player.death) return;

        weapon.tick(player);

        if (weapon.getCategory() === 'melee') {
            if (Controller.attackPressed) weapon.attack(player);
        } else {
            // guns: fire continuously while held
            if (Controller.attackPressed) {
                weapon.attack(player);
            }
        }
    }

    static drawActiveWeapon(player) {
        const weapon = player.activeWeapon;
        if (!weapon || player.death) return;
        weapon.drawOnPlayer(player);
    }
}
