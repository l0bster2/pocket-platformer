/**
 * Renderer for enemy attributes editing UI
 */
class EnemiesAttributesRenderer {
    /**
     * Create the main enemy editor overview
     */
    static createEnemyOverview() {
        const contentDiv = document.getElementById("enemiesContent");
        if (!contentDiv) return;

        // All enemy types are always editable, regardless of whether they're placed in the level
        const allTypes = EnemyTypeAttributesHandler.getAllEnemyTypes();

        if (allTypes.length === 0) {
            contentDiv.innerHTML = `<div class="marginTop8">No enemy types available.</div>`;
            return;
        }

        contentDiv.innerHTML = `
            <div class="enemyEditorWrapper">
                <div class="marginTop8 marginBottom16">
                    <label for="enemySelectDropdown">Select enemy type:</label>
                    <select id="enemySelectDropdown" class="textInput" onchange="EnemiesAttributesRenderer.onEnemyTypeSelected()" style="width: 100%; margin-top: 4px;">
                        ${allTypes.map((type) =>
                            `<option value="${type}">${this.getEnemyTypeDisplayName(type)}</option>`
                        ).join('')}
                    </select>
                </div>
                <hr>
                <div id="enemyDetailsPanel" class="marginTop16"></div>
            </div>
        `;

        // Show details for first enemy type
        this.onEnemyTypeSelected();
    }

    /**
     * Get a representative enemy instance for a type (used for the sprite preview).
     * Prefers an instance placed in the level, otherwise creates a temporary one.
     */
    static getInstanceForType(type) {
        if (tileMapHandler && tileMapHandler.enemies) {
            const levelInstance = tileMapHandler.enemies.find(enemy => enemy.type === type);
            if (levelInstance) return levelInstance;
        }
        return EnemyTypeAttributesHandler.createTempInstance(type);
    }

    /**
     * Get friendly display name for an enemy type
     */
    static getEnemyTypeDisplayName(type) {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Handle enemy type selection from dropdown
     */
    static onEnemyTypeSelected() {
        const dropdown = document.getElementById("enemySelectDropdown");
        if (!dropdown) return;
        this.renderEnemyTypeDetails(dropdown.value);
    }

    /**
     * Render detailed editor for a specific enemy type
     */
    static renderEnemyTypeDetails(type) {
        const panel = document.getElementById("enemyDetailsPanel");
        if (!panel) return;

        const attributes = EnemyTypeAttributesHandler.getAttributes(type);
        const instance = this.getInstanceForType(type);

        let idleSprite = null;
        if (instance) {
            const spriteIndex = EnemyAnimationHelper.findSpriteIndexByName(instance, 'idle');
            idleSprite = instance.spriteObject[spriteIndex];
        }

        panel.innerHTML = `
            <div class="enemyDetailsContent">
                <!-- Idle Sprite Preview -->
                <div class="marginBottom16">
                    <div class="enemySpritePreview marginTop8">
                        ${this.createSpritePreviewHTML(idleSprite)}
                    </div>
                </div>

                <!-- Movement Attributes -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Movement Attributes</summary>
                    <div class="detailsContent marginTop8">
                        ${this.createSliderInput('maxSpeed', 'Max Speed', attributes.maxSpeed, 0.5, 10, 0.1, type)}
                        ${this.createSliderInput('groundAcceleration', 'Ground Acceleration', attributes.groundAcceleration, 0.01, 1, 0.01, type)}
                        ${this.createSliderInput('air_acceleration', 'Air Acceleration', attributes.air_acceleration, 0.01, 1, 0.01, type)}
                        ${this.createSliderInput('groundFriction', 'Ground Friction', attributes.groundFriction, 0, 1, 0.01, type)}
                        ${this.createSliderInput('air_friction', 'Air Friction', attributes.air_friction, 0, 1, 0.01, type)}
                    </div>
                </details>

                <!-- Enemy Attributes -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Enemy Attributes</summary>
                    <div class="detailsContent marginTop8">
                        ${this.createNumberInput('lives', 'Lives', attributes.lives, 1, 100, 1, type)}
                        ${this.createCheckboxInput('canBeStomped', 'Can be stomped', attributes.canBeStomped, type)}
                    </div>
                </details>

                <!-- Activation Settings -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Activation Settings</summary>
                    <div class="detailsContent marginTop8">
                        <div class="marginBottom12">
                            <label class="labelText">Activate when:</label>
                            <select id="activationSelect" class="textInput" onchange="EnemiesAttributesRenderer.onActivationChanged('${type}')" style="width: 100%; margin-top: 4px;">
                                ${this.createActivationOptions(attributes.activationConfig)}
                            </select>
                            <input type="number" id="activationValue" class="textInput marginTop4" placeholder="Value (if needed)" 
                                value="${attributes.activationConfig?.value ?? ''}" 
                                onchange="EnemiesAttributesRenderer.updateActivationConfig('${type}')">
                        </div>

                        <div>
                            <label class="labelText">Deactivate when:</label>
                            <select id="inactivationSelect" class="textInput" onchange="EnemiesAttributesRenderer.onInactivationChanged('${type}')" style="width: 100%; margin-top: 4px;">
                                ${this.createInactivationOptions(attributes.inactivationConfig)}
                            </select>
                            <input type="number" id="inactivationValue" class="textInput marginTop4" placeholder="Value (if needed)" 
                                value="${attributes.inactivationConfig?.value ?? ''}" 
                                onchange="EnemiesAttributesRenderer.updateInactivationConfig('${type}')">
                        </div>
                    </div>
                </details>
            </div>
        `;
    }

    /**
     * Create sprite preview HTML
     */
    static createSpritePreviewHTML(sprite) {
        if (!sprite || !sprite.animation || sprite.animation.length === 0) {
            return '<div>No sprite available</div>';
        }

        const firstFrame = sprite.animation[0].sprite;
        const pixelSize = 4; // 4px per pixel for visibility (2x bigger)
        const canvasWidth = 8 * pixelSize;
        const canvasHeight = 8 * pixelSize;

        let html = `<canvas id="spritePreviewCanvas" width="${canvasWidth}" height="${canvasHeight}" style="border: 1px solid #ccc;"></canvas>`;
        
        setTimeout(() => {
            const canvas = document.getElementById("spritePreviewCanvas");
            if (canvas) {
                const ctx = canvas.getContext('2d');
                firstFrame.forEach((row, y) => {
                    row.forEach((colorHex, x) => {
                        if (colorHex !== "transp") {
                            const r = parseInt(colorHex.substring(0, 2), 16);
                            const g = parseInt(colorHex.substring(2, 4), 16);
                            const b = parseInt(colorHex.substring(4, 6), 16);
                            ctx.fillStyle = `rgb(${r},${g},${b})`;
                            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        }
                    });
                });
            }
        }, 0);

        return html;
    }

    /**
     * Create number input HTML
     */
    static createNumberInput(id, label, value, min, max, step, type) {
        return `
            <div class="marginBottom8">
                <label for="${id}" class="labelText">${label}:</label>
                <input type="number" id="${id}" class="textInput" value="${value}" min="${min}" max="${max}" step="${step}"
                    onchange="EnemiesAttributesRenderer.updateNumberAttribute('${type}', '${id}', this.value)">
            </div>
        `;
    }

    /**
     * Create slider input HTML (mirrors player attribute sliders)
     */
    static createSliderInput(id, label, value, min, max, step, type, mapper) {
        // slider value to display — if mapper provided, try to map the actual value to the slider key
        let displayValue = value;
        if (mapper) {
            // Use ObjectsTooltipElementsRenderer helper if available
            displayValue = ObjectsTooltipElementsRenderer.mapValueToKey(value, mapper) || value;
        }

        return `
            <div class="marginBottom8 playerAttributeWrapper">
                <label for="${id}" style="display:block; margin-bottom:6px;">${label}:</label>
                <input class="playerAttrSlider enemyAttrSlider" type="range" min="${min}" max="${max}" value="${displayValue}" step="${step}" id="${id}"
                    oninput="EnemiesAttributesRenderer.updateSliderAttribute('${type}', '${id}', this.value, ${mapper ? 'true' : 'false'})">
                <span id="${id}Value" class="playerAttrSliderValue">${value}</span>
            </div>
        `;
    }

    /**
     * Create checkbox input HTML
     */
    static createCheckboxInput(id, label, checked, type) {
        return `
            <div class="marginBottom8">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} 
                    onchange="EnemiesAttributesRenderer.updateCheckboxAttribute('${type}', '${id}', this.checked)">
                <label for="${id}" class="labelText">${label}</label>
            </div>
        `;
    }

    /**
     * Create activation options
     */
    static createActivationOptions(currentConfig) {
        const options = [
            { value: 'alwaysActive', text: 'Always Active' },
            { value: 'afterSeconds', text: 'After X seconds' },
            { value: 'playerInDistance', text: 'Player in distance' },
            { value: 'canSeePlayer', text: 'Can see player' },
            { value: 'playerApproxSameX', text: 'Player approx same X' },
            { value: 'playerApproxSameY', text: 'Player approx same Y' },
        ];

        return options.map(opt => 
            `<option value="${opt.value}" ${currentConfig?.type === opt.value ? 'selected' : ''}>${opt.text}</option>`
        ).join('');
    }

    /**
     * Create inactivation options
     */
    static createInactivationOptions(currentConfig) {
        const options = [
            { value: 'becomesInactive', text: 'Becomes Inactive' },
            { value: 'neverInactive', text: 'Never Inactive' },
            { value: 'afterSeconds', text: 'After X seconds inactive' },
            { value: 'playerFurtherThanDistance', text: 'Player further than distance' },
            { value: 'notSeeingPlayer', text: 'Not seeing player' },
            { value: 'playerNotApproxSameX', text: 'Player not approx same X' },
            { value: 'playerNotApproxSameY', text: 'Player not approx same Y' },
        ];

        return options.map(opt => 
            `<option value="${opt.value}" ${currentConfig?.type === opt.value ? 'selected' : ''}>${opt.text}</option>`
        ).join('');
    }

    /**
     * Update number attribute for a type
     */
    static updateNumberAttribute(type, attributeName, value) {
        EnemyTypeAttributesHandler.setAttribute(type, attributeName, parseFloat(value));
    }

    /**
     * Update slider attribute for a type
     */
    static updateSliderAttribute(type, attributeName, sliderValue, usesMapper) {
        let value = sliderValue;
        if (usesMapper && ObjectsTooltipElementsRenderer && typeof ObjectsTooltipElementsRenderer.mapKeyToValue === 'function') {
            const mapper = EnemyTypeAttributesHandler.getAttributes(type)[attributeName + "Mapper"] || {};
            const mapped = ObjectsTooltipElementsRenderer.mapKeyToValue(sliderValue, mapper);
            if (mapped !== null && mapped !== undefined) value = mapped;
        }

        // parse numeric values
        const numeric = parseFloat(value);
        const finalValue = isNaN(numeric) ? value : numeric;
        EnemyTypeAttributesHandler.setAttribute(type, attributeName, finalValue);

        // update displayed value
        const displayEl = document.getElementById(attributeName + "Value");
        if (displayEl) {
            displayEl.innerHTML = isNaN(numeric) ? value : (numeric % 1 !== 0 ? numeric.toFixed(2) : numeric);
        }
    }

    /**
     * Update checkbox attribute for a type
     */
    static updateCheckboxAttribute(type, attributeName, checked) {
        EnemyTypeAttributesHandler.setAttribute(type, attributeName, checked);
    }

    /**
     * Handle activation dropdown change
     */
    static onActivationChanged(type) {
        const select = document.getElementById("activationSelect");
        const valueInput = document.getElementById("activationValue");
        const selected = select.value;

        // Show/hide value input based on selection
        const needsValue = ['afterSeconds', 'playerInDistance', 'playerApproxSameX', 'playerApproxSameY'].includes(selected);
        valueInput.style.display = needsValue ? 'block' : 'none';

        this.updateActivationConfig(type);
    }

    /**
     * Update activation config for a type
     */
    static updateActivationConfig(type) {
        const select = document.getElementById("activationSelect");
        const valueInput = document.getElementById("activationValue");
        const activationType = select.value;
        const value = valueInput.value ? parseFloat(valueInput.value) : undefined;

        const config = value !== undefined ? { type: activationType, value } : { type: activationType };
        EnemyTypeAttributesHandler.setAttribute(type, "activationConfig", config);
    }

    /**
     * Handle inactivation dropdown change
     */
    static onInactivationChanged(type) {
        const select = document.getElementById("inactivationSelect");
        const valueInput = document.getElementById("inactivationValue");
        const selected = select.value;

        // Show/hide value input based on selection
        const needsValue = ['afterSeconds', 'playerFurtherThanDistance', 'playerNotApproxSameX', 'playerNotApproxSameY'].includes(selected);
        valueInput.style.display = needsValue ? 'block' : 'none';

        this.updateInactivationConfig(type);
    }

    /**
     * Update inactivation config for a type
     */
    static updateInactivationConfig(type) {
        const select = document.getElementById("inactivationSelect");
        const valueInput = document.getElementById("inactivationValue");
        const inactivationType = select.value;
        const value = valueInput.value ? parseFloat(valueInput.value) : undefined;

        const config = value !== undefined ? { type: inactivationType, value } : { type: inactivationType };
        EnemyTypeAttributesHandler.setAttribute(type, "inactivationConfig", config);
    }

    /**
     * Find sprite index by name in enemy's sprite array
     */
    static findSpriteIndexByName(enemy, searchTerm) {
        return enemy.spriteObject.findIndex(sprite => 
            sprite.descriptiveName && sprite.descriptiveName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}
