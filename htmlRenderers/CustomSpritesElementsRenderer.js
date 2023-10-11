class CustomSpritesElementsRenderer {
    static createRemoveCustomSpriteIcon(x, y, index) {
        const deleteImgWrapper = document.createElement("div");
        const deleteImg = document.createElement("img");
        Helpers.addAttributesToHTMLElement(deleteImg, {
            "src": "images/icons/delete.svg", width: 14, height: 14,
        });
        deleteImg.id = "removeCustomSprite" + index;
        deleteImg.className = "hovereableRedSvg";
        deleteImgWrapper.style.left = `${x + 30}px`;
        deleteImgWrapper.style.top = `${y - 8}px`;
        deleteImgWrapper.style.position = "absolute";
        deleteImgWrapper.style.zIndex = 10;
        deleteImgWrapper.style.height = 17 + "px";
        deleteImgWrapper.style.background = "white";
        deleteImgWrapper.appendChild(deleteImg);
        return deleteImgWrapper;
    }
}