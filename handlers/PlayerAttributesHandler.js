const dashChecked = "dashChecked";
const runChecked = "runChecked";

class PlayerAttributesHandler {

    static staticConstructor(player) {
        this.player = player;
        this.sliderValues = ["groundAcceleration", "air_acceleration", "maxSpeed", "groundFriction", "air_friction", "jumpSpeed", "maxJumpFrames", "maxFallSpeed"];
        this.checkBoxValues = ["jumpChecked", "wallJumpChecked", "doubleJumpChecked", dashChecked, runChecked];

        this.sliderValues.forEach(sliderValue => {
            this.setInitialSliderValue(sliderValue);

            this[sliderValue + "Slider"].oninput = (event) => {
                let newValue = Number(event.target.value);
                //If value has decimals, put at least 2 decimals after coma
                this[sliderValue + "Value"].innerHTML = newValue % 1 != 0 ? newValue.toFixed(2) : newValue;
                if(sliderValue === "jumpSpeed") {
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
        if(sliderValue === "jumpSpeed" && playerAttrValue < 1) {
            playerAttrValue = parseFloat(playerAttrValue * player.maxJumpFrames).toFixed(2)
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
}