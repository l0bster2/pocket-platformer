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
        currentObject.events.forEach(event => {
            const eventContent = document.createElement("div");
            eventContent.className = "eventItem";
            eventContent.innerHTML = event.name;
            eventsWrapper.appendChild(eventContent);
        });
        return eventsWrapper;
    }

    static renderScreenShakeAttributes() {
        return `
                <div class="flexGap12" style="padding: 8px 0;">
                    <label for="screenshakeIntensity">intensity</label>
                    <input type="range" min="1" max="10" value="2" name="screenshakeIntensity" step="0.5" id="screenshakeIntensity"
                        onchange="EventsTooltipRenderer.changeScreenshakeIntensity(event)">
                    <span id="screenshakeIntensityValue">2</span>
                </div>
                <div>
                    <label for="screenshakeDuration">Duration (in frames):</label>
                    <input id="screenshakeDuration" required min="1" step="1" type="number"
                        size="15" value="45" />
                </div>
        `
    }

    static renderAddEventButton(currentObject) {
        const button = document.createElement("button");
        button.className = "fullWidth levelNavigationButton ";
        button.onclick = (e) => {
            e.stopPropagation();
            document.getElementById("eventModalForm").innerHTML = this.renderScreenShakeAttributes(currentObject);
            ModalHandler.showModal('eventsModal');
            EventHandler.currentObject = currentObject;
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