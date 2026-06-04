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

        // Get all unique enemy types from enemies in the level
        const uniqueEnemies = this.getUniqueEnemies();

        if (uniqueEnemies.length === 0) {
            contentDiv.innerHTML = `<div class="marginTop8">No enemies in level. Add enemies in game-screen first.</div>`;
            return;
        }

        contentDiv.innerHTML = `
            <div class="enemyEditorWrapper">
                <div class="marginTop8 marginBottom16">
                    <label for="enemySelectDropdown">Select enemy:</label>
                    <select id="enemySelectDropdown" class="textInput" onchange="EnemiesAttributesRenderer.onEnemySelected()" style="width: 100%; margin-top: 4px;">
                        ${uniqueEnemies.map((enemy, index) => 
                            `<option value="${index}" data-type="${enemy.type}">${enemy.displayName}</option>`
                        ).join('')}
                    </select>
                </div>
                <hr>
                <div id="enemyDetailsPanel" class="marginTop16"></div>
            </div>
        `;

        // Show details for first enemy
        this.onEnemySelected();
    }

    /**
     * Get unique enemies from current level
     */
    static getUniqueEnemies() {
        if (!tileMapHandler || !tileMapHandler.enemies) return [];
        
        const uniqueEnemies = [];
        const seenTypes = new Set();

        tileMapHandler.enemies.forEach(enemy => {
            const key = `${enemy.type}_${enemy.initialX}_${enemy.initialY}`;
            if (!seenTypes.has(key)) {
                seenTypes.add(key);
                uniqueEnemies.push({
                    type: enemy.type,
                    displayName: this.getEnemyDisplayName(enemy),
                    instance: enemy
                });
            }
        });

        return uniqueEnemies;
    }

    /**
     * Get friendly display name for enemy
     */
    static getEnemyDisplayName(enemy) {
        const typeName = enemy.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${typeName} (${enemy.initialX}, ${enemy.initialY})`;
    }

    /**
     * Handle enemy selection from dropdown
     */
    static onEnemySelected() {
        const dropdown = document.getElementById("enemySelectDropdown");
        const selectedIndex = parseInt(dropdown.value);
        const uniqueEnemies = this.getUniqueEnemies();
        const selectedEnemy = uniqueEnemies[selectedIndex];

        if (selectedEnemy && selectedEnemy.instance) {
            this.renderEnemyDetails(selectedEnemy.instance);
        }
    }

    /**
     * Render detailed editor for specific enemy
     */
    static renderEnemyDetails(enemy) {
        const panel = document.getElementById("enemyDetailsPanel");
        if (!panel) return;

        const spriteIndex = EnemyAnimationHelper.findSpriteIndexByName(enemy, 'idle');
        const idleSprite = enemy.spriteObject[spriteIndex];

        panel.innerHTML = `
            <div class="enemyDetailsContent">
                <!-- Idle Sprite Preview -->
                <div class="marginBottom16">
                    <h3 class="subHeading">Sprite Preview</h3>
                    <div class="enemySpritePreview marginTop8">
                        ${this.createSpritePreviewHTML(idleSprite)}
                    </div>
                </div>

                <!-- Movement Attributes -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Movement Attributes</summary>
                    <div class="detailsContent marginTop8">
                        ${this.createNumberInput('maxSpeed', 'Max Speed', enemy.maxSpeed, 0.5, 10, 0.1, enemy)}
                        ${this.createNumberInput('groundAcceleration', 'Ground Acceleration', enemy.groundAcceleration, 0.1, 2, 0.1, enemy)}
                        ${this.createNumberInput('air_acceleration', 'Air Acceleration', enemy.air_acceleration, 0.1, 2, 0.1, enemy)}
                        ${this.createNumberInput('groundFriction', 'Ground Friction', enemy.groundFriction, 0.1, 1, 0.05, enemy)}
                        ${this.createNumberInput('air_friction', 'Air Friction', enemy.air_friction, 0.1, 1, 0.05, enemy)}
                    </div>
                </details>

                <!-- Enemy Attributes -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Enemy Attributes</summary>
                    <div class="detailsContent marginTop8">
                        ${this.createNumberInput('lives', 'Lives', enemy.lives, 1, 100, 1, enemy)}
                        ${this.createCheckboxInput('canBeStomped', 'Can be stomped', enemy.canBeStomped, enemy)}
                    </div>
                </details>

                <!-- Activation Settings -->
                <details open class="detailsSection marginBottom16">
                    <summary class="subHeading">Activation Settings</summary>
                    <div class="detailsContent marginTop8">
                        <div class="marginBottom12">
                            <label class="labelText">Activate when:</label>
                            <select id="activationSelect" class="textInput" onchange="EnemiesAttributesRenderer.onActivationChanged('${enemy.key}')" style="width: 100%; margin-top: 4px;">
                                ${this.createActivationOptions(enemy.activationConfig)}
                            </select>
                            <input type="number" id="activationValue" class="textInput marginTop4" placeholder="Value (if needed)" 
                                value="${enemy.activationConfig?.value || ''}" 
                                onchange="EnemiesAttributesRenderer.updateActivationConfig('${enemy.key}')">
                        </div>

                        <div>
                            <label class="labelText">Deactivate when:</label>
                            <select id="inactivationSelect" class="textInput" onchange="EnemiesAttributesRenderer.onInactivationChanged('${enemy.key}')" style="width: 100%; margin-top: 4px;">
                                ${this.createInactivationOptions(enemy.inactivationConfig)}
                            </select>
                            <input type="number" id="inactivationValue" class="textInput marginTop4" placeholder="Value (if needed)" 
                                value="${enemy.inactivationConfig?.value || ''}" 
                                onchange="EnemiesAttributesRenderer.updateInactivationConfig('${enemy.key}')">
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
        const pixelSize = 2; // 2px per pixel for visibility
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
    static createNumberInput(id, label, value, min, max, step, enemy) {
        return `
            <div class="marginBottom8">
                <label for="${id}" class="labelText">${label}:</label>
                <input type="number" id="${id}" class="textInput" value="${value}" min="${min}" max="${max}" step="${step}"
                    onchange="EnemiesAttributesRenderer.updateNumberAttribute('${enemy.key}', '${id}', this.value)">
            </div>
        `;
    }

    /**
     * Create checkbox input HTML
     */
    static createCheckboxInput(id, label, checked, enemy) {
        return `
            <div class="marginBottom8">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} 
                    onchange="EnemiesAttributesRenderer.updateCheckboxAttribute('${enemy.key}', '${id}', this.checked)">
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
     * Update number attribute
     */
    static updateNumberAttribute(enemyKey, attributeName, value) {
        const enemy = this.findEnemyByKey(enemyKey);
        if (enemy) {
            enemy[attributeName] = parseFloat(value);
        }
    }

    /**
     * Update checkbox attribute
     */
    static updateCheckboxAttribute(enemyKey, attributeName, checked) {
        const enemy = this.findEnemyByKey(enemyKey);
        if (enemy) {
            enemy[attributeName] = checked;
        }
    }

    /**
     * Handle activation dropdown change
     */
    static onActivationChanged(enemyKey) {
        const select = document.getElementById("activationSelect");
        const valueInput = document.getElementById("activationValue");
        const selected = select.value;

        // Show/hide value input based on selection
        const needsValue = ['afterSeconds', 'playerInDistance', 'playerApproxSameX', 'playerApproxSameY'].includes(selected);
        valueInput.style.display = needsValue ? 'block' : 'none';

        this.updateActivationConfig(enemyKey);
    }

    /**
     * Update activation config
     */
    static updateActivationConfig(enemyKey) {
        const enemy = this.findEnemyByKey(enemyKey);
        if (!enemy) return;

        const select = document.getElementById("activationSelect");
        const valueInput = document.getElementById("activationValue");
        const type = select.value;
        const value = valueInput.value ? parseFloat(valueInput.value) : undefined;

        enemy.activationConfig = value !== undefined ? { type, value } : { type };
    }

    /**
     * Handle inactivation dropdown change
     */
    static onInactivationChanged(enemyKey) {
        const select = document.getElementById("inactivationSelect");
        const valueInput = document.getElementById("inactivationValue");
        const selected = select.value;

        // Show/hide value input based on selection
        const needsValue = ['afterSeconds', 'playerFurtherThanDistance', 'playerNotApproxSameX', 'playerNotApproxSameY'].includes(selected);
        valueInput.style.display = needsValue ? 'block' : 'none';

        this.updateInactivationConfig(enemyKey);
    }

    /**
     * Update inactivation config
     */
    static updateInactivationConfig(enemyKey) {
        const enemy = this.findEnemyByKey(enemyKey);
        if (!enemy) return;

        const select = document.getElementById("inactivationSelect");
        const valueInput = document.getElementById("inactivationValue");
        const type = select.value;
        const value = valueInput.value ? parseFloat(valueInput.value) : undefined;

        enemy.inactivationConfig = value !== undefined ? { type, value } : { type };
    }

    /**
     * Find enemy by key
     */
    static findEnemyByKey(key) {
        if (!tileMapHandler || !tileMapHandler.enemies) return null;
        return tileMapHandler.enemies.find(enemy => enemy.key === key);
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
