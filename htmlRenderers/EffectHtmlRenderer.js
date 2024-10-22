class EffectHtmlRenderer {

    static createExistingEffectsSection(effectName, index) {
        return `<div class='effectItem'> 
            <div style="flex: 1">${index + 1} ${effectName}</div>
            <div style="margin-right: 4px">
                <img src='images/icons/pencil.svg' onClick='EffectsHandler.addEffectTemplate(${index})' class='singleActionIcon hovereableGreenSvg' alt='colorpicker' width='16' height='16'></img> 
                <img src='images/icons/delete.svg' onClick='EffectsHandler.removeLayer(${index})' class='singleActionIcon hovereableRedSvg' alt='delete' width='16' height='16'></img>
            </div>
            </div>`;
    }

    static createEffectsSelect(effectsObject) {
        return Object.entries(EffectsHandler.effectTypes).map(([_, value]) => {
            return `<option value="${value}" ${effectsObject.type === value && "selected"}>
           ${value === EffectsHandler.effectTypes.SFXLayer ? "Particles" : value}</option>`
        });
    }

    static createLevelSelectCheckboxes(effectIndex, activeLevels) {
        let result = "";
        WorldDataHandler.levels.forEach((_, index) => {
            let text = `Level ${index}`;
            if (index === 0) {
                text = "Start screen";
            }
            if (index === WorldDataHandler.levels.length - 1) {
                text = "End screen"
            }
            // If new effect created, select all checkboxes by expect start and finish by default. Otherwise check where checked by user
            const checkCheckbox = (effectIndex === null && index !== 0 && index !== WorldDataHandler.levels.length - 1) ||
                activeLevels.includes(index);
            result += `<div class="marginTop4">
                <input type="checkbox" id="levelChecked${index}" 
                ${checkCheckbox ? "checked" : ""}>
                <label for="levelChecked${index}" class="checkBoxText">${text}</label>
            </div>`;
        })
        return result;
    }

    static createSFXLayerTemplate(effectsObject) {
        const frequencyMax = 61;
        const frequencyValue = frequencyMax - effectsObject.intensity;
        const frequency = this.createAttributeSlider({
            name: "Frequency", id: "intensity", flex: 1,
            value: frequencyValue, min: 1, max: frequencyMax - 1, step: 1
        });
        const duration = this.createAttributeSlider({
            name: "Duration", id: "duration", flex: 1,
            value: effectsObject.duration, min: 1, max: 240, step: 1
        });
        const growth = this.createAttributeSlider({
            name: "Growth", id: "growByStep", flex: 1,
            value: effectsObject.growByStep, min: 1, max: 10, step: 0.1
        });
        const xMinmax = this.createAttributeSliderWith2Handles(
            {
                name: "x-speed", id: "xSpeedFrom",
                value: effectsObject.xSpeed.speedFrom, min: -6, max: 6, step: 0.1
            },
            {
                name: "x-speed", id: "xSpeedTo",
                value: effectsObject.xSpeed.speedTo, min: -6, max: 6, step: 0.1
            }
        );
        const yMinmax = this.createAttributeSliderWith2Handles(
            {
                name: "y-speed", id: "ySpeedFrom",
                value: effectsObject.ySpeed.speedFrom, min: -6, max: 6, step: 0.1
            },
            {
                name: "y-speed", id: "ySpeedTo",
                value: effectsObject.ySpeed.speedTo, min: -6, max: 6, step: 0.1
            }
        );

        return `
        <div class="sfxAttributeSection">
            Sprite:  
            <select id="sfxIndex">
                <option value="5" ${effectsObject.sfxIndex === 5 && "selected"}>SFX 5</option>
                <option value="6" ${effectsObject.sfxIndex === 6 && "selected"}>SFX 6</option>
                <option value="7" ${effectsObject.sfxIndex === 7 && "selected"}>SFX 7</option>
            </select> 
            ${frequency}
            ${duration}
            ${growth}
            <div>${xMinmax}</div>
            <div>${yMinmax}</div>
        </div>`;
    };

    static changeAttributeWithSlider(event) {
        document.getElementById(event.target.name + "sliderValue").innerHTML = event.target.value;
    }

    static changeAttributeWith2Sliders(event) {
        const parent = event.target.parentElement;
        var slides = parent.getElementsByTagName("input");
        const sliderValues = MathHelpers.sortNumbers([parseFloat(slides[0].value), parseFloat(slides[1].value)]);
        this.setSliderValueFor2Slider(event.target.name, sliderValues, slides[0].min, slides[0].max);
        document.getElementById(event.target.name + "sliderValue").innerHTML = sliderValues[0] + "/" + sliderValues[1];
    }

    static setSliderValueFor2Slider(sliderName, sliderValues, min, max) {
        const range = document.getElementById(sliderName + "Selected");
        const totalValue = Math.abs(min) + Math.abs(max);
        const maxValue = parseFloat(max);
        const startValueInSlider = sliderValues[0] < 0 ?
            maxValue - Math.abs(sliderValues[0]) : Math.abs(sliderValues[0]) + maxValue;
        const endValueInSlider = sliderValues[1] < 0 ?
            maxValue - Math.abs(sliderValues[1]) : Math.abs(sliderValues[1]) + maxValue;
        range.style.left = (parseFloat(startValueInSlider) / totalValue) * 100 + "%";
        range.style.right = 100 - (parseFloat(endValueInSlider) / totalValue) * 100 + "%";
    }

    static createAttributeSlider(attributeObject) {
        return `
            <div class="changeableEffectAttributeWrapper">
                <label for="${attributeObject.name}" class="effectAttributeDesc">${attributeObject.name}: </label>
                <input class="effectAttributeInput" type="range" min="${attributeObject.min}" max="${attributeObject.max}"
                    name="${attributeObject.name}" value="${attributeObject.value}" step="${attributeObject.step}"
                    id="${attributeObject.id}" onchange="EffectHtmlRenderer.changeAttributeWithSlider(event)"
                    style="flex: ${attributeObject?.flex || "initial"}">
                </input>
                <span class="effectSliderValue" id="${attributeObject.name + "sliderValue"}">${attributeObject.value}</span>
            </div>
        `
    }

    static createColorSelection(attributeObject) {
        window.setTimeout(() => {
            const huebeeProperties = Helpers.getHuebeeDefaultProperties();
            const editableNewColorSection = new Huebee("." + attributeObject.name, {
                ...huebeeProperties
            });
            editableNewColorSection.on('change', () => {
                editableNewColorSection.close();
            });
            editableNewColorSection.setColor(attributeObject.hex);
        }, 50);
        return `
            <div class="marginTop8">
                <span class="colorModalAttribute">Color:</span>
                <button type="button" id="${attributeObject.id}" class="${attributeObject.name} buttonWithIconAndText" 
                value="${attributeObject.hex}"/>
            </div>
        `
    }

    static createAttributeSliderWith2Handles(attributeObject1, attributeObject2) {
        const sliderValues = MathHelpers.sortNumbers([attributeObject1.value, attributeObject2.value])
        setTimeout(() => {
            this.setSliderValueFor2Slider(attributeObject1.name, sliderValues, attributeObject1.min, attributeObject1.max);
        }, "100");

        return `
            <div class="changeableEffectAttributeWrapper">
                <label for="${attributeObject1.name}" class="effectAttributeDesc">${attributeObject1.name}: </label>
                <div style="width: 200px; margin: 12px 14px;">
                    <div class="rangeSlider2HandlesWrapper-slider">
                        <span class="rangeSlider2HandlesWrapper-selected" id="${attributeObject1.name}Selected"></span>
                    </div>
                    <div class="rangeSlider2HandlesWrapper">
                        <input class="rangeSlider2HandlesWrapperInput" type="range" min="${attributeObject1.min}" max="${attributeObject1.max}"
                        name="${attributeObject1.name}" value="${attributeObject1.value}" step="${attributeObject1.step}"
                        id="${attributeObject1.id}" onchange="EffectHtmlRenderer.changeAttributeWith2Sliders(event)">
                        </input>
                        <input class="rangeSlider2HandlesWrapperInput" type="range" min="${attributeObject2.min}" max="${attributeObject2.max}"
                        name="${attributeObject2.name}" value="${attributeObject2.value}" step="${attributeObject2.step}"
                        id="${attributeObject2.id}" onchange="EffectHtmlRenderer.changeAttributeWith2Sliders(event)">
                        </input>
                    </div>
                </div>
                <span class="effectSliderValue" id="${attributeObject1.name + "sliderValue"}">
                    ${sliderValues[0]}/${sliderValues[1]}
                </span>
            </div>
        `
    }

    static createFlashlightTemplate(effectsObject) {
        const radius = this.createAttributeSlider({
            name: "Radius", id: "radius", flex: "1",
            value: effectsObject.radius, min: 20, max: 300, step: 1
        });
        const flickerRadius = this.createAttributeSlider({
            name: "Flicker", id: "flickerRadius", flex: "1",
            value: effectsObject.flickerRadius, min: 0, max: 30, step: 1
        });
        const overLayAlpha = this.createAttributeSlider({
            name: "Overlay-Alpha", id: "overLayAlpha", flex: "1",
            value: effectsObject.overLayAlpha || 1, min: 0.2, max: 1, step: 0.1
        });
        return `<div class="sfxAttributeSection">
            ${radius}
            ${flickerRadius}
            ${overLayAlpha}
            <div style="line-height: 22px" class="subSection">
                <input type="radio" id="background" name="flashlightPosition" value="background" ${effectsObject.position === "background" && "checked"}>
                <label for="background" style="vertical-align: text-bottom">Background</label><br>
                <input type="radio" id="foreground" name="flashlightPosition" value="foreground" ${effectsObject.position === "foreground" && "checked"}>
                <label for="foreground" style="vertical-align: text-bottom">Foreground</label>
            </div>
        </div>`;
    };

    static createNoiseTemplate(effectsObject) {
        const flickerIntensity = this.createAttributeSlider({
            name: "Flicker", id: "noiseFlickerIntensity",
            value: effectsObject.flickerIntensity, min: 1, max: 4, step: 1
        })
        const alpha = this.createAttributeSlider({
            name: "Alpha", id: "noiseAlpha",
            value: effectsObject.alpha, min: 0.01, max: 0.20, step: 0.01
        })
        return `<div class="sfxAttributeSection">
            ${flickerIntensity}
            ${alpha}
        </div>`;
    }

    static createScanlinesTemplate(effectsObject) {
        const alpha = this.createAttributeSlider({
            name: "Alpha", id: "scanlinesAlpha",
            value: effectsObject.alpha, min: 0.02, max: 0.2, step: 0.02
        })
        const movementSpeed = this.createAttributeSlider({
            name: "Movement speed", id: "scanLinesMovementSpeed",
            value: effectsObject.movementSpeed, min: 0, max: 3, step: 1
        })
        return `<div class="sfxAttributeSection">
            ${movementSpeed}
            ${alpha}
        </div>`;
    }

    static createFieldOfViewTemplate(effectsObject) {
        const alpha = this.createAttributeSlider({
            name: "Alpha", id: "fieldOfViewAlpha",
            value: effectsObject.alpha, min: 0.1, max: 0.5, step: 0.02
        })
        const movementSpeed = this.createAttributeSlider({
            name: "Radius", id: "fieldOfViewRadius",
            value: effectsObject.radius, min: 100, max: 400, step: 10
        });
        const colorSelection = this.createColorSelection({
            name: "RayCastingColor", hex: effectsObject.color.hex, id: "rayCastingColor"
        });
        return `<div class="sfxAttributeSection">
            ${movementSpeed}
            ${alpha}
            ${colorSelection}
        </div>`;
    }

    static chooseSfxAttributesTemplate(effectsObject) {
        if (effectsObject.type in EffectsHandler.htmlTemplateObject) {
            return EffectsHandler.htmlTemplateObject[effectsObject.type](effectsObject);
        }
    }

    static createEffectTemplate(index = null) {
        const effectsObject = index === null ? EffectsHandler.getSfxLayerObject() : WorldDataHandler.effects[index];
        const template = Object.assign(
            document.createElement(`p`),
            {
                innerHTML: `       
                <div class="marginTop8" id="sfxTemplate">
                    <form onsubmit="EffectsHandler.addEffect(event, ${index})">
                        <select style="margin-right: -2px; display: ${index === null ? 'block' : 'none'}" onChange="EffectsHandler.changeTemplate()" id="templateHandler">
                            ${this.createEffectsSelect(effectsObject)}
                        </select>
                        <details class="marginTop4">
                            <summary class="sfxTemplateSummary">Select levels</summary>
                            <div class="sfxTemplateSection">
                                <div style="display: grid; grid-template-columns: auto auto;">
                                    ${this.createLevelSelectCheckboxes(index, effectsObject.activeLevels)}
                                </div>
                            </div>
                        </details>
                        <details id="attributesAccordion" open>
                            <summary class="sfxTemplateSummary">Adjust attributes</summary>
                            <div id="sfxTemplateSummary" class="sfxAttributeSection">
                                ${this.chooseSfxAttributesTemplate(effectsObject)}
                            </div>
                        </details>
                        <div class="marginTop8 subSection flexGap8">
                            <button class="levelNavigationButton" type="submit" style="flex: 1">${index != null ? "Apply changes" : "Add effect"}</button>
                            <button class="levelNavigationButton secondaryButton" style="flex: 1"
                            onclick="event.preventDefault(); EffectsHandler.cancelEffect();">Cancel</button>
                        </div>
                    </form>
                </div>`,
            });
        return template;
    }
}