class EffectsHandler {

    static staticConstructor() {
        this.addEffectButton = document.getElementById("addEffectButton");
        this.existingEffectsEl = document.getElementById("existingEffects");
        this.editingEffects = document.getElementById("editingEffects");
        this.effectTypes = {
            SFXLayer: "SFXLayer",
            Flashlight: "Flashlight",
            BlackAndWhite: "Black and white",
            Noise: "Noise",
            Scanlines: "Scanlines",
            FieldOfView: "Field of view",
        }
        this.defaultAttributeObjects = {
            [this.effectTypes.SFXLayer]: () => { return this.getSfxLayerObject() },
            [this.effectTypes.Flashlight]: () => { return this.getFlashlightObject() },
            [this.effectTypes.Noise]: () => { return this.getNoiseObject() },
            [this.effectTypes.Scanlines]: () => { return this.getScanlinesObject() },
            [this.effectTypes.FieldOfView]: () => { return this.getFieldOfViewObject() },
        };
        this.parsersObject = {
            [this.effectTypes.SFXLayer]: (attributesObject) => { return this.parseSFXLayerValues(attributesObject) },
            [this.effectTypes.Flashlight]: (attributesObject) => { return this.parseFlashlightValues(attributesObject) },
            [this.effectTypes.Noise]: (attributesObject) => { return this.parseNoiseValues(attributesObject) },
            [this.effectTypes.Scanlines]: (attributesObject) => { return this.parseScanlinesValues(attributesObject) },
            [this.effectTypes.FieldOfView]: (attributesObject) => { return this.parseFieldOfViewValues(attributesObject) },
        };
        this.htmlTemplateObject = {
            [this.effectTypes.SFXLayer]: (effectsObject) => { return EffectHtmlRenderer.createSFXLayerTemplate(effectsObject) },
            [this.effectTypes.Flashlight]: (effectsObject) => { return EffectHtmlRenderer.createFlashlightTemplate(effectsObject) },
            [this.effectTypes.Noise]: (effectsObject) => { return EffectHtmlRenderer.createNoiseTemplate(effectsObject) },
            [this.effectTypes.Scanlines]: (effectsObject) => { return EffectHtmlRenderer.createScanlinesTemplate(effectsObject) },
            [this.effectTypes.FieldOfView]: (effectsObject) => { return EffectHtmlRenderer.createFieldOfViewTemplate(effectsObject) },
        }
        this.noiseFlickerIntensities = {
            1: 32,
            2: 16,
            3: 8,
            4: 4,
        }
        this.effectsOrder = [this.effectTypes.Flashlight, this.effectTypes.SFXLayer, this.effectTypes.Noise, this.effectTypes.BlackAndWhite];
    }

    static getBasicAttributes(name) {
        return {
            type: name,
            activeLevels: [
                "allLevels"
            ],
        }
    }

    static getSfxLayerObject() {
        return {
            ...this.getBasicAttributes(this.effectTypes.SFXLayer),
            sfxIndex: 5,
            intensity: 4,
            duration: 60,
            growByStep: 1,
            xSpeed: {
                speedFrom: -2,
                speedTo: 3,
                style: "fromNegativeToPositive"
            },
            ySpeed: {
                speedFrom: 1,
                speedTo: 3,
                style: "fromNegativeToPositive"
            },
            widthDimensions: "full",
            heightDimensions: "full"
        }
    }

    static getFlashlightObject() {
        return {
            ...this.getBasicAttributes(this.effectTypes.Flashlight),
            radius: 140,
            flickerRadius: 4,
            overLayAlpha: 1,
            position: "background",
            color: "#000000",
        }
    }

    static getNoiseObject() {
        return {
            ...this.getBasicAttributes(this.effectTypes.Noise),
            alpha: 0.06,
            flickerIntensity: 3,
        }
    }

    static getScanlinesObject() {
        return {
            ...this.getBasicAttributes(this.effectTypes.Scanlines),
            alpha: 0.1,
            movementSpeed: 0,
        }
    }

    static getFieldOfViewObject() {
        return {
            ...this.getBasicAttributes(this.effectTypes.FieldOfView),
            alpha: 0.3,
            radius: 200,
            color: {
                hex: "#FFFFFF",
                rgb: { r: 255, g: 255, b: 255 },
            }
        }
    }

    static changeTemplate() {
        const value = document.getElementById("templateHandler").value;
        const templateArea = document.getElementById("sfxTemplateSummary");
        const attributesAccordion = document.getElementById("attributesAccordion");

        if (value in this.defaultAttributeObjects) {
            attributesAccordion.style.display = "block";
            templateArea.innerHTML = EffectHtmlRenderer.chooseSfxAttributesTemplate(this.defaultAttributeObjects[value]());
        }
        else {
            attributesAccordion.style.display = "none";
        }
    }

    static removeLayer(index) {
        WorldDataHandler.effects.splice(index, 1);
        tileMapHandler.effects = this.getCurrentLevelEffects(tileMapHandler.currentLevel);
        this.updateExistingSFXSection();
    }

    static updateExistingSFXSection() {
        let sfxSectionHtml = "";
        WorldDataHandler.effects.forEach((effect, index) => {
            let effectName = effect.type === this.effectTypes.SFXLayer ? "Particles" : effect.type;
            sfxSectionHtml += EffectHtmlRenderer.createExistingEffectsSection(effectName, index);
        });
        this.existingEffectsEl.innerHTML = sfxSectionHtml;
    }

    static parseBasicEffectValues(type) {
        let attributesObject = { type: type, activeLevels: [] };
        WorldDataHandler.levels.forEach((_, index) => {
            if (document.getElementById("levelChecked" + index).checked) {
                attributesObject.activeLevels.push(index);
            }
        })
        return attributesObject;
    }

    static parseSFXLayerValues(attributesObject) {
        attributesObject.intensity = 61 - parseInt(document.getElementById("intensity").value) || 4;
        ["sfxIndex", "duration"].forEach(attribute => {
            attributesObject[attribute] = parseInt(document.getElementById(attribute).value) || 0;
        });
        attributesObject.growByStep = parseFloat(document.getElementById("growByStep").value) || 1;
        attributesObject.xSpeed = this.getSFXSpeed("xSpeed");
        attributesObject.ySpeed = this.getSFXSpeed("ySpeed");
        attributesObject.widthDimensions = "full";
        attributesObject.heightDimensions = "full";
        return attributesObject;
    }

    static parseFlashlightValues(attributesObject) {
        attributesObject.radius = parseInt(document.getElementById("radius").value) || 140;
        attributesObject.flickerRadius = parseInt(document.getElementById("flickerRadius").value) || 0;
        attributesObject.overLayAlpha = parseFloat(document.getElementById("overLayAlpha").value) || 1;
        attributesObject.position = document.querySelector('input[name="flashlightPosition"]:checked').value;
        return attributesObject;
    }

    static parseNoiseValues(attributesObject) {
        attributesObject.alpha = parseFloat(document.getElementById("noiseAlpha").value) || 0.07;
        attributesObject.flickerIntensity = parseFloat(document.getElementById("noiseFlickerIntensity").value) || 8;
        return attributesObject;
    }

    static parseScanlinesValues(attributesObject) {
        attributesObject.alpha = parseFloat(document.getElementById("scanlinesAlpha").value) || 0.1;
        attributesObject.movementSpeed = parseFloat(document.getElementById("scanLinesMovementSpeed").value) || 0;
        return attributesObject;
    }

    static parseFieldOfViewValues(attributesObject) {
        attributesObject.alpha = parseFloat(document.getElementById("fieldOfViewAlpha").value) || 0.3;
        attributesObject.radius = parseInt(document.getElementById("fieldOfViewRadius").value) || 200;
        const color = document.getElementById("rayCastingColor").innerHTML || '#FFFFFF';
        const rgbColor = AnimationHelper.hexToRGB(color.replace("#", ""));
        attributesObject.color = {
            hex: color,
            rgb: rgbColor,
        };
        return attributesObject;
    }

    static addEffect(event, index) {
        event.preventDefault();
        const value = document.getElementById("templateHandler").value;
        let attributesObject = this.parseBasicEffectValues(value);
        if (value in this.parsersObject) {
            attributesObject = this.parsersObject[value](attributesObject);
        }
        index !== null ? WorldDataHandler.effects[index] = attributesObject : WorldDataHandler.effects.push(attributesObject);
        tileMapHandler.effects = this.getCurrentLevelEffects(tileMapHandler.currentLevel);
        this.removeEffectTemplate();
        this.updateExistingSFXSection();
        this.existingEffectsEl.style.display = "block";
        this.changeInitialColorModalVisibility();
    }

    static getSFXSpeed(speedId) {
        return {
            speedFrom: parseFloat(document.getElementById(speedId + "From").value) || 0,
            speedTo: parseFloat(document.getElementById(speedId + "To").value) || 0,
            style: "fromNegativeToPositive"
        }
    }

    static cancelEffect() {
        this.removeEffectTemplate();
        this.existingEffectsEl.style.display = "block";
        this.changeInitialColorModalVisibility();
    }

    static changeInitialColorModalVisibility(display = "block") {
        document.getElementById('worldColorsSubmitButton').style.display = display;
        document.getElementById('worldColorModalColorSection').style.display = display;
    }

    static removeEffectTemplate() {
        this.editingEffects.innerHTML = "";
        this.addEffectButton.style.display = "block";
    }

    static addEffectTemplate(index = null) {
        this.addEffectButton.style.display = "none";
        this.existingEffectsEl.style.display = "none";
        this.editingEffects.innerHTML = "";
        const effectTemplate = EffectHtmlRenderer.createEffectTemplate(index);
        this.changeInitialColorModalVisibility("none");
        this.editingEffects.append(effectTemplate);

        const effectType = index !== null ? WorldDataHandler.effects[index].type : this.effectTypes.SFXLayer;
        const attributesAccordion = document.getElementById("attributesAccordion");
        attributesAccordion.style.display = effectType in this.htmlTemplateObject ? "block" : "none";
    }

    static getFlashlightColors(effect, color) {
        effect.color = AnimationHelper.hexToRGB(color)
        const lighterColor = AnimationHelper.lightenDarkenColor(color, 70);
        effect.lighterColor = AnimationHelper.hexToRGB(lighterColor)
    }

    static getCurrentLevelEffects(currentLevel) {
        const currentLevelEffects = WorldDataHandler.effects.filter(effect => {
            return effect.activeLevels.includes(currentLevel);
        });
        currentLevelEffects.forEach(effect => {
            if (effect.type === this.effectTypes.Flashlight) {
                this.getFlashlightColors(effect, currentLevelEffects.some(effect => effect.type === this.effectTypes.BlackAndWhite)
                    ? '000000' : '000000')
            }
            else if (effect.type === this.effectTypes.Noise) {
                effect.flicker = this.noiseFlickerIntensities[effect.flickerIntensity];
            }
        });
        return currentLevelEffects.sort((a, b) => {
            const aOrder = this.effectsOrder.indexOf(a.type);
            const bOrder = this.effectsOrder.indexOf(b.type);
            return aOrder < bOrder ? -1 : 1;
        });;
    }
}