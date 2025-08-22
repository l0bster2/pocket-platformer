class WalkHandler extends PlayMode {

    static walkHandler() {
        const { player } = this;
        var walking = false;
        if (!player.dashing && !player.fixedSpeed) {
            //const newMaxSpeed = Controller.alternativeActionButton && player.runChecked ? player.maxSpeed * 1.65 : player.maxSpeed;
            const newMaxSpeed = player.currentMaxSpeed;
            //const newMaxSpeed = Controller.alternativeActionButton ? player.maxSpeed * 1.85 : player.maxSpeed;

            if ((Controller.left || player.fixedSpeedLeft) && !player.fixedSpeedRight) {
                //check should be player.xspeed + player.speed and an else with player.xspeed = player.maxSpeed
                if (player.xspeed - player.speed > newMaxSpeed * -1) {
                    player.xspeed -= player.speed;
                }
                else {
                    if (player.swimming) {
                        player.xspeed = newMaxSpeed * -1;
                    }
                    else {
                        const restSpeed = player.currentMaxSpeed + player.xspeed;
                        if (restSpeed > 0) {
                            player.xspeed -= restSpeed;
                        }
                    }
                }
                walking = true;
            }
            if ((Controller.right || player.fixedSpeedRight) && !player.fixedSpeedLeft) {
                if (player.xspeed + player.speed < newMaxSpeed) {
                    player.xspeed += player.speed;
                }
                else {
                    if (player.swimming) {
                        player.xspeed = newMaxSpeed;
                    }
                    else {
                        const restSpeed = player.currentMaxSpeed - player.xspeed;
                        if (restSpeed > 0) {
                            player.xspeed += restSpeed;
                        }
                    }
                }
                walking = true;
            }
        }
        return walking;
    }

    static slowDownWalkSpeed() {
        const { player } = this;

        if (!player.fixedSpeed) {
            player.xspeed *= player.friction;
            if (Math.abs(player.xspeed) < 0.5) {
                player.xspeed = 0;
            }
        }
    }

    static reverseForcedRunSpeed() {
        if (player.fixedSpeedRight) {
            player.fixedSpeedRight = false;
            player.fixedSpeedLeft = true;
        }
        else if (player.fixedSpeedLeft) {
            player.fixedSpeedRight = true;
            player.fixedSpeedLeft = false;
        }
    }

    static isRunButtonReleased() {
        const { player } = this;
        return player.runChecked && !Controller.alternativeActionButton && (Math.abs(player.xspeed) > Math.abs(player.maxSpeed));
    }
}