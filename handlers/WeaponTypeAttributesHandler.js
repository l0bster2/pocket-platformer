class WeaponTypeAttributesHandler {

    static getAllWeaponTypes() {
        return Object.keys(ObjectTypes.objectToClass).filter(type => {
            const WeaponClass = ObjectTypes.objectToClass[type];
            return WeaponClass && WeaponClass.prototype instanceof Weapon;
        });
    }

    static createTempInstance(type) {
        const WeaponClass = ObjectTypes.objectToClass[type];
        if (!WeaponClass) return null;
        return new WeaponClass(0, 0, WorldDataHandler.tileSize, type, null, {});
    }

    static getDefaultsForType(type) {
        const temp = this.createTempInstance(type);
        return temp ? temp.getEditableAttributes() : {};
    }

    static getAttributes(type) {
        if (!WorldDataHandler.weaponTypeAttributes) {
            WorldDataHandler.weaponTypeAttributes = {};
        }
        if (!WorldDataHandler.weaponTypeAttributes[type]) {
            WorldDataHandler.weaponTypeAttributes[type] = this.getDefaultsForType(type);
        }
        return WorldDataHandler.weaponTypeAttributes[type];
    }

    static setAttribute(type, name, value) {
        const attributes = this.getAttributes(type);
        attributes[name] = value;
        this.applyToLevel(type);
    }

    static applyToLevel(type) {
        if (!tileMapHandler || !tileMapHandler.weapons) return;
        const attributes = this.getAttributes(type);
        tileMapHandler.weapons
            .filter(w => w.type === type)
            .forEach(w => w.setEditableAttributes(attributes));
        // Also update the weapon if the player is currently holding it
        const player = tileMapHandler.player;
        if (player && player.weapons) {
            player.weapons
                .filter(w => w.type === type)
                .forEach(w => w.setEditableAttributes(attributes));
        }
    }

    static applyToInstance(weapon) {
        if (!weapon) return;
        weapon.setEditableAttributes(this.getAttributes(weapon.type));
    }
}
