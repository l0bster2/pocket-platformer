class LayerHandler {

    static staticConstructor() {
        this.waterLayer = true;
        this.decoLayer = true;
        this.objectLayer = true;
        this.tileLayer = true;
        this.foregroundLayer = true;
        this.triggerLayer = true;
    }

    static layerVisibilityButtonClicked(event) {
        const target = event.target;
        const eyeIcon = target.children[0];
        if(eyeIcon.src.includes('images/icons/eye.svg')) {
            eyeIcon.src = 'images/icons/closedEye.svg';
            this[target.id] = false;
        }
        else {
            eyeIcon.src = 'images/icons/eye.svg';
            this[target.id] = true;
        }
    }

    static showLayersTooltip() {
        const template = ObjectsTooltipElementsRenderer.createLayersTooltip();
        TooltipHandler.showTooltip("layersTooltip", "Visibility", template);
    }
 }