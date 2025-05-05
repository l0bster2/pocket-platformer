

class TooltipHandler {

    static staticConstructor() {
        const idsForTooltips = ["otherSpriteTooltip", "canvasObjectToolTip", "transformTooltip", "layersTooltip", "levelHelpersTooltip", "dialogueAvatarTooltip"];
        idsForTooltips.forEach(id => {
            this.createEmptyTooltip(id);
        });
        this.currentId = null;
        this.callBackFunc = (evt) => this.watchForClickOutside(evt, this.currentId);
    }

    static createEmptyTooltip(id) {
        this["toolTipEl" + id] = document.getElementById(id);
        this["toolTipEl" + id].classList.add("tooltip");
        const headerWrapper = document.createElement("div");
        headerWrapper.className = "headerWrapper";
        this["tooltipHeading" + id] = document.createElement("div");
        this["tooltipHeading" + id].className = "tooltipHeading";
        headerWrapper.appendChild(this["tooltipHeading" + id]);
        const closeButton = document.createElement("img");
        Helpers.addAttributesToHTMLElement(closeButton, {
            "src": "images/icons/close.svg",
            "width": 16, "height": 16, "class": "tooltipClose"
        });
        closeButton.onclick = (event) => this.closeTooltip(event, id);
        headerWrapper.appendChild(closeButton);
        this["contentEl" + id] = document.createElement("div");
        this["contentEl" + id].className = "tooltipContent";
        this["toolTipEl" + id].appendChild(headerWrapper);
        this["toolTipEl" + id].appendChild(this["contentEl" + id]);
        this["open" + id] = false;
    }

    static showTooltip(id, tooltipHeading = "", tooltipContent = "") {
        if (!this["open" + id]) {
            this.currentId = id;
            this["open" + id] = true;
            this["tooltipHeading" + id].innerHTML = tooltipHeading;
            this["contentEl" + id].appendChild(tooltipContent);
            this["toolTipEl" + id].style.visibility = 'visible';

            //we need a timeout here, because otherwise the click on the button to open the tooltip will be considered in the event
            //TODO: maybe replace click with mousedown, that way only the initial position of the click counts
            setTimeout(() => {
                document.addEventListener("click", this.callBackFunc);
            }, 200);
        }
    }

    static getSelectionText() {
        var text = "";
        var activeEl = document.activeElement;
        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (
            (activeElTagName == "textarea") || (activeElTagName == "input" &&
                /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
            (typeof activeEl.selectionStart == "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        }
        return text;
    }

    static watchForClickOutside(evt, id) {
        if (!this.getSelectionText() && !ModalHandler.open) {
            const flyoutElement = this["toolTipEl" + id];
            let targetElement = evt.target; // clicked element
            do {
                if (targetElement == flyoutElement) {
                    // Click inside, do nothing
                    return;
                }
                // Go up the DOM
                targetElement = targetElement.parentNode;
            } while (targetElement);

            // This is a click outside.
            this.closeTooltip(null, id);
        }
    }

    static closeTooltip(event, id) {
        event && event.stopPropagation();
        this.currentId = null;
        this["open" + id] = false;
        this["contentEl" + id].innerHTML = "";
        this["toolTipEl" + id].style.visibility = 'hidden';
        document.removeEventListener("click", this.callBackFunc);
        BuildMode.showingToolTip = false;
    }

    static repositionAndShowTooltip(id, top, left, tooltipHeading = "", tooltipContent = "") {
        if (this["open" + id]) {
            this.closeTooltip(null, id);
        }
        this["toolTipEl" + id].style.top = top + "px";
        this["toolTipEl" + id].style.left = left + "px";
        this.showTooltip(id, tooltipHeading, tooltipContent);
    }
}