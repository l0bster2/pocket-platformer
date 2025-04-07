class ImageHandlerRenderer {
    static createImageOverview() {
        document.getElementById("imageContent").innerHTML =
            `<div> 
            ${ImageHandler.images.map(image => this.createImageWrapper(image)).join(' ')}
            ${this.createUploadImageButton()}
        </div>`;
    }

    static createImageWrapper(image) {
        return `<div class="imageControls">
           <span class="imageControlsDescription"> ${image.name} </span>
            <button style="margin-right: 8px" id="${image.name}Delete" class="levelNavigationButton" onClick="ImageHandler.showDeleteLevelModal('${image.name}')">
                <img src="images/icons/delete.svg" width="14" height="14">
            </button>
            <button id="${image.name}Preview" class="levelNavigationButton" onClick="ImageHandler.showPreviewImage('${image.name}')">
                <img src="images/icons/right.svg" width="14" height="14">
            </button>
    </div>`;
    }

    static createUploadImageButton() {
        return `<div class="marginTop8 subSection">
        <label class="levelNavigationButton block">
            <input type="file" id="uploadImage" onChange="ImageHandler.uploadNewImage()" />
            Import new image
            <img src="images/icons/import.svg" class="iconInButtonWithText" alt="import" width="16"
                height="16">
            </label>
            </div>`
    }
}