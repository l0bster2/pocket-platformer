class EventHandler {
    static staticConstructor() {
        this.currentObject = null;
    }

    static changeEventType(value) {

    }

    static submitEvent(e) {
        e.preventDefault();
        const eventType = e.target?.elements?.eventType?.value;
        switch (eventType) {
            case "screenshake":
                const newEvent = {
                    name: this.currentObject.events.length + 1 + " Screenshake",
                    type: "screenshake",
                }
                this.currentObject.events.push(newEvent);
                break;
            case 3:
                this.rightMousePressed = true;
                break;
            default:
                console.log('Did not find event');
        }
        ModalHandler.closeModal('eventsModal');
    }
}