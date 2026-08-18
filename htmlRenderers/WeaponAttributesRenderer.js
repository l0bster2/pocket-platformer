class WeaponAttributesRenderer {

    static staticConstructor() {
        this.lastSelectedType = null;
        this.lastWeaponTab = 'attributes';
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
        const sprite = temp?.spriteObject?.[0] ?? null;

        panel.innerHTML = `
            <div class="enemyDetailsContent">
                <div class="marginBottom16">
                    <div class="enemySpritePreview marginTop8">
                        ${this.createSpritePreviewHTML(sprite)}
                    </div>
                </div>
                <div id="weaponTabWrapper" style="display:flex; gap:0; margin-top:8px;">
                    <button id="weapon_tab_attributes" class="levelNavigationButton tabButton buttonWithIconAndText active"
                        onclick="WeaponAttributesRenderer.switchWeaponTab('attributes')">
                        <img src="images/icons/attributes.svg" class="iconInButtonWithText" alt="attributes" width="16" height="16"> Attributes
                    </button>
                    <button id="weapon_tab_general" class="levelNavigationButton tabButton buttonWithIconAndText"
                        onclick="WeaponAttributesRenderer.switchWeaponTab('general')">
                        <img src="images/icons/attack.svg" class="iconInButtonWithText" alt="general" width="16" height="16"> General
                    </button>
                </div>
                <div id="weaponTabContent">
                    <div id="weaponAttributesContent">
                        <div class="detailsContent marginTop8">
                            ${category === 'gun' ? this.renderGunAttributesTab(type, attributes) : this.renderMeleeAttributesTab(type, attributes)}
                        </div>
                    </div>
                    <div id="weaponGeneralContent" style="display:none;">
                        <div class="detailsContent marginTop8">
                            ${category === 'gun' ? this.renderGunGeneralTab(type, attributes) : this.renderMeleeGeneralTab(type, attributes)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.switchWeaponTab(this.lastWeaponTab || 'attributes');
    }

    static switchWeaponTab(tab) {
        const tabs = {
            attributes: { content: document.getElementById('weaponAttributesContent'), button: document.getElementById('weapon_tab_attributes') },
            general:    { content: document.getElementById('weaponGeneralContent'),    button: document.getElementById('weapon_tab_general') },
        };
        if (Object.values(tabs).some(t => !t.content || !t.button)) return;
        this.lastWeaponTab = tab;
        Object.entries(tabs).forEach(([key, t]) => {
            const isActive = key === tab;
            t.content.style.display = isActive ? 'block' : 'none';
            t.button.classList.toggle('active', isActive);
        });
    }

    static createSpritePreviewHTML(sprite) {
        if (!sprite || !sprite.animation || sprite.animation.length === 0) {
            return '<div>No sprite available</div>';
        }
        const firstFrame = sprite.animation[0].sprite;
        const pixelSize = 4;
        const canvasWidth = firstFrame[0].length * pixelSize;
        const canvasHeight = firstFrame.length * pixelSize;
        const html = `<canvas id="weaponSpritePreviewCanvas" width="${canvasWidth}" height="${canvasHeight}" style="border: 1px solid #ccc;"></canvas>`;
        setTimeout(() => {
            const canvas = document.getElementById('weaponSpritePreviewCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            firstFrame.forEach((row, y) => {
                row.forEach((colorHex, x) => {
                    if (colorHex !== 'transp') {
                        ctx.fillStyle = `rgb(${parseInt(colorHex.substring(0,2),16)},${parseInt(colorHex.substring(2,4),16)},${parseInt(colorHex.substring(4,6),16)})`;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                });
            });
        }, 0);
        return html;
    }

    static renderGunAttributesTab(type, attrs) {
        return `
            <div class="playerAttributeWrapper marginTop16">
                <label class="leftLabel">Directions:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'directionAmount', parseInt(this.value))">
                    <option value="2" ${attrs.directionAmount === 2 ? 'selected' : ''}>2 (left / right)</option>
                    <option value="4" ${attrs.directionAmount === 4 ? 'selected' : ''}>4 (cardinal)</option>
                    <option value="8" ${attrs.directionAmount === 8 ? 'selected' : ''}>8 (all)</option>
                </select>
            </div>
            ${this.createSliderInput('bulletLifeSpan', 'Bullet lifespan (frames)', attrs.bulletLifeSpan, 10, 300, 5, type)}
            ${this.createSliderInput('bulletsAtOnce', 'Bullets per shot', attrs.bulletsAtOnce, 1, 10, 1, type)}
            ${this.createSliderInput('interval', 'Shoot interval (s)', attrs.interval, 0.05, 5, 0.05, type)}
            ${this.createSliderInput('speed', 'Bullet speed', attrs.speed, 1, 20, 0.5, type)}
            ${this.createSliderInput('deceleration', 'Bullet deceleration', attrs.deceleration ?? 0, 0, 0.1, 0.005, type)}
            ${this.createSliderInput('randomOffset', 'Random offset (deg)', attrs.randomOffset, 0, 180, 5, type)}
            ${this.createCheckboxInput('affectedByGravity', 'Affected by gravity', attrs.affectedByGravity, type, 'marginTop16')}
            ${attrs.affectedByGravity ? this.createSliderInput('gravity', 'Gravity', attrs.gravity, 0, 2, 0.05, type) : ''}
            ${this.createAmmoSection(type, attrs)}
        `;
    }

    static renderGunGeneralTab(type, attrs) {
        const sounds = (typeof SoundHandler !== 'undefined' && SoundHandler.sounds)
            ? SoundHandler.sounds.filter(s => s.type === 'sound') : [];
        const currentPickup = attrs.pickupSound || 'pickup';
        const wallCollision = attrs.wallCollision ?? 'destroy';
        return `
            <div class="marginTop16">${this.createCheckboxInput('interactsWithSwitches', 'Activates switches on hit', attrs.interactsWithSwitches ?? false, type)}</div>
            ${this.createCheckboxInput('bottomShotBounce', 'Bottom shot bounce', attrs.bottomShotBounce ?? false, type)}
            <div class="playerAttributeWrapper marginTop8">
                <label class="leftLabel">Wall collision:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'wallCollision', this.value)">
                    <option value="destroy" ${wallCollision === 'destroy' ? 'selected' : ''}>Destroy bullet</option>
                    <option value="none" ${wallCollision === 'none' ? 'selected' : ''}>None (phase through)</option>
                    <option value="bounce" ${wallCollision === 'bounce' ? 'selected' : ''}>Bounce off walls</option>
                </select>
            </div>
            <div class="subSection">
            ${this.createSoundDropdown('shootSound', 'Shoot sound', attrs.shootSound ?? null, type)}
            <div class="playerAttributeWrapper marginTop8">
                <label class="leftLabel">Pickup sound:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'pickupSound', this.value)">
                    ${sounds.map(s => `<option value="${s.key}" ${s.key === currentPickup ? 'selected' : ''}>${s.descriptiveName}</option>`).join('')}
                </select>
            </div>
            </div>
        `;
    }

    static renderMeleeAttributesTab(type, attrs) {
        return `
            <div class="playerAttributeWrapper marginTop16">
                <label class="leftLabel">Attack type:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'attackType', this.value)">
                    <option value="piercing" ${attrs.attackType === 'piercing' ? 'selected' : ''}>Piercing (thrust)</option>
                    <option value="slicing" ${attrs.attackType === 'slicing' ? 'selected' : ''}>Slicing (arc sweep)</option>
                </select>
            </div>
            ${this.createSliderInput('reachTiles', 'Reach (tiles)', attrs.reachTiles, 0.5, 4, 0.5, type)}
            ${this.createSliderInput('attackDuration', 'Attack duration (frames)', attrs.attackDuration, 5, 60, 1, type)}
            ${this.createSliderInput('interval', 'Attack interval (s)', attrs.interval, 0.1, 5, 0.1, type)}
        `;
    }

    static renderMeleeGeneralTab(type, attrs) {
        const sounds = (typeof SoundHandler !== 'undefined' && SoundHandler.sounds)
            ? SoundHandler.sounds.filter(s => s.type === 'sound') : [];
        const currentPickup = attrs.pickupSound || 'pickup';
        return `
            ${this.createCheckboxInput('canSliceBullets', 'Can slice bullets', attrs.canSliceBullets ?? true, type, 'marginTop16')}
            ${(attrs.canSliceBullets ?? true) ? this.createCheckboxInput('canPogoOnBullets', 'Can pogo on bullets', attrs.canPogoOnBullets ?? true, type) : ''}
            <div class="playerAttributeWrapper marginTop16">
                <label class="leftLabel">Pickup sound:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', 'pickupSound', this.value)">
                    ${sounds.map(s => `<option value="${s.key}" ${s.key === currentPickup ? 'selected' : ''}>${s.descriptiveName}</option>`).join('')}
                </select>
            </div>
        `;
    }

    static createAmmoSection(type, attrs) {
        const isInfinite = !attrs.ammo;
        const clipSize = typeof attrs.ammo === 'number' ? attrs.ammo : 6;
        const uid = `weapon_ammo_toggle_${type}`;
        return `
            <div class="marginTop16">
                <input type="checkbox" id="${uid}" ${isInfinite ? 'checked' : ''}
                    onchange="WeaponAttributesRenderer.onAmmoToggle('${type}', this.checked)">
                <label for="${uid}" class="checkBoxText">Infinite ammo</label>
            </div>
            ${!isInfinite ? this.createSliderInput('ammo', 'Clip size', clipSize, 1, 100, 1, type) : ''}
            ${!isInfinite ? this.createSliderInput('reloadTime', 'Reload time (s)', attrs.reloadTime ?? 1.5, 0.5, 5, 0.5, type) : ''}
        `;
    }

    static onAmmoToggle(type, checked) {
        const attrs = WeaponTypeAttributesHandler.getAttributes(type);
        const clipSize = typeof attrs.ammo === 'number' ? attrs.ammo : 6;
        // checked = infinite ammo → store false; unchecked = finite → store clip size
        WeaponTypeAttributesHandler.setAttribute(type, 'ammo', checked ? false : clipSize);
        this.renderWeaponTypeDetails(type);
    }

    static onAttributeChanged(type, name, value) {
        WeaponTypeAttributesHandler.setAttribute(type, name, value);
        this.renderWeaponTypeDetails(type);
    }

    static createSliderInput(id, label, value, min, max, step, type, marginClass = 'marginTop8') {
        const display = typeof value === 'number'
            ? (Number.isInteger(value) ? value : parseFloat(value.toFixed(2)))
            : value;
        const uid = `weapon_${id}_${type}`;
        return `
            <div class="playerAttributeWrapper ${marginClass}">
                <label for="${uid}" class="leftLabel">${label}:</label>
                <input class="playerAttrSlider enemyAttrSlider" type="range" min="${min}" max="${max}" step="${step}" value="${value}"
                    id="${uid}" oninput="WeaponAttributesRenderer.updateSlider('${uid}', '${type}', '${id}', this.value)">
                <span id="${uid}_val" class="playerAttrSliderValue">${display}</span>
            </div>
        `;
    }

    static createCheckboxInput(id, label, checked, type, marginClass = 'marginTop8') {
        const uid = `weapon_${id}_${type}`;
        return `
            <div class="${marginClass}">
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

    static createSoundDropdown(id, label, value, type) {
        const sounds = (typeof SoundHandler !== 'undefined' && SoundHandler.sounds)
            ? SoundHandler.sounds.filter(s => s.type === 'sound') : [];
        const current = value || '';
        return `
            <div class="playerAttributeWrapper marginTop8">
                <label class="leftLabel">${label}:</label>
                <select class="textInput" style="flex:1;"
                    onchange="WeaponAttributesRenderer.onAttributeChanged('${type}', '${id}', this.value || null)">
                    <option value="" ${!current ? 'selected' : ''}>None</option>
                    ${sounds.map(s => `<option value="${s.key}" ${s.key === current ? 'selected' : ''}>${s.descriptiveName}</option>`).join('')}
                </select>
            </div>
        `;
    }
}
