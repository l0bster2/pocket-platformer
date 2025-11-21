class FontHandler {

    static changeFont(e) {
        const option = e.target;
        if (!option) return;

        document.querySelectorAll(".fontOption").forEach(o => o.classList.remove("selected"));
        option.classList.add("selected");
        const selectedFont = option.dataset.font;
        WorldDataHandler.selectedFont = selectedFont;
    }

    static addCustomFont() {
        const fontNameVar = document.getElementById("customFontName").value;

        if (!fontNameVar) {
            return;
        }

        this.loadCustomFont(fontNameVar);
        this.initializeCustomFontHtml(fontNameVar);

        WorldDataHandler.selectedFont = fontNameVar;
    }

    static initializeCustomFontHtml(fontNameVar) {
        const container = document.getElementById("customFontPreviewContainer");
        container.innerHTML = "";

        const newFontOption = document.createElement("div");
        newFontOption.className = "fontOption customFont";
        newFontOption.textContent = "Example";
        newFontOption.style.fontFamily = `'${fontNameVar}', sans-serif`;
        newFontOption.dataset.font = fontNameVar;
        newFontOption.onclick = (e) => { FontHandler.changeFont(e) };
        container.appendChild(newFontOption);

        document.querySelectorAll(".fontOption").forEach(o => o.classList.remove("selected"));
        newFontOption.classList.add("selected");
        WorldDataHandler.customFont = fontNameVar;
    }

    static loadCustomFont(fontNameVar) {
        const linkId = "customFontLink";

        const oldLink = document.getElementById(linkId);
        if (oldLink) oldLink.remove();

        const newLink = document.createElement("link");
        newLink.id = linkId;
        newLink.rel = "stylesheet";
        newLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontNameVar)}&display=swap`;
        document.head.appendChild(newLink);
    }

    static initializeFontFromExport() {
        const selected = document.querySelector(`.fontOption[data-font="${WorldDataHandler.selectedFont}"]`);

        if (selected) {
            document.querySelectorAll(".fontOption").forEach(o => o.classList.remove("selected"));
            selected.classList.add("selected");
        }
    }

    static changeFontSize(e) {
        const newValue = parseInt(e.target.value);
        WorldDataHandler.fontSize = newValue;
        document.getElementById("fontSizeValue").innerHTML = newValue;
    }

    static resetValuesinUi() {
        if (WorldDataHandler.customFont) {
            document.getElementById("customFontName").value = WorldDataHandler.customFont;
            FontHandler.initializeCustomFontHtml(WorldDataHandler.customFont);
        }
        document.getElementById("fontSizeValue").innerHTML = WorldDataHandler.fontSize;
        document.getElementById("fontSizeSlider").value = parseInt(WorldDataHandler.fontSize);
    }
}
