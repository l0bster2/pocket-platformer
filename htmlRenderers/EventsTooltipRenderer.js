class EventsTooltipRenderer {
    static renderEventsTooltip(currentObject) {
        const eventsWrapper = document.createElement("div");
        eventsWrapper.className = "bottomSectionDivider";
        eventsWrapper.style.whiteSpace = "normal";
        const existingEvents = this.renderExistingEvents(currentObject);
        eventsWrapper.appendChild(existingEvents);
        const addEventButton = this.renderAddEventButton(currentObject);
        eventsWrapper.appendChild(addEventButton);
        return eventsWrapper
    }

    static renderExistingEvents(currentObject) {
        const eventsWrapper = document.createElement("div");
        currentObject.events.forEach(event => {
            const eventContent = document.createElement("div");
            eventContent.innerHTML = "Hallo";
            eventsWrapper.appendChild(eventContent);
        });
        return eventsWrapper;
    }

    static renderAddEventButton(currentObject) {
        const button = document.createElement("button");
        button.className = "fullWidth levelNavigationButton ";
        button.onclick = (e) => {
            e.stopPropagation();
            EventHandler.currentObject = currentObject;
            ModalHandler.showModal('eventsModal')
        };
        button.innerHTML = `
            <div>
                <img src="images/icons/plus.svg" class="iconInButtonWithText" alt="addEvent" width="14"
                            height="14">
                <span>Add event</span>
            </div>`;
        return button;
    }
}