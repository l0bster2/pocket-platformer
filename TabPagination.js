class TabPagination extends TabNavigation {

    static staticConstructor() {
        this.paginationLeft = document.getElementById("tabPaginationLeft");
        this.paginationRight = document.getElementById("tabPaginationRight");
        this.setPaginationToDefault();
    }

    static setPaginationToDefault() {
        this.currentPages = {
            [SpritePixelArrays.customType]: 1
        }
        Object.values(SpritePixelArrays.SPRITE_TYPES).map(spriteType =>
            this.currentPages[spriteType] = 1);
    }

    static changePaginationVisibility(name) {
        /*
            extra amount, because pagination for custom tiles starts, when a page is full
            and you can create new tiles on the next page
        */
        const extaItemAmount = name === SpritePixelArrays.customType ? 1 : 0;
        const pagesAmount = Math.ceil((this.selectableSprites.length + extaItemAmount) / this.maxSpritesPerTab);
        if (pagesAmount > 1) {
            document.getElementById("currentPage").innerHTML = this.currentPages[name];
            if (this.currentPages[name] === 1) {
                this.setPaginationNaviVisibility("none", "block")
            }
            else if (this.currentPages[name] === pagesAmount) {
                this.setPaginationNaviVisibility("block", "none")
            }
            else {
                this.setPaginationNaviVisibility("block", "block")
            }
        }
        else {
            document.getElementById("currentPage").innerHTML = "";
            this.setPaginationNaviVisibility("none", "none")
        }
    }

    static setPaginationNaviVisibility(leftStyle, rightStyle) {
        this.paginationLeft.style.display = leftStyle;
        this.paginationRight.style.display = rightStyle;
    }

    static changePage(amount) {
        this.currentPages[this.currentSelectedTab] += amount;
        this.changePaginationVisibility(this.currentSelectedTab);
        this.drawSpritesByType();
        TabNavigation.removeOldDeleteIcons();
        TabNavigation.drawDeleteIconsForCustomSprites();
        TabNavigation.positionNewSpriteButton();
    }

    static getPageOffset() {
        return (this.currentPages[this.currentSelectedTab] - 1) * this.maxSpritesPerTab;
    }
}