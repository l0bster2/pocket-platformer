class EventHandler {
    static staticConstructor() {
        this.currentObject = null;
    }

    static changeEventType(value) {

    }

    static createNewEvent(type, extraAttributes) {
        const newEvent = {
            name: this.currentObject.events.length + 1 + ` ${type}`,
            type,
            ...extraAttributes,
        }
        return newEvent;
    }

    static submitEvent(e) {
        e.preventDefault();
        const attributes =  e.target?.elements;
        const eventType = attributes?.eventType?.value;
        switch (eventType) {
            case "screenshake":
                const additionalAttributes = {
                    screenshakeIntensity: parseFloat(attributes.screenshakeIntensity.value),
                    screenshakeDuration: parseInt(attributes.screenshakeDuration.value),
                }
                const newEvent = this.createNewEvent("screenshake", additionalAttributes, this.currentObject);
                this.currentObject.addChangeableAttribute("events", [...this.currentObject.events, newEvent]);
                break;
            case 3:
                this.rightMousePressed = true;
                break;
            default:
                console.log('Did not find event');
        }
        const existingEvents = EventsTooltipRenderer.renderExistingEvents(this.currentObject);
        const existingEventsWrapper = document.getElementById("existingEventsWrapper"); 
        existingEventsWrapper.innerHTML = '';
        existingEventsWrapper.appendChild(existingEvents);
        ModalHandler.closeModal('eventsModal');
    }
}