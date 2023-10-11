const jumpSpeedMapValues = [
    {
        sliderValue: 1,
        jumpSpeed: 0.33,
        maxJumpFrames: 18,
    },
    {
        sliderValue: 2,
        jumpSpeed: 0.40,
        maxJumpFrames: 18,
    },
    {
        sliderValue: 3,
        jumpSpeed: 0.44,
        maxJumpFrames: 18,
    },
    {
        sliderValue: 4,
        jumpSpeed: 0.46,
        maxJumpFrames: 20,
    },
    {
        sliderValue: 5,
        jumpSpeed: 0.46,
        maxJumpFrames: 22,
    },
    {
        sliderValue: 6,
        jumpSpeed: 0.46,
        maxJumpFrames: 23,
    },
    {
        sliderValue: 7,
        jumpSpeed: 0.47,
        maxJumpFrames: 24,
    },
    {
        sliderValue: 8,
        jumpSpeed: 0.47,
        maxJumpFrames: 25,
    },
    {
        sliderValue: 9,
        jumpSpeed: 0.48,
        maxJumpFrames: 25,
    },
    {
        sliderValue: 10,
        jumpSpeed: 0.48,
        maxJumpFrames: 26,
    }
];

const dashChecked = "dashChecked";
const runChecked = "runChecked";

class PlayerAttributesHandler {

    static staticConstructor(player) {
        this.player = player;
        this.sliderValues = ["groundAcceleration", "air_acceleration", "maxSpeed", "groundFriction", "air_friction", "jumpSpeed", "maxFallSpeed"];
        this.checkBoxValues = ["jumpChecked", "wallJumpChecked", "doubleJumpChecked", dashChecked, runChecked];

        this.sliderValues.forEach(sliderValue => {
            this.setInitialSliderValue(sliderValue);

            this[sliderValue + "Slider"].oninput = (event) => {
                let newValue = Number(event.target.value);
                //If value has decimals, put at least 2 decimals after coma
                this[sliderValue + "Value"].innerHTML = newValue % 1 != 0 ? newValue.toFixed(2) : newValue;

                if(sliderValue === "jumpSpeed") {
                    const jumpValueObj = this.mapJumpSliderValueToRealValue(newValue)[0];
                    newValue = Number(jumpValueObj.jumpSpeed);
                    this.player.maxJumpFrames = jumpValueObj.maxJumpFrames;
                    this.player.adjustSwimAttributes(this.player.maxJumpFrames, newValue);
                }
                this.player[sliderValue] = newValue;
                this.adjustAccelerationRelatedToSpeed(sliderValue, newValue);
            };
        });

        this.checkBoxValues.forEach(checkBoxValue => {
            this.setInitialCheckboxValue(checkBoxValue);
        });
    }

    static setInitialSliderValue(sliderValue){
        let playerAttrValue = this.player[sliderValue];
        if(sliderValue === "jumpSpeed") {
            const jumpSliderValueObj = this.mapJumpValueToSliderValue(playerAttrValue)[0];
            playerAttrValue = jumpSliderValueObj.sliderValue;
        }
        this[sliderValue + "Slider"] = document.getElementById(sliderValue);
        this[sliderValue + "Slider"].value = playerAttrValue;
        this[sliderValue + "Value"] = document.getElementById(sliderValue + "Value");
        this[sliderValue + "Value"].innerHTML = playerAttrValue;
        this.adjustAccelerationRelatedToSpeed(sliderValue, playerAttrValue);
    }

    static adjustAccelerationRelatedToSpeed(sliderValue, playerAttrValue) {
        if (sliderValue === "maxSpeed") {
            ["groundAcceleration", "air_acceleration"].forEach(accelerationValue => {
                const sliderName = accelerationValue + "Slider"
                const sliderValueBeforeUpdate = parseFloat(this[sliderName].value).toFixed(2);
                this[sliderName].max = playerAttrValue;
                this[sliderName].min = playerAttrValue / 100;
                this[sliderName].step = playerAttrValue / 100;
                const sliderValueAfterUpdate = parseFloat(this[sliderName].value).toFixed(2);
                //if value was shrunk down, because max-speed is smaller then acceleration
                if(sliderValueBeforeUpdate !== sliderValueAfterUpdate) {
                    this[accelerationValue + "Value"].innerHTML = sliderValueAfterUpdate;
                }
            });
        }
    }

    static setInitialCheckboxValue(checkBoxValue) {
        let playerAttrValue = this.player[checkBoxValue];
        this[checkBoxValue + "CheckBox"] = document.getElementById(checkBoxValue);
        this[checkBoxValue + "CheckBox"].checked = playerAttrValue;

        this[checkBoxValue + "CheckBox"].onclick = (event) => {
            if (event.target.checked)
            {
                this.player[checkBoxValue] = true;
                this.updateUniqueCheckboxes(checkBoxValue);
            }
            else {
                this.player[checkBoxValue] = false;
            }
        }
    }

    static updateUniqueCheckboxes(checkBoxValue) {
        if(checkBoxValue === dashChecked) {
            this.updateCheckboxValueFromOutside(runChecked, false);
        }
        else if(checkBoxValue === runChecked) {
            this.updateCheckboxValueFromOutside(dashChecked, false);
        }
    }

    static updateCheckboxValueFromOutside(checkBoxValue, value) {
        this[checkBoxValue + "CheckBox"] = document.getElementById(checkBoxValue);
        this[checkBoxValue + "CheckBox"].checked = value;
        this.player[checkBoxValue] = value;
    }

    static mapJumpValueToSliderValue(value){
        const jumpSpeedObj = jumpSpeedMapValues.filter(jumpSpeedObj => jumpSpeedObj.jumpSpeed === value);
        return jumpSpeedObj;
    }

    static mapJumpSliderValueToRealValue(value) {
        const jumpSpeedObj = jumpSpeedMapValues.filter(jumpSpeedObj => jumpSpeedObj.sliderValue === value);
        return jumpSpeedObj;
    }
}