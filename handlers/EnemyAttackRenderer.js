/**
 * Renders the "Attack" tab of the enemy editor: attack phases and their bullets, plus the
 * add/edit bullet modal (sprite, speed, gravity, walls, angle picker, random angle offset).
 *
 * Data model (stored per enemy type on EnemyTypeAttributesHandler as `attackPhases`):
 *   attackPhases: [
 *     {
 *       id, startDelay, interval, ammo, infiniteAmmo, reloadTime,
 *       bullets: [
 *         { id, affectedByGravity, gravity, speed, spriteDescriptiveName,
 *           collidesWithWalls, angle, randomAngleOffset, shootInPlayerDirection }
 *       ]
 *     }
 *   ]
 *   phaseChangeMode: 'intervals' | 'seconds' | 'hits'  (how the enemy advances between phases)
 *   phaseChangeValue: number                            (the amount for the chosen mode)
 *
 * There is always at least one phase ("Phase 1"). The actual runtime shooting is handled by
 * EnemyAttackHandler; this class only builds and persists the configuration UI.
 */
class EnemyAttackRenderer {

    static staticConstructor() {
        this.currentType = null;
        this.currentPhaseId = null;
        this.editingBulletId = null;
        this.expandedPhases = null;
        this.anglePickerMoveHandler = null;
        this.anglePickerUpHandler = null;
    }

    /* ----------------------------- data helpers ----------------------------- */

    static createDefaultPhase() {
        return {
            id: TilemapHelpers.makeid(5),
            bullets: [],
            interval: 1,     // seconds between shots
            startDelay: 0,   // seconds before the first shot of the phase
            infiniteAmmo: true,
            ammo: 3,         // shots before a reload is needed
            reloadTime: 2,   // seconds to reload once the ammo is spent
        };
    }

    /**
     * Get the phases of a type, guaranteeing at least one phase exists.
     */
    static getPhases(type) {
        const attributes = EnemyTypeAttributesHandler.getAttributes(type);
        if (!Array.isArray(attributes.attackPhases) || attributes.attackPhases.length === 0) {
            attributes.attackPhases = [this.createDefaultPhase()];
        }
        return attributes.attackPhases;
    }

    static persistPhases(type, phases) {
        EnemyTypeAttributesHandler.setAttribute(type, 'attackPhases', phases);
    }

    /* ------------------------------- rendering ------------------------------ */

    /**
     * Render the whole Attack tab content (all phases + "add phase" button).
     */
    static renderPhases(type) {
        // On (re)selecting a type, default the first phase to open. Keep the tracked open/closed
        // state across in-place re-renders of the same type.
        if (this.currentType !== type || !this.expandedPhases) {
            this.expandedPhases = new Set();
            const firstPhase = this.getPhases(type)[0];
            if (firstPhase) this.expandedPhases.add(firstPhase.id);
        }
        this.currentType = type;
        const phases = this.getPhases(type);
        const phasesHtml = phases.map((phase, index) => this.renderPhase(type, phase, index)).join('');
        return `
            <div id="attackPhasesWrapper">${phasesHtml}</div>
            <div class="subSection">
                <button type="button" class="levelNavigationButton buttonWithIconAndText fullWidth"
                    onclick="EnemyAttackRenderer.addPhase('${type}')">
                    <img src="images/icons/plus.svg" class="iconInButtonWithText" alt="add phase" width="12" height="12"> Add phase
                </button>
                ${this.renderPhaseChangeControl(type)}
            </div>
        `;
    }

    /**
     * Render the "Change phase after" dropdown + value input shown beneath the Add phase button.
     * The unit (intervals / seconds / hits) decides how the enemy advances between phases.
     */
    static renderPhaseChangeControl(type) {
        const attributes = EnemyTypeAttributesHandler.getAttributes(type);
        const mode = attributes.phaseChangeMode || 'intervals';
        const value = attributes.phaseChangeValue ?? 1;
        const isSeconds = mode === 'seconds';
        return `
            <div class="marginTop12">
                <label class="enemySubLabel">Change phase after:</label>
                <div class="phaseChangeRow marginTop4">
                    <input type="number" id="phaseChangeValue_${type}" class="textInput phaseChangeValueInput"
                        min="${isSeconds ? '0.25' : '1'}" step="${isSeconds ? '0.25' : '1'}" value="${value}"
                        onchange="EnemyAttackRenderer.updatePhaseChangeValue('${type}', this.value)">
                    <select id="phaseChangeMode_${type}" class="textInput phaseChangeModeSelect"
                        onchange="EnemyAttackRenderer.onPhaseChangeModeChanged('${type}', this.value)">
                        <option value="intervals" ${mode === 'intervals' ? 'selected' : ''}>intervals</option>
                        <option value="seconds" ${mode === 'seconds' ? 'selected' : ''}>seconds</option>
                        <option value="hits" ${mode === 'hits' ? 'selected' : ''}>times hit</option>
                    </select>
                </div>
            </div>
        `;
    }

    static onPhaseChangeModeChanged(type, mode) {
        EnemyTypeAttributesHandler.setAttribute(type, 'phaseChangeMode', mode);
        const input = document.getElementById(`phaseChangeValue_${type}`);
        if (!input) return;
        if (mode === 'seconds') {
            input.step = '0.25';
            input.min = '0.25';
        } else {
            input.step = '1';
            input.min = '1';
            // Whole-number units: round any fractional seconds value down to a sensible integer.
            const rounded = Math.max(1, Math.round(parseFloat(input.value) || 1));
            input.value = rounded;
            EnemyTypeAttributesHandler.setAttribute(type, 'phaseChangeValue', rounded);
        }
    }

    static updatePhaseChangeValue(type, value) {
        const mode = EnemyTypeAttributesHandler.getAttributes(type).phaseChangeMode || 'intervals';
        let num = parseFloat(value);
        if (isNaN(num)) num = mode === 'seconds' ? 0.25 : 1;
        EnemyTypeAttributesHandler.setAttribute(type, 'phaseChangeValue', num);
    }

    static onPhaseToggle(phaseId, isOpen) {
        if (!this.expandedPhases) this.expandedPhases = new Set();
        if (isOpen) this.expandedPhases.add(phaseId);
        else this.expandedPhases.delete(phaseId);
    }

    /**
     * Render a single phase as a collapsible details/summary element.
     */
    static renderPhase(type, phase, index) {
        const canDelete = index > 0; // Phase 1 can never be removed.
        const isOpen = this.expandedPhases && this.expandedPhases.has(phase.id);
        return `
            <details class="attackPhase" ${isOpen ? 'open' : ''}
                ontoggle="EnemyAttackRenderer.onPhaseToggle('${phase.id}', this.open)">
                <summary class="attackPhaseSummary">
                    <span class="attackPhaseTitle">Phase ${index + 1}</span>
                    ${canDelete ? `<img src="images/icons/delete.svg" alt="delete phase" width="16" height="16"
                        class="singleActionIcon hovereableRedSvg"
                        onclick="event.preventDefault(); event.stopPropagation(); EnemyAttackRenderer.removePhase('${type}', '${phase.id}')">` : ''}
                </summary>
                <div class="attackPhaseBody marginTop8">
                    <div class="attackBulletsSection">
                        ${this.renderBulletList(type, phase)}
                        <button type="button" class="levelNavigationButton buttonWithIconAndText marginTop8"
                            onclick="EnemyAttackRenderer.openBulletModal('${type}', '${phase.id}')">
                            <img src="images/icons/plus.svg" class="iconInButtonWithText" alt="add bullet" width="12" height="12"> Add bullet
                        </button>
                    </div>
                    <div class="subSection">
                        <div>
                            <label class="enemySubLabel">Shoot interval (seconds):</label>
                            <input type="number" class="textInput" min="0.1" max="60" step="0.1" value="${phase.interval}"
                                onchange="EnemyAttackRenderer.updatePhaseAttribute('${type}', '${phase.id}', 'interval', this.value)">
                        </div>
                        <div class="marginTop8">
                            <label class="enemySubLabel">Start delay (seconds):</label>
                            <input type="number" class="textInput" min="0" max="60" step="0.25" value="${phase.startDelay}"
                                onchange="EnemyAttackRenderer.updatePhaseAttribute('${type}', '${phase.id}', 'startDelay', this.value)">
                        </div>
                        <div class="marginTop8">
                            <input type="checkbox" id="infiniteAmmo_${phase.id}" ${phase.infiniteAmmo ? 'checked' : ''}
                                onchange="EnemyAttackRenderer.onInfiniteAmmoChanged('${type}', '${phase.id}', this.checked)">
                            <label for="infiniteAmmo_${phase.id}" class="checkBoxText">Infinite ammo</label>
                        </div>
                        <div class="marginTop8" id="ammoWrapper_${phase.id}" style="display: ${phase.infiniteAmmo ? 'none' : 'block'};">
                            <label class="enemySubLabel">Ammo (shots before reload):</label>
                            <input type="number" class="textInput" min="1" max="999" step="1" value="${phase.ammo}"
                                onchange="EnemyAttackRenderer.updatePhaseAttribute('${type}', '${phase.id}', 'ammo', this.value)">
                        </div>
                        <div class="marginTop8" id="reloadWrapper_${phase.id}" style="display: ${phase.infiniteAmmo ? 'none' : 'block'};">
                            <label class="enemySubLabel">Reload time (seconds):</label>
                            <input type="number" class="textInput" min="0" max="60" step="0.25" value="${phase.reloadTime}"
                                onchange="EnemyAttackRenderer.updatePhaseAttribute('${type}', '${phase.id}', 'reloadTime', this.value)">
                        </div>
                    </div>
                </div>
            </details>
        `;
    }

    /**
     * Render the short overview list of the bullets of a phase (edit + delete per bullet).
     */
    static renderBulletList(type, phase) {
        if (!phase.bullets || phase.bullets.length === 0) {
            return `<div class="enemySubLabel marginTop4">No bullets yet.</div>`;
        }
        const items = phase.bullets.map((bullet, index) => `
            <div class="eventItem">
                <div style="flex: 1">Bullet ${index + 1}</div>
                <div style="margin-right: 4px">
                    <img src='images/icons/pencil.svg' alt='edit' width='16' height='16'
                        class='singleActionIcon hovereableGreenSvg'
                        onclick="EnemyAttackRenderer.openBulletModal('${type}', '${phase.id}', '${bullet.id}')">
                    <img src='images/icons/delete.svg' alt='delete' width='16' height='16'
                        class='singleActionIcon hovereableRedSvg'
                        onclick="EnemyAttackRenderer.removeBullet(event, '${type}', '${phase.id}', '${bullet.id}')">
                </div>
            </div>`).join('');
        return `<div class="marginTop4">${items}</div>`;
    }

    /**
     * Re-render just the Attack tab content in place (after add/remove/edit operations).
     */
    static rerenderAttackTab() {
        const container = document.getElementById("attackTabInner");
        if (container && this.currentType) {
            container.innerHTML = this.renderPhases(this.currentType);
        }
    }

    /* --------------------------- phase operations --------------------------- */

    static addPhase(type) {
        const phases = this.getPhases(type);
        phases.push(this.createDefaultPhase());
        this.persistPhases(type, phases);
        this.rerenderAttackTab();
    }

    static removePhase(type, phaseId) {
        let phases = this.getPhases(type).filter(phase => phase.id !== phaseId);
        if (phases.length === 0) {
            phases = [this.createDefaultPhase()];
        }
        this.persistPhases(type, phases);
        this.rerenderAttackTab();
    }

    static updatePhaseAttribute(type, phaseId, attribute, value) {
        const phases = this.getPhases(type);
        const phase = phases.find(currentPhase => currentPhase.id === phaseId);
        if (!phase) return;
        phase[attribute] = parseFloat(value);
        this.persistPhases(type, phases);
    }

    static onInfiniteAmmoChanged(type, phaseId, checked) {
        const phases = this.getPhases(type);
        const phase = phases.find(currentPhase => currentPhase.id === phaseId);
        if (!phase) return;
        phase.infiniteAmmo = checked;
        this.persistPhases(type, phases);
        const ammoWrapper = document.getElementById(`ammoWrapper_${phaseId}`);
        const reloadWrapper = document.getElementById(`reloadWrapper_${phaseId}`);
        if (ammoWrapper) ammoWrapper.style.display = checked ? 'none' : 'block';
        if (reloadWrapper) reloadWrapper.style.display = checked ? 'none' : 'block';
    }

    /* --------------------------- bullet operations -------------------------- */

    static removeBullet(e, type, phaseId, bulletId) {
        e.stopPropagation();
        const phases = this.getPhases(type);
        const phase = phases.find(currentPhase => currentPhase.id === phaseId);
        if (!phase) return;
        phase.bullets = phase.bullets.filter(bullet => bullet.id !== bulletId);
        this.persistPhases(type, phases);
        this.rerenderAttackTab();
    }

    /**
     * Open the add/edit bullet modal for a given phase. When bulletId is passed the modal is
     * pre-filled with that bullet's values (edit mode).
     */
    static openBulletModal(type, phaseId, bulletId = null) {
        this.currentType = type;
        this.currentPhaseId = phaseId;
        this.editingBulletId = bulletId;

        let bullet = null;
        if (bulletId) {
            const phase = this.getPhases(type).find(currentPhase => currentPhase.id === phaseId);
            bullet = phase?.bullets.find(currentBullet => currentBullet.id === bulletId) || null;
        }

        const heading = document.getElementById("bulletModalHeading");
        if (heading) heading.innerHTML = bulletId ? "Edit bullet" : "Add bullet";

        document.getElementById("bulletModalForm").innerHTML = this.renderBulletForm(bullet);
        ModalHandler.showModal('bulletModal');
        this.updateGravityRowVisibility();
        this.initAnglePicker(bullet?.angle ?? 0);
        this.onDirectionModeChanged();
        const selectedSprite = document.getElementById("bulletSprite");
        if (selectedSprite) this.drawBulletSpritePreview(selectedSprite.value);
    }

    static renderBulletForm(bullet) {
        const affectedByGravity = bullet?.affectedByGravity ?? false;
        const gravity = bullet?.gravity ?? 0.2;
        const speed = bullet?.speed ?? 3;
        const collidesWithWalls = bullet?.collidesWithWalls ?? true;
        const angle = bullet?.angle ?? 0;
        const randomAngleOffset = bullet?.randomAngleOffset ?? 0;
        const shootInPlayerDirection = bullet?.shootInPlayerDirection ?? false;
        const shootDirectlyAtPlayer = bullet?.shootDirectlyAtPlayer ?? false;
        const shootInWalkDirection = bullet?.shootInWalkDirection ?? false;
        let directionMode = 'fixed';
        if (shootDirectlyAtPlayer) directionMode = 'towardsPlayer';
        else if (shootInPlayerDirection) directionMode = 'playerDirection';
        else if (shootInWalkDirection) directionMode = 'walkDirection';
        const spriteName = bullet?.spriteDescriptiveName ?? null;
        const bulletSprites = SpritePixelArrays.getBulletSprites();

        return `
            <div class="marginTop8">
                <label for="bulletSprite" class="labelText">Sprite:</label>
                <div class="bulletSpriteRow">
                    <select id="bulletSprite" name="bulletSprite" class="textInput bulletSpriteSelect"
                        onchange="EnemyAttackRenderer.drawBulletSpritePreview(this.value)">
                        ${bulletSprites.map(sprite =>
                            `<option value="${sprite.descriptiveName}" ${sprite.descriptiveName === spriteName ? 'selected' : ''}>${sprite.descriptiveName}</option>`
                        ).join('')}
                    </select>
                    <canvas id="bulletSpritePreviewCanvas" class="bulletSpritePreview" width="40" height="40"></canvas>
                </div>
            </div>
            <div class="playerAttributeWrapper marginTop12 bulletSpeedWrapper">
                <label for="bulletSpeed" class="bulletSliderLabel">Speed:</label>
                <input class="playerAttrSlider bulletSpeedSlider" type="range" min="0.5" max="10" step="0.05" value="${speed}" id="bulletSpeed" name="bulletSpeed"
                    oninput="EnemyAttackRenderer.updateSliderValue('bulletSpeed')">
                <span id="bulletSpeedValue" class="playerAttrSliderValue">${speed}</span>
            </div>
            <div class="marginTop12">
                <input type="checkbox" id="bulletAffectedByGravity" name="bulletAffectedByGravity" ${affectedByGravity ? 'checked' : ''}
                    onchange="EnemyAttackRenderer.updateGravityRowVisibility()">
                <label for="bulletAffectedByGravity" class="checkBoxText">Affected by gravity</label>
            </div>
            <div class="playerAttributeWrapper marginTop8" id="bulletGravityRow">
                <label for="bulletGravity" class="bulletSliderLabel">Gravity:</label>
                <input class="playerAttrSlider bulletGravitySlider" type="range" min="0" max="2" step="0.01" value="${gravity}" id="bulletGravity" name="bulletGravity"
                    oninput="EnemyAttackRenderer.updateSliderValue('bulletGravity')">
                <span id="bulletGravityValue" class="playerAttrSliderValue">${gravity}</span>
            </div>
            <div class="marginTop12">
                <input type="checkbox" id="bulletCollidesWithWalls" name="bulletCollidesWithWalls" ${collidesWithWalls ? 'checked' : ''}>
                <label for="bulletCollidesWithWalls" class="checkBoxText">Collides with walls</label>
            </div>
            <div class="subSection">
                <div>
                    <label class="labelText">Direction:</label>
                    <select id="bulletDirectionMode" name="bulletDirectionMode" class="textInput" style="width: auto; margin-top: 4px;"
                        onchange="EnemyAttackRenderer.onDirectionModeChanged()">
                        <option value="fixed" ${directionMode === 'fixed' ? 'selected' : ''}>Fixed angle</option>
                        <option value="towardsPlayer" ${directionMode === 'towardsPlayer' ? 'selected' : ''}>Towards player</option>
                        <option value="playerDirection" ${directionMode === 'playerDirection' ? 'selected' : ''}>Player direction (mirrors)</option>
                        <option value="walkDirection" ${directionMode === 'walkDirection' ? 'selected' : ''}>Walk direction (mirrors)</option>
                    </select>
                </div>
                <div id="bulletAngleControls">
                    <label class="labelText marginTop8" style="display:block;">Angle:</label>
                    <div class="angleSection">
                        <div id="anglePickerCircle" class="anglePickerCircle">
                            <div id="anglePickerHand" class="anglePickerHand"></div>
                            <div class="anglePickerCenter"></div>
                        </div>
                        <div class="angleValueWrapper">
                            <input type="number" id="bulletAngle" name="bulletAngle" class="textInput angleInput" min="0" max="359" step="1" value="${angle}"
                                onchange="EnemyAttackRenderer.onAngleInputChanged(this.value)">
                            <span class="angleUnit">°</span>
                        </div>
                    </div>
                </div>
                <div class="playerAttributeWrapper marginTop12">
                    <label for="bulletRandomAngleOffset" class="bulletSliderLabel">Random angle offset:</label>
                    <input class="playerAttrSlider bulletRandomAngleSlider" type="range" min="0" max="360" step="5" value="${randomAngleOffset}" id="bulletRandomAngleOffset" name="bulletRandomAngleOffset"
                        oninput="EnemyAttackRenderer.updateSliderValue('bulletRandomAngleOffset')">
                    <span id="bulletRandomAngleOffsetValue" class="playerAttrSliderValue">${randomAngleOffset}</span>
                </div>
            </div>
        `;
    }

    /**
     * Draw the currently selected bullet sprite into the small preview canvas next to the dropdown.
     */
    static drawBulletSpritePreview(descriptiveName) {
        const canvas = document.getElementById("bulletSpritePreviewCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sprite = SpritePixelArrays.getSpritesByDescrpitiveName(descriptiveName)[0];
        if (!sprite || !sprite.animation || sprite.animation.length === 0) return;

        const frame = sprite.animation[0].sprite;
        const pixelSize = canvas.width / frame.length;
        frame.forEach((row, y) => {
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

    static updateSliderValue(id) {
        const slider = document.getElementById(id);
        const span = document.getElementById(id + "Value");
        if (slider && span) {
            span.innerHTML = slider.value;
        }
    }

    static updateGravityRowVisibility() {
        const checkbox = document.getElementById("bulletAffectedByGravity");
        const row = document.getElementById("bulletGravityRow");
        if (checkbox && row) {
            row.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    static isDirectionalMode() {
        const select = document.getElementById("bulletDirectionMode");
        return !!select && (select.value === 'playerDirection' || select.value === 'walkDirection');
    }

    static clampToLeftHemisphere(degrees) {
        // Valid range is 90–270 (pointing generally left).
        if (degrees >= 90 && degrees <= 270) return degrees;
        return degrees < 90 ? 90 : 270;
    }

    static onDirectionModeChanged() {
        const select = document.getElementById("bulletDirectionMode");
        const controls = document.getElementById("bulletAngleControls");
        if (!select || !controls) return;
        // "Towards player" aims directly at the player — no configured angle is needed.
        controls.style.display = select.value === 'towardsPlayer' ? 'none' : 'block';
        // When a mirroring mode is active, clamp the current angle to the left hemisphere.
        if (this.isDirectionalMode()) {
            const input = document.getElementById("bulletAngle");
            if (input) {
                const clamped = this.clampToLeftHemisphere(this.normalizeDegrees(parseInt(input.value, 10) || 0));
                this.setAngle(clamped);
            }
        }
    }

    static submitBullet(e) {
        e.preventDefault();
        const elements = e.target.elements;
        const bullet = {
            id: this.editingBulletId || TilemapHelpers.makeid(5),
            affectedByGravity: elements.bulletAffectedByGravity.checked,
            gravity: parseFloat(elements.bulletGravity.value),
            speed: parseFloat(elements.bulletSpeed.value),
            spriteDescriptiveName: elements.bulletSprite.value,
            collidesWithWalls: elements.bulletCollidesWithWalls.checked,
            angle: this.normalizeDegrees(parseInt(elements.bulletAngle?.value ?? '0', 10)),
            randomAngleOffset: parseInt(elements.bulletRandomAngleOffset.value, 10) || 0,
            shootDirectlyAtPlayer: elements.bulletDirectionMode.value === 'towardsPlayer',
            shootInPlayerDirection: elements.bulletDirectionMode.value === 'playerDirection',
            shootInWalkDirection: elements.bulletDirectionMode.value === 'walkDirection',
        };

        const phases = this.getPhases(this.currentType);
        const phase = phases.find(currentPhase => currentPhase.id === this.currentPhaseId);
        if (phase) {
            if (this.editingBulletId) {
                const index = phase.bullets.findIndex(currentBullet => currentBullet.id === this.editingBulletId);
                if (index >= 0) phase.bullets[index] = bullet;
            } else {
                phase.bullets.push(bullet);
            }
            this.persistPhases(this.currentType, phases);
        }

        this.editingBulletId = null;
        ModalHandler.closeModal('bulletModal');
        this.rerenderAttackTab();
    }

    /* ------------------------------ angle picker ---------------------------- */

    static normalizeDegrees(degrees) {
        if (isNaN(degrees)) return 0;
        return ((Math.round(degrees) % 360) + 360) % 360;
    }

    /**
     * Wire up the circular angle picker: dragging on the circle sets the angle, and the value is
     * mirrored into (and editable through) the number input.
     */
    static initAnglePicker(initialAngle = 0) {
        const circle = document.getElementById("anglePickerCircle");
        if (!circle) return;

        const updateFromEvent = (event) => {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let degrees = this.normalizeDegrees(Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI);
            if (this.isDirectionalMode()) degrees = this.clampToLeftHemisphere(degrees);
            this.setAngle(degrees);
        };

        // Clean up any listeners left over from a previous modal open.
        this.detachAnglePickerListeners();
        this.anglePickerMoveHandler = (event) => updateFromEvent(event);
        this.anglePickerUpHandler = () => this.detachAnglePickerListeners();

        circle.onmousedown = (event) => {
            event.preventDefault();
            updateFromEvent(event);
            document.addEventListener('mousemove', this.anglePickerMoveHandler);
            document.addEventListener('mouseup', this.anglePickerUpHandler);
        };

        this.setAngle(this.normalizeDegrees(initialAngle));
    }

    static detachAnglePickerListeners() {
        if (this.anglePickerMoveHandler) {
            document.removeEventListener('mousemove', this.anglePickerMoveHandler);
        }
        if (this.anglePickerUpHandler) {
            document.removeEventListener('mouseup', this.anglePickerUpHandler);
        }
    }

    static setAngle(degrees) {
        const hand = document.getElementById("anglePickerHand");
        const input = document.getElementById("bulletAngle");
        if (hand) hand.style.transform = `rotate(${degrees}deg)`;
        if (input) input.value = degrees;
    }

    static onAngleInputChanged(value) {
        let degrees = this.normalizeDegrees(parseInt(value, 10) || 0);
        if (this.isDirectionalMode()) degrees = this.clampToLeftHemisphere(degrees);
        this.setAngle(degrees);
    }
}
