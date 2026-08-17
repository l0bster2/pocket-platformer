class EnemyConfigurations {
    static get movementBehaviours() {
        return {
            startMovingLeft: "startMovingLeft",
            startMovingRight: "startMovingRight",
            towardsPlayer: "towardsPlayer",
            patrol: "patrol",
            random: "random",
            awayFromPlayer: "awayFromPlayer",
            standStill: "standStill",
        };
    }

    static get gapBehaviours() {
        return {
            changeDirection: "changeDirection",
            jump: "jump",
            continueWalking: "continueWalking",
        };
    }

    static get wallBehaviours() {
        return {
            changeDirection: "changeDirection",
            continueWalking: "continueWalking",
        };
    }

    static get flyingBehaviours() {
        return {
            moveHorizontally: "moveHorizontally",
            moveVertically: "moveVertically",
            followPlayer: "followPlayer",
            followPlayerPathfinding: "followPlayerPathfinding",
            alignPlayerHorizontally: "alignPlayerHorizontally",
            alignPlayerVertically: "alignPlayerVertically",
            horizontalPatrol: "horizontalPatrol",
            verticalPatrol: "verticalPatrol",
            diagonal: "diagonal",
            standStill: "standStill",
            random: "random",
        };
    }

    static get interativeObjects() {
        return [
            ObjectTypes.SPIKE,
            ObjectTypes.STOMPER,
            ObjectTypes.TRAMPOLINE,
            ObjectTypes.PORTAL,
            ObjectTypes.MOVING_PLATFORM,
            ObjectTypes.WATER
        ];
    }
}
