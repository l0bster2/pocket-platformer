class EventsTooltipRenderer {
    static renderEventsTooltip(currentObject) {
        const eventsWrapper = document.createElement("div");
        eventsWrapper.className = "bottomSectionDivider";
        eventsWrapper.style.whiteSpace = "normal";
        const existingEvents = this.renderExistingEvents(currentObject);
        const existingEventsWrapper = document.createElement("div");
        existingEventsWrapper.id = "existingEventsWrapper";
        existingEventsWrapper.appendChild(existingEvents);
        eventsWrapper.appendChild(existingEventsWrapper);
        const addEventButton = this.renderAddEventButton(currentObject);
        eventsWrapper.appendChild(addEventButton);
        return eventsWrapper
    }

    static renderExistingEvents(currentObject) {
        const eventsWrapper = document.createElement("div");
        currentObject.events.forEach((event, index) => {
            const eventContent = document.createElement("div");
            eventContent.className = "eventItem";
            eventContent.innerHTML = `
            <div style="flex: 1">${index + 1} ${event.name}</div>
            <div style="margin-right: 4px">
                <img src='images/icons/pencil.svg' onClick='EventHandler.editEvent(${index})' class='singleActionIcon hovereableGreenSvg' alt='colorpicker' width='16' height='16'></img> 
                <img src='images/icons/delete.svg' onClick='EventHandler.removeEvent(event, "${event.id}")' class='singleActionIcon hovereableRedSvg' alt='delete' width='16' height='16'></img>
            </div>
            `
            eventsWrapper.appendChild(eventContent);
        });
        return eventsWrapper;
    }

    static goToSoundView() {
        ModalHandler.closeModal('eventsModal');
        changeView('sounds');
    }

    static renderMusicAttributes(event = null) {
        return `
            <div style="padding: 8px 0;">
                <div class="textAsLink marginTop8" onClick="EventsTooltipRenderer.goToSoundView();">
                <img alt="plus" width="14" height="14" class="blue-filter" src="images/icons/plus.svg"
                        class="iconInButtonWithText"><span style="margin-left: 8px; vertical-align: top;">Upload
                        more music here</span>
                </div>
                <div class="marginTop12">
                <span class="marginTop8">Select song: </span>
                <select name="eventMusic">
                    ${SoundHandler.sounds.flatMap(sound => {
                        if(sound.type !== "music" || sound.key === 'song') {
                            return null;
                        }
                        return `<option value="${sound.key}" ${sound.key === event?.sound ? "selected" : ""}>
                            ${sound.key}</option>`
                        }
                    )
                }
                </select>
                </div>
            </div>
        `
    }

    static renderBackgroundImageAttributes(event = null) {
        return `
            <div style="padding: 8px 0;">
                <span class="marginTop8">Change to: </span>
                <select name="eventBackgroundImage">
                    ${ImageHandler.images.map(image => 
                        `<option value="${image.name}" ${image.name === event?.backgroundImage ? "selected" : ""}>
                        ${image.name}</option>`
                    )
                    }
                </select>
                <div class="marginTop8">
                <span>Size: </span>
                <select name="eventBackgroundImageSize">
                        <option value="stretch" ${event?.backgroundImageSize === "stretch" ? "selected" : ""}>Stretch</option>
                        <option value="original" ${event?.backgroundImageSize === "original" ? "selected" : ""}>Original</option>
                        <option value="fixed" ${event?.backgroundImageSize === "fixed" ? "selected" : ""}>Fixed</option>
                        <option value="horizontalScroll" ${event?.backgroundImageSize === "horizontalScroll" ? "selected" : ""}>Horizontal scroll</option>
                        <option value="verticalScroll" ${event?.backgroundImageSize === "verticalScroll" ? "selected" : ""}>Vertical scroll</option>
                </select>
                </div>
            </div>
        `
    }

    static renderBackgroundColorAttributes(event = null) {
        return `
            <div style="padding: 8px 0;">
                <div>
                    <span class="marginTop8">Change to: </span>
                    <input class="color-input" id="eventBackgroundColor" value="${event?.backgroundColor || "#000000"}" style="padding: 6px; width: 120px" />
                </div>
                <div class="marginTop12">
                    <label for="animationDuration">Animation duration:</label>
                    <input type="range" min="0" max="10" value="${event?.animationDuration || 2}" name="animationDuration" step="0.5" id="animationDuration"
                        onchange="EventsTooltipRenderer.changeBackgroundAnimationDuration(event)">
                    <span id="animationDurationValue">${event?.animationDuration || 2}</span>
                </div>
            </div>
        `
    }

    static changeBackgroundAnimationDuration(event) {
        document.getElementById('animationDurationValue').innerHTML = event.target.value;
    }

    static renderSoundAttributes(event = null) {
        return `
            <div class="flexGap12" style="padding: 8px 0;">
                <span class="marginTop8">Select sound: </span>
                <select name="eventSound">
                    ${SoundHandler.sounds.flatMap(sound => {
                        if(sound.type !== "sound") {
                            return null;
                        }
                        return `<option value="${sound.key}" ${sound.key === event?.sound ? "selected" : ""}>
                            ${sound.descriptiveName}</option>`
                        }
                    )
                }
                </select>
            </div>
        `
    }

    static renderScreenShakeAttributes(event = null) {
        return `
                <div class="flexGap12" style="padding: 8px 0;">
                    <label for="screenshakeIntensity">intensity</label>
                    <input type="range" min="1" max="10" value="${event?.screenshakeIntensity || 2}" name="screenshakeIntensity" step="0.5" id="screenshakeIntensity"
                        onchange="EventsTooltipRenderer.changeScreenshakeIntensity(event)">
                    <span id="screenshakeIntensityValue">${event?.screenshakeIntensity || 2}</span>
                </div>
                <div>
                    <label for="screenshakeDuration">Duration (in frames):</label>
                    <input id="screenshakeDuration" required min="1" step="1" type="number"
                        size="15" value="${event?.screenshakeDuration || 45}" />
                </div>
        `
    }

    static renderAddEventButton(currentObject) {
        const button = document.createElement("button");
        button.className = "fullWidth levelNavigationButton ";
        EventHandler.currentObject = currentObject;

        button.onclick = (e) => {
            e.stopPropagation();
            document.getElementById("eventType").value = "screenshake";
            document.getElementById("eventTypeWrapper").style.display = "block";
            document.getElementById("eventModalForm").innerHTML = this.renderScreenShakeAttributes();
            ModalHandler.showModal('eventsModal');
        };
        button.innerHTML = `
            <div>
                <img src="images/icons/plus.svg" class="iconInButtonWithText" alt="addEvent" width="14" height="14">
                <span>Add event</span>
            </div>`;
        return button;
    }

    static changeScreenshakeIntensity(e) {
        document.getElementById("screenshakeIntensityValue").innerHTML = e.target.value;
    }
}