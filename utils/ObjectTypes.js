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

  static get CONNECTED_DISAPPEARING_BLOCK() {
    return 'connectedDisappearingBlock';
  }

  static get EVENT_TRIGGER() {
    return 'eventTrigger'
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

  static get BULLET() {
    return 'bullet';
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

  static get ENEMY_SPAWNER() {
    return 'enemySpawner';
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

  static get VIOLET_BLOCK() {
    return 'violetBlock';
  }

  static get PINK_BLOCK() {
    return 'pinkBlock';
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

  static get POWER_UP() {
    return 'powerUp';
  }

  static get MOVING_PLATFORM() {
    return 'movingPlatform';
  }

  static get TRIGGERED_PLATFORM() {
    return 'triggeredPlatform';
  }

  static get IMAGE_IN_GAME() {
    return 'imageInGame';
  }

  static get ENEMY_1() {
    return 'enemy_1';
  }

  static get ENEMY_2() {
    return 'enemy_2';
  }

  static get ENEMY_3() {
    return 'enemy_3';
  }

  static get ENEMY_4() {
    return 'enemy_4';
  }

  static get ENEMY_5() {
    return 'enemy_5';
  }

  static get ENEMY_6() {
    return 'enemy_6';
  }

  static get ENEMY_7() {
    return 'enemy_7';
  }

  static get ENEMY_8() {
    return 'enemy_8';
  }

  static get ENEMY_9() {
    return 'enemy_9';
  }

  static get ENEMY_10() {
    return 'enemy_10';
  }

  static get ENEMY_11() {
    return 'enemy_11';
  }

  static get ENEMY_12() {
    return 'enemy_12';
  }

  static get ENEMY_13() {
    return 'enemy_13';
  }

  static get ENEMY_14() {
    return 'enemy_14';
  }

  static get ENEMY_15() {
    return 'enemy_15';
  }

  static get ENEMY_16() {
    return 'enemy_16';
  }

  static get ENEMY_17() {
    return 'enemy_17';
  }

  static get ENEMY_18() {
    return 'enemy_18';
  }

  static get WEAPON_PISTOL()      { return 'weapon_pistol'; }
  static get WEAPON_LASER_GUN()   { return 'weapon_laser_gun'; }
  static get WEAPON_SHOTGUN()     { return 'weapon_shotgun'; }
  static get WEAPON_UZI()         { return 'weapon_uzi'; }
  static get WEAPON_MACHINE_GUN() { return 'weapon_machine_gun'; }
  static get WEAPON_BOW()         { return 'weapon_bow'; }
  static get WEAPON_SPEAR()       { return 'weapon_spear'; }
  static get WEAPON_SWORD()       { return 'weapon_sword'; }

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
      [this.CONNECTED_DISAPPEARING_BLOCK]: ConnectedDisappearingBlock,
      [this.DEKO]: Deko,
      [this.STOMPER]: Stomper,
      [this.CANON]: Canon,
      [this.CANON_BALL]: CanonBall,
      [this.BULLET]: Bullet,
      [this.LASER_CANON]: LaserCanon,
      [this.LASER]: Laser,
      [this.BARREL_CANNON]: BarrelCannon,
      [this.ENEMY_SPAWNER]: EnemySpawner,
      [this.JUMP_RESET]: JumpReset,
      [this.SFX]: SFX,
      [this.RED_BLUE_BLOCK_SWITCH]: RedBlueSwitch,
      [this.VIOLET_BLOCK]: VioletBlock,
      [this.PINK_BLOCK]: PinkBlock,
      [this.TREADMILL]: Treadmill,
      [this.ICE_BLOCK]: IceBlock,
      [this.DISAPPEARING_FOREGROUND_TILE]: DisappearingForegroundTile,
      [this.FOREGROUND_TILE]: ForegroundTile,
      [this.RED_BLOCK]: RedBlock,
      [this.BLUE_BLOCK]: BlueBlock,
      [this.FIXED_SPEED_RIGHT]: FixedSpeedRight,
      [this.FIXED_SPEED_STOPPER]: FixedSpeedStopper,
      [this.ROTATING_FIREBALL_CENTER]: RotatingFireballCenter,
      [this.POWER_UP]: PowerUp,
      [this.MOVING_PLATFORM]: MovingPlatform,
      [this.TRIGGERED_PLATFORM]: TriggeredPlatform,
      [this.EVENT_TRIGGER]: EventTrigger,
      [this.WATER]: Water,
      [this.TOGGLE_MINE]: ToggleMine,
      [this.ROCKET_LAUNCHER]: RocketLauncher,
      [this.PORTAL]: Portal,
      [this.COLLECTIBLE]: Collectible,
      [this.ENEMY_1]: Enemy1,
      [this.ENEMY_2]: Enemy2,
      [this.ENEMY_3]: Enemy3,
      [this.ENEMY_4]: Enemy4,
      [this.ENEMY_5]: Enemy5,
      [this.ENEMY_6]: Enemy6,
      [this.ENEMY_7]: Enemy7,
      [this.ENEMY_8]: Enemy8,
      [this.ENEMY_9]: Enemy9,
      [this.ENEMY_10]: Enemy10,
      [this.ENEMY_11]: Enemy11,
      [this.ENEMY_12]: Enemy12,
      [this.ENEMY_13]: Enemy13,
      [this.ENEMY_14]: Enemy14,
      [this.ENEMY_15]: Enemy15,
      [this.ENEMY_16]: Enemy16,
      [this.ENEMY_17]: Enemy17,
      [this.ENEMY_18]: Enemy18,
      [this.WEAPON_PISTOL]:      Pistol,
      [this.WEAPON_LASER_GUN]:   LaserGun,
      [this.WEAPON_SHOTGUN]:     Shotgun,
      [this.WEAPON_UZI]:         Uzi,
      [this.WEAPON_MACHINE_GUN]: MachineGun,
      [this.WEAPON_BOW]:         Bow,
      [this.WEAPON_SPEAR]:       Spear,
      [this.WEAPON_SWORD]:       Sword,
    };
  }
}