class EventHandler {
    static staticConstructor() {
        this.currentObject = null;
        this.editingEventIndex = null;
    }

    static changeEventType(eventType, currentEvent = null) {
        switch (eventType) {
            case "screenshake":
                document.getElementById("eventModalForm").innerHTML = EventsTooltipRenderer.renderScreenShakeAttributes(currentEvent);
                break;
            case "background-image":
                document.getElementById("eventModalForm").innerHTML = EventsTooltipRenderer.renderBackgroundImageAttributes(currentEvent);
                break;
            default:
                console.log('Did not find event');
        }
    }

    static createNewEvent(type, extraAttributes) {
        const newEvent = {
            name: type,
            id: TilemapHelpers.makeid(5),
            type,
            ...extraAttributes,
        }
        return newEvent;
    }

    static editEvent(index) {
        const currentEvent = this.currentObject.events[index];
        this.editingEventIndex = index;
        document.getElementById("eventTypeWrapper").style.display = "none";
        this.changeEventType(currentEvent.type, currentEvent)
        ModalHandler.showModal('eventsModal');
    }

    static removeEvent(e, eventId) {
        e.stopPropagation();
        const updatedEvents = this.currentObject.events.filter(event => event.id !== eventId);
        this.currentObject.events = [...updatedEvents];
        const objectToEditInWorldData = WorldDataHandler.levels[tileMapHandler.currentLevel].levelObjects.find(levelObject =>
            levelObject.x === this.currentObject.initialX && levelObject.y === this.currentObject.initialY && levelObject.type === ObjectTypes.EVENT_TRIGGER
        );
        objectToEditInWorldData.extraAttributes.events = updatedEvents;
        this.rerenderExistingEvents();
    }

    static rerenderExistingEvents() {
        const existingEvents = EventsTooltipRenderer.renderExistingEvents(this.currentObject);
        const existingEventsWrapper = document.getElementById("existingEventsWrapper");
        existingEventsWrapper.innerHTML = '';
        existingEventsWrapper.appendChild(existingEvents);
    }

    static handleEventSubmit(newEvent) {
        const eventTypeSelectVisibility = document.getElementById("eventTypeWrapper").style.display;
        if (eventTypeSelectVisibility === "none") {
            const objectInWorldData = WorldDataHandler.levels[tileMapHandler.currentLevel].levelObjects.find(levelObject =>
                levelObject.x === this.currentObject.initialX && levelObject.y === this.currentObject.initialY &&
                levelObject.type === ObjectTypes.EVENT_TRIGGER
            );
            this.currentObject.events[this.editingEventIndex] = newEvent;
            objectInWorldData.extraAttributes.events[this.editingEventIndex] = newEvent;
        }
        else {
            this.currentObject.addChangeableAttribute("events", [...this.currentObject.events, newEvent]);
        }
    }

    static submitEvent(e) {
        e.preventDefault();
        const attributes = e.target?.elements;
        const eventType = attributes?.eventType?.value;
        switch (eventType) {
            case "screenshake":
                const additionalScreenshakeAttributes = {
                    screenshakeIntensity: parseFloat(attributes.screenshakeIntensity.value),
                    screenshakeDuration: parseInt(attributes.screenshakeDuration.value),
                }
                const newScreenshakeEvent = this.createNewEvent("screenshake", additionalScreenshakeAttributes, this.currentObject);
                this.handleEventSubmit(newScreenshakeEvent);
                break;
            case "background-image":
                const additionalBackgroundImageAttributes = {
                    backgroundImage: attributes.eventBackgroundImage.value,
                }
                const newBackgroundImageEvent = this.createNewEvent("background-image", additionalBackgroundImageAttributes, this.currentObject);
                this.handleEventSubmit(newBackgroundImageEvent);
                break;
            default:
                console.log('Did not find event');
        }
        this.rerenderExistingEvents();
        ModalHandler.closeModal('eventsModal');
    }
}