class ObjectTypes {
  static get SPIKE() {
    return 'spike';
  }

  static get TRAMPOLINE() {
    return 'trampoline';
  }

  static get FINISH_FLAG() {
    return 'finishFlag';
  }

  static get FINISH_FLAG_CLOSED() {
    return 'finishFlagClosed';
  }

  static get START_FLAG() {
    return 'startFlag';
  }

  static get PLAYER_IDLE() {
    return 'playerIdle';
  }

  static get PLAYER_JUMP() {
    return 'playerJump';
  }

  static get PLAYER_WALK() {
    return 'playerWalk';
  }

  static get DISAPPEARING_BLOCK() {
    return 'disappearingBlock';
  }

  static get TREADMILL() {
    return 'treadmill';
  }

  static get CANON() {
    return 'canon';
  }

  static get CANON_BALL() {
    return 'canonBall';
  }

  static get LASER_CANON() {
    return 'laserCanon';
  }

  static get LASER() {
    return 'laser';
  }

  static get BARREL_CANNON() {
    return 'barrelCannon';
  }

  static get JUMP_RESET() {
    return 'jumpReset';
  }

  static get DEKO() {
    return 'deco';
  }

  static get SFX() {
    return 'sfx';
  }

  static get STOMPER() {
    return 'stomper';
  }

  static get ROCKET_LAUNCHER() {
    return 'rocketLauncher'
  }

  static get ROCKET() {
    return 'rocket'
  }

  static get PORTAL() {
    return 'portal'
  }

  static get PORTAL2() {
    return 'portal2'
  }

  static get CHECKPOINT() {
    return 'checkpoint';
  }

  static get RED_BLUE_BLOCK_SWITCH() {
    return 'redblueblockswitch';
  }

  static get RED_BLOCK() {
    return 'redBlock';
  }

  static get BLUE_BLOCK() {
    return 'blueBlock';
  }

  static get WATER() {
    return 'water'
  }

  static get FIXED_SPEED_RIGHT() {
    return 'fixedSpeedRight'
  }

  static get FIXED_SPEED_STOPPER() {
    return 'fixedSpeedStopper'
  }

  static get TOGGLE_MINE() {
    return 'toggleMine';
  }

  static get NPC() {
    return 'npc';
  }

  static get ICE_BLOCK() {
    return 'iceBlock';
  }

  static get DISAPPEARING_FOREGROUND_TILE() {
    return 'disappearingForegroundTile'
  }

  static get FOREGROUND_TILE() {
    return 'foregroundTile'
  }

  static get PATH() {
    return 'path';
  }

  static get PATH_POINT() {
    return 'pathPoint';
  }

  static get ROTATING_FIREBALL_CENTER() {
    return 'rotatingFireballCenter';
  }

  static get COLLECTIBLE() {
    return 'collectible';
  }
  
  static get LADDER() {
	  return 'ladder';
  }

  static get SPECIAL_BLOCK_VALUES() {
    return {
      canon: 14,
      redBlueSwitch: 13,
      switchableBlock: 12,
      disappearingBlock: 11,
      treadmillRight: 900,
      treadmillLeft: 901,
      iceBlock: 902,
    }
  };

  static get objectToClass() {
    return {
      [this.SPIKE]: Spike,
      [this.FINISH_FLAG]: FinishFlag,
      [this.CHECKPOINT]: Checkpoint,
      [this.START_FLAG]: StartFlag,
      [this.TRAMPOLINE]: Trampoline,
      [this.NPC]: Npc,
      [this.DISAPPEARING_BLOCK]: DisappearingBlock,
      [this.DEKO]: Deko,
      [this.STOMPER]: Stomper,
      [this.CANON]: Canon,
      [this.CANON_BALL]: CanonBall,
      [this.LASER_CANON]: LaserCanon,
      [this.LASER]: Laser,
      [this.BARREL_CANNON]: BarrelCannon,
      [this.JUMP_RESET]: JumpReset,
      [this.SFX]: SFX,
      [this.RED_BLUE_BLOCK_SWITCH]: RedBlueSwitch,
      [this.TREADMILL]: Treadmill,
      [this.ICE_BLOCK]: IceBlock,
      [this.DISAPPEARING_FOREGROUND_TILE]: DisappearingForegroundTile,
      [this.FOREGROUND_TILE]: ForegroundTile,
      [this.RED_BLOCK]: RedBlock,
      [this.BLUE_BLOCK]: BlueBlock,
      [this.FIXED_SPEED_RIGHT]: FixedSpeedRight,
      [this.FIXED_SPEED_STOPPER]: FixedSpeedStopper,
      [this.ROTATING_FIREBALL_CENTER]: RotatingFireballCenter,
      [this.WATER]: Water,
      [this.TOGGLE_MINE]: ToggleMine,
      [this.ROCKET_LAUNCHER]: RocketLauncher,
      [this.PORTAL]: Portal,
      [this.COLLECTIBLE]: Collectible,
	    [this.LADDER]: Ladder
    };
  }
}
