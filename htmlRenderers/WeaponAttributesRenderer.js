class WeaponAttributesRenderer {

    static staticConstructor() {
        this.lastSelectedType = null;
        this.lastSelectedTab = 'general';
    }

    static createWeaponOverview() {
        const contentDiv = document.getElementById('weaponsContent');
        if (!contentDiv) return;

        const allTypes = WeaponTypeAttributesHandler.getAllWeaponTypes();

        if (allTypes.length === 0) {
            contentDiv.innerHTML = `<div class="marginTop8">No weapon types available.</div>`;
            return;
        }

        const selectedType = allTypes.includes(this.lastSelectedType) ? this.lastSelectedType : allTypes[0];

        contentDiv.innerHTML = `
            <div class="marginTop8 marginBottom16">
                <label for="weaponSelectDropdown">Select weapon type:</label>
                <select id="weaponSelectDropdown" class="textInput" onchange="WeaponAttributesRenderer.onWeaponTypeSelected()" style="width: 100%; margin-top: 4px;">
                    ${allTypes.map(type =>
                        `<option value="${type}" ${type === selectedType ? 'selected' : ''}>${this.getWeaponDisplayName(type)}</option>`
                    ).join('')}
                </select>
            </div>
            <hr>
            <div id="weaponDetailsPanel" class="marginTop16"></div>
        `;

        this.onWeaponTypeSelected();
    }

    static getWeaponDisplayName(type) {
        return type.replace('weapon_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    static onWeaponTypeSelected() {
        const dropdown = document.getElementById('weaponSelectDropdown');
        if (!dropdown) return;
        this.renderWeaponTypeDetails(dropdown.value);
    }

    static syncSelectedWeaponType(type) {
        const allTypes = WeaponTypeAttributesHandler.getAllWeaponTypes();
        if (!allTypes.includes(type)) return;
        this.lastSelectedType = type;
        const dropdown = document.getElementById('weaponSelectDropdown');
        if (dropdown && dropdown.value !== type) {
            dropdown.value = type;
            this.onWeaponTypeSelected();
        }
    }

    static openForType(type) {
        if (typeof changeView === 'function') {
            changeView('weapons');
        }
        const dropdown = document.getElementById('weaponSelectDropdown');
        if (dropdown) {
            dropdown.value = type;
            this.onWeaponTypeSelected();
        }
    }

    static renderWeaponTypeDetails(type) {
        const panel = document.getElementById('weaponDetailsPanel');
        if (!panel) return;
        this.lastSelectedType = type;

        const attributes = WeaponTypeAttributesHandler.getAttributes(type);
        const temp = WeaponTypeAttributesHandler.createTempInstance(type);
        const category = temp?.getCategory?.() ?? 'gun';
        const displayName = temp?.getDisplayName?.() ?? this.getWeaponDisplayName(type);
        const attackTabLabel = category === 'gun' ? 'Attack' : 'Melee';

        panel.innerHTML = `
            <div id="weaponTabWrapper" class="marginTop8">
                <button id="weaponTab_general" class="levelNavigationButton tabButton buttonWithIconAndText"
                    onclick="WeaponAttributesRenderer.switchTab('general')">General</button>
                <button id="weaponTab_attack" class="levelNavigationButton tabButton buttonWithIconAndText"
                    onclick="WeaponAttributesRenderer.switchTab('attack')">${attackTabLabel}</button>
            </div>
            <div id="weaponTabContent">
                <div id="weaponTabContent_general">
                    ${this.renderGeneralTab(type, attributes, displayName)}
                </div>
                <div id="weaponTabContent_attack" style="display:none;">
                    ${category === 'gun' ? this.renderGunAttributes(type, attributes) : this.renderMeleeAttributes(type, attributes)}
                </div>
            </div>
        `;

        this.switchTab(this.lastSelectedTab || 'general');
    }

    static switchTab(tab) {
        this.lastSelectedTab = tab;
        ['general', 'attack'].forEach(t => {
            const content = document.getElementById('weaponTabContent_' + t);
            const button = document.getElementById('weaponTab_' + t);
            if (content) content.style.display = t === tab ? '' : 'none';
            if (button) button.classList.toggle('active', t === tab);
        });
    }

    static renderGeneralTab(type, attrs, displayName) {
        const sounds = (typeof SoundHandler !== 'undefined' && SoundHandler.sounds)
            ? SoundHandler.sounds.filter(s => s.type === 'sound')
            : [];
        const currentSound = attrs.pickupSound || 'pickup';
        return `
            <div class="detailsContent marginTop8">
                <div class="playerAttributeWrapper marginTop8">
                    <label class="leftLabel">Name:</label>
                    <span style="flex:1;">${displayName}</span>
                </div>
                <div class="playerAttributeWrapper marginTop8">
                    <label class="leftLabel">Pickup sound:</label>
                    <select class="textInput" style="flex:1;"
                        onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'pickupSound', this.value)">
                        ${sounds.map(s => `<option value="${s.key}" ${s.key === currentSound ? 'selected' : ''}>${s.descriptiveName}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    static renderGunAttributes(type, attrs) {
        return `
            <div class="detailsContent marginTop8">
                ${this.createSliderInput('bulletLifeSpan', 'Bullet Lifespan (frames)', attrs.bulletLifeSpan, 10, 300, 5, type)}
                ${this.createSliderInput('bulletsAtOnce', 'Bullets Per Shot', attrs.bulletsAtOnce, 1, 10, 1, type)}
                ${this.createSliderInput('interval', 'Shoot Interval (s)', attrs.interval, 0.05, 5, 0.05, type)}
                ${this.createAmmoSection(type, attrs)}
                ${this.createSliderInput('speed', 'Bullet Speed', attrs.speed, 1, 20, 0.5, type)}
                ${this.createSliderInput('randomOffset', 'Random Offset (deg)', attrs.randomOffset, 0, 180, 5, type)}
                ${this.createCheckboxInput('affectedByGravity', 'Affected by gravity', attrs.affectedByGravity, type)}
                ${attrs.affectedByGravity ? this.createSliderInput('gravity', 'Gravity', attrs.gravity, 0, 2, 0.05, type) : ''}
                <div class="playerAttributeWrapper marginTop8">
                    <label class="leftLabel">Directions:</label>
                    <select class="textInput" style="flex:1;"
                        onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'directionAmount', parseInt(this.value))">
                        <option value="2" ${attrs.directionAmount === 2 ? 'selected' : ''}>2 (left / right)</option>
                        <option value="4" ${attrs.directionAmount === 4 ? 'selected' : ''}>4 (cardinal)</option>
                        <option value="8" ${attrs.directionAmount === 8 ? 'selected' : ''}>8 (all)</option>
                    </select>
                </div>
            </div>
        `;
    }

    static renderMeleeAttributes(type, attrs) {
        return `
            <div class="detailsContent marginTop8">
                <div class="playerAttributeWrapper marginTop8">
                    <label class="leftLabel">Attack Type:</label>
                    <select class="textInput" style="flex:1;"
                        onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'attackType', this.value)">
                        <option value="piercing" ${attrs.attackType === 'piercing' ? 'selected' : ''}>Piercing (thrust)</option>
                        <option value="slicing" ${attrs.attackType === 'slicing' ? 'selected' : ''}>Slicing (arc sweep)</option>
                    </select>
                </div>
                ${this.createSliderInput('reachTiles', 'Reach (tiles)', attrs.reachTiles, 0.5, 4, 0.5, type)}
                ${this.createSliderInput('attackDuration', 'Attack Duration (frames)', attrs.attackDuration, 5, 60, 1, type)}
                ${this.createSliderInput('interval', 'Attack Interval (s)', attrs.interval, 0.1, 5, 0.1, type)}
            </div>
        `;
    }

    static createAmmoSection(type, attrs) {
        const hasAmmo = !!attrs.ammo;
        const clipSize = typeof attrs.ammo === 'number' ? attrs.ammo : 6;
        const uid = `weapon_ammo_toggle_${type}`;
        return `
            <div class="marginTop8">
                <input type="checkbox" id="${uid}" ${hasAmmo ? 'checked' : ''}
                    onchange="WeaponAttributesRenderer.onAmmoToggle('${type}', this.checked)">
                <label for="${uid}" class="checkBoxText">Has ammo clip (reload after X shots)</label>
            </div>
            ${hasAmmo ? this.createSliderInput('ammo', 'Clip Size', clipSize, 1, 100, 1, type) : ''}
            ${hasAmmo ? this.createSliderInput('reloadTime', 'Reload Time (s)', attrs.reloadTime ?? 1.5, 0.5, 5, 0.5, type) : ''}
        `;
    }

    static onAmmoToggle(type, checked) {
        const attrs = WeaponTypeAttributesHandler.getAttributes(type);
        const clipSize = typeof attrs.ammo === 'number' ? attrs.ammo : 6;
        WeaponTypeAttributesHandler.setAttribute(type, 'ammo', checked ? clipSize : false);
        this.renderWeaponTypeDetails(type);
    }

    static onAttributeChanged(type, name, value) {
        WeaponTypeAttributesHandler.setAttribute(type, name, value);
        this.renderWeaponTypeDetails(type);
    }

    static createSliderInput(id, label, value, min, max, step, type) {
        const display = typeof value === 'number'
            ? (Number.isInteger(value) ? value : parseFloat(value.toFixed(2)))
            : value;
        const uid = `weapon_${id}_${type}`;
        return `
            <div class="playerAttributeWrapper marginTop8">
                <label for="${uid}" class="leftLabel">${label}:</label>
                <input class="playerAttrSlider enemyAttrSlider" type="range" min="${min}" max="${max}" step="${step}" value="${value}"
                    id="${uid}" oninput="WeaponAttributesRenderer.updateSlider('${uid}', '${type}', '${id}', this.value)">
                <span id="${uid}_val" class="playerAttrSliderValue">${display}</span>
            </div>
        `;
    }

    static createCheckboxInput(id, label, checked, type) {
        const uid = `weapon_${id}_${type}`;
        return `
            <div class="marginTop8">
                <input type="checkbox" id="${uid}" ${checked ? 'checked' : ''}
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', '${id}', this.checked)">
                <label for="${uid}" class="checkBoxText">${label}</label>
            </div>
        `;
    }

    static updateSlider(inputId, type, attrName, value) {
        const intAttrs = ['bulletsAtOnce', 'ammo', 'bulletLifeSpan', 'attackDuration', 'directionAmount'];
        const parsed = intAttrs.includes(attrName) ? parseInt(value) : parseFloat(value);
        const span = document.getElementById(inputId + '_val');
        if (span) span.textContent = parsed;
        WeaponTypeAttributesHandler.setAttribute(type, attrName, parsed);
    }
}
