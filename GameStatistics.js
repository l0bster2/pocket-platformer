class GameStatistics {

    static staticConstructor() {
        this.resetPlayerStatistics();
        this.alreadyStopped = false;
    }

    static resetPlayerStatistics() {
        this.resetTimer();
        this.deathCounter = 0;
    }

    static resetPermanentObjects() {
        WorldDataHandler.levels.forEach(level => {
            level.levelObjects.forEach(levelObject => {
                if (levelObject.type === ObjectTypes.COLLECTIBLE) {
                    levelObject.extraAttributes.collected = false;
                }
            });
        })
    }

    static resetTimer() {
        this.startTime = null;
        this.endTime = null;
        this.timeBetweenPauses = 0;
        this.timesPauseWasPressed = 0;
    }

    static startTimer() {
        if (!this.startTime) {
            this.startTime = new Date();
        }
    }

    static getTimeDifference() {
        const endTime = this.endTime.getTime();
        const startTime = this.startTime.getTime();
        if (startTime > endTime) {
            return null;
        }
        return endTime - startTime + this.timeBetweenPauses;
    }

    static updateTimeBetweenPauses() {
        if (!this.endTime || !this.startTime) {
            return null;
        }
        /*
            The cost of stopping and resuming the game is approximatley 17 milliseconds. Just to initialize date
            Therefore we substract 17 milliseconds the first 3 times the player presses pause.
            If he does it more often, it's "his fault", which is not realistic
        */
        this.timesPauseWasPressed++;
        this.timeBetweenPauses = this.timesPauseWasPressed <= 3 ? this.getTimeDifference() - 17 : this.getTimeDifference();
        this.startTime = null;
        this.endTime = null;
    }

    static getFinalTime() {
        if (!this.endTime || !this.startTime) {
            return null;
        }
        var diff = this.getTimeDifference();

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        return hh > 0 ? `${this.leadingZero(hh)}:${this.leadingZero(mm)}:${this.leadingZero(ss)}:${msec}` :
            `${this.leadingZero(mm)}:${this.leadingZero(ss)}:${msec}`;
    }

    static leadingZero(num) {
        return `0${num}`.slice(-2);
    }

    static stopTimer() {
        this.endTime = new Date();
        this.alreadyStopped = true;
    }
}