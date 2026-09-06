class Enemy17 extends Enemy {

    constructor(x, y, tileSize, type, tilemapHandler, extraAttributes = {}) {
        const hitBoxOffset = -tileSize / 6;
        super(x, y, tileSize, type, hitBoxOffset, extraAttributes);
        this.canBeStomped = false;
        this.maxSpeed = 7;
        this.groundAcceleration = 0.24;
        this.air_acceleration = 0.24;
        this.movementBehaviour = this.movementBehaviours.towardsPlayer;
        this.gapBehaviour = this.gapBehaviours.continueWalking;
        // Activates when player is on roughly the same horizontal level; deactivates when far away.
        this.activationConfig = { type: 'playerApproxSameY', value: 2 };
        this.inactivationConfig = { type: 'afterSeconds', value: 2 };
        this.deathAnimation = 'upwardsAndRotate';
    }

}
