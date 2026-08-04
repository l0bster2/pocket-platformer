class WeaponInventoryRenderer {

    static render() {
        const container = document.getElementById('weaponInventoryList');
        if (!container) return;

        const allTypes = new Set();
        (WorldDataHandler.levels || []).forEach(level => {
            (level.weapons || []).forEach(w => allTypes.add(w.type));
        });
        (player.weapons || []).forEach(w => allTypes.add(w.type));

        if (allTypes.size === 0) {
            container.innerHTML = '<div class="marginTop4" style="color:#888;font-size:12px">No weapons placed in any level.</div>';
            return;
        }

        container.innerHTML = [...allTypes].map(type => {
            const held = player.weapons.some(w => w.type === type);
            const name = type.replace('weapon_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<div class="marginTop4">
                <input type="checkbox" id="weaponInv_${type}" ${held ? 'checked' : ''}
                    onchange="WeaponInventoryRenderer.onToggle('${type}', this.checked)">
                <label for="weaponInv_${type}" class="checkBoxText">${name}</label>
            </div>`;
        }).join('');
    }

    static onToggle(type, shouldHold) {
        if (shouldHold) {
            if (!player.weapons.some(w => w.type === type)) {
                const instance = WeaponTypeAttributesHandler.createTempInstance(type);
                if (instance) {
                    WeaponTypeAttributesHandler.applyToInstance(instance);
                    player.weapons.push(instance);
                }
            }
            // treat all world instances as already picked up
            tileMapHandler.weapons = tileMapHandler.weapons.filter(w => w.type !== type);
        } else {
            const idx = player.weapons.findIndex(w => w.type === type);
            if (idx !== -1) {
                player.weapons.splice(idx, 1);
                if (player.activeWeaponIndex >= player.weapons.length) {
                    player.activeWeaponIndex = Math.max(0, player.weapons.length - 1);
                }
            }
            // restore world instances for the current level
            const level = WorldDataHandler.levels[tileMapHandler.currentLevel];
            (level?.weapons || []).forEach(w => {
                if (w.type !== type) return;
                const alreadyInWorld = tileMapHandler.weapons.some(
                    tw => tw.initialX === w.x && tw.initialY === w.y
                );
                if (!alreadyInWorld) {
                    const instance = new ObjectTypes.objectToClass[type](
                        w.x, w.y, tileMapHandler.tileSize, type, tileMapHandler, w.extraAttributes || {}
                    );
                    WeaponTypeAttributesHandler.applyToInstance(instance);
                    tileMapHandler.weapons.push(instance);
                }
            });
        }
        WorldDataHandler.pickedUpWeaponTypes = new Set(player.weapons.map(w => w.type));
    }
}
