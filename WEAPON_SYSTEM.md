# Weapon System – Feature Design

## Overview

A weapon system that lets players pick up, hold, and use weapons placed in the level editor. Weapons are purely decorative objects while in the world (no gravity). Once the player picks one up it enters their inventory and becomes usable.

---

## 1. Build-Mode Tab

- Add a new **Weapons** tab in the build tool sidebar.
- Follows the same pattern as the existing Enemies tab: icon-only button, sprite-picker list, plus a per-weapon attribute panel.
- New tab icon: a sword or crosshair SVG (similar style to existing tab icons).
- Placed weapons are **non-interactive objects** at edit time (like Deko). They render as their sprite, no physics.

---

## 2. World Placement Behaviour

- Weapons in the level are stored in `WorldDataHandler` per-level (e.g. `levelData.weapons[]`), similar to enemies.
- At runtime a weapon on the ground has **no gravity and no collision with tiles** — it just sits at its spawn position.
- It is drawn as its sprite on each frame.
- When the player overlaps a weapon tile it is **picked up** and a pick-up SFX plays.
- **No duplicates**: if the player already carries a weapon of the same `weaponType`, the world instance is ignored (not picked up, stays in place).
- The picked-up weapon is removed from the world and added to `player.weapons`.
- Weapons **persist across death and level transitions** — they are never cleared on respawn or level load.

---

## 3. Inventory & Active Weapon

### Player inventory
- `player.weapons = []` — ordered list of held weapons (one entry per `weaponType` at most).
- `player.activeWeaponIndex = 0` — index into `player.weapons`.
- `player.activeWeapon` — shorthand getter for `player.weapons[player.activeWeaponIndex]`.
- Inventory persists across death and level switches. It is only modified by picking up a new weapon or by a reset triggered from the settings panel (see Section 9).

### Switching
| Input | Action |
|---|---|
| `e` (keyboard) | Cycle to next weapon |
| RB / Right Bumper (gamepad `buttons[5]`) | Cycle to next weapon |
| Mobile: new **"switch weapon" button** added to the HUD | Cycle to next weapon |

Switching wraps around (`(activeWeaponIndex + 1) % weapons.length`). Only switches when the player holds at least 1 weapon.

---

## 4. Controls – Key Remapping

### Keyboard changes
| Key | Old action | New action |
|---|---|---|
| `Up` / `ArrowUp` / `w` | Jump + aim up | **Aim up only** (no longer sets `jump`) |
| `Shift` | (build-mode only) | **Attack** (use active weapon) in play mode |
| `x` / `k` | Dash (`alternativeActionButton`) | Dash (unchanged key, but see controller below) |
| `e` | *(unbound)* | Switch active weapon |

> Jump is still triggered by `z`, `j`, `c` (unchanged).

### Gamepad changes
| Button | Old | New |
|---|---|---|
| `buttons[0]` (A) | Jump / confirm | Jump / confirm (unchanged) |
| `buttons[1]` (B) | `alternativeActionButton` (dash) | **Attack** |
| `buttons[2]` (X) | `alternativeActionButton` (dash) | **Dash** |
| `buttons[5]` (RB) | *(unbound)* | **Switch weapon** |
| `buttons[7]` (RT) | *(unbound)* | **Attack** (same as B) |

> `alternativeActionButton` in `Controller` now maps to dash only (`buttons[2]` + `x`/`k` keys).  
> Two new `Controller` flags are added: `attackPressed` / `attackReleased` and `switchWeapon` / `switchWeaponReleased`.

### `Controller.js` new state fields
```js
this.attackPressed = false;
this.attackReleased = true;
this.switchWeapon = false;
this.switchWeaponReleased = true;
```

### Mobile HUD additions
- A new **"attack" button** replaces nothing — add it next to the existing jump button.
- A smaller **"switch weapon" button** is added to the HUD (only visible when player has ≥ 2 weapons).

---

## 5. Weapon Class Architecture

```
Weapon (base class)
├── GunWeapon extends Weapon
└── MeleeWeapon extends Weapon
```

### `Weapon` (base)
Stored in world as a level object (like `InteractiveLevelObject`). Has:
- `weaponType` string (e.g. `'pistol'`, `'sword'`)
- `displayName`
- `sprite` reference
- `drawOnPlayer(player, ctx)` — abstract, renders weapon relative to player

### `GunWeapon extends Weapon`
Handles shooting logic. Each instance tracks:
- `ammoRemaining` (runtime, initialized from attribute `ammo`)
- `intervalTimer` (frames since last shot)

`attack(player)` spawns one or more `Bullet` objects using the existing `Bullet.js` infrastructure.

### `MeleeWeapon extends Weapon`
Handles swing/thrust logic. No bullets spawned — uses a hit-box check.

`attack(player)` creates a temporary hit area, checks enemy overlap, applies damage.

---

## 6. Weapon Rendering on Player

When the player holds an active weapon it is drawn **1 tile away** in the direction they are facing/aiming:

- Facing right → weapon drawn at `(player.x + tileSize, player.y)`
- Facing left → weapon drawn at `(player.x - tileSize, player.y)` (sprite flipped horizontally)
- Aiming up (`Controller.up`) → weapon drawn at `(player.x, player.y - tileSize)`
- 8-directional weapons add diagonals based on combined `up`/`down` + `left`/`right` state

The weapon sprite is drawn on top of the player (or in a separate rendering pass after the player).

Melee weapons additionally show a swing arc animation during the attack frame window.

---

## 7. Weapon Definitions

### Gun weapons

| Weapon | Directions | Bullets/shot | Interval | Ammo | Gravity | Random offset | Notes |
|---|---|---|---|---|---|---|---|
| Pistol | 2 | 1 | slow | limited | no | none | |
| Laser | 4 | 1 | medium | limited | no | none | slightly faster than pistol |
| Shotgun | 4 | 3 | slow | limited | no | medium | 3 bullets spread |
| Uzi | 2 | 1 | fast | limited | no | high | heavy offset per shot |
| Machine Gun | 4 | 1 | very fast | limited | no | very low | |
| Bow | 2 | 1 | medium | limited | **yes** | none | bullet arc like a CanonBall |
| Sniper | 8 | 1 | very slow | limited | no | none | high speed bullet |

#### Gun attributes (per weapon definition, stored in `WorldDataHandler.weaponTypeAttributes`)

Attribute storage and editing **mirrors the enemy system exactly**:
- `WorldDataHandler.weaponTypeAttributes[weaponType]` holds per-type overrides (same shape as `enemyTypeAttributes`).
- `WeaponTypeAttributesHandler.setAttribute(type, key, value)` persists a value and applies it live to all placed instances of that type (same pattern as `EnemyTypeAttributesHandler.setAttribute`).
- `getEditableAttributes()` / `setEditableAttributes()` on each weapon class define defaults and restoration on load (same contract as Enemy subclasses).
- `WeaponAttributesRenderer` renders the panel using the same checkbox/slider/input helpers already used by `EnemiesAttributesRenderer`.
| Attribute | Type | Description |
|---|---|---|
| `bulletLifeSpan` | frames | How long the bullet travels before despawning |
| `bulletsAtOnce` | int | Number of bullets fired per shot (e.g. 3 for shotgun) |
| `interval` | seconds | Minimum time between shots |
| `ammo` | int | Total shots before weapon is empty (0 = infinite) |
| `affectedByGravity` | bool | Whether bullets arc downward |
| `gravity` | float 0–2 | Gravity strength on bullet (same scale as Bullet.js) |
| `randomOffset` | degrees | Random angle spread per bullet |
| `directionAmount` | 2 / 4 / 8 | How many firing directions the weapon supports |
| `bulletSprite` | string | `descriptiveName` of a bullet sprite from `SpritePixelArrays` |
| `speed` | float | Bullet travel speed |

---

### Melee weapons

| Weapon | Attack type | Hit range |
|---|---|---|
| Spear | Piercing | 1.5 tiles forward |
| Sword | Slicing | 180° arc (1.5 tiles radius) |

#### Melee attributes
| Attribute | Type | Description |
|---|---|---|
| `attackType` | `'piercing'` \| `'slicing'` | **Piercing**: straight line thrust in facing direction. **Slicing**: rotates from vertical to horizontal (top-to-bottom sweep) in the direction the player faces |
| `reachTiles` | float | How far from the player center the hit-box extends |
| `attackDuration` | frames | How many frames the hit-box is active |
| `interval` | seconds | Cooldown between attacks |

---

## 8. Weapon Editor Panel (new view)

Mirrors the enemy attribute panel:

- **Tabs**: General / Attack (guns) or General / Melee (melee)
- **General tab**: weapon name, pick-up sound SFX *(no sprite picker yet — see sprites note below)*
- **Attack tab (guns)**: sliders/inputs for all gun attributes (reuse existing slider/checkbox helpers from `EnemyAttackRenderer`)
- **Melee tab**: attack type dropdown, reach slider, attack duration, interval

Panel is rendered by a new `WeaponAttributesRenderer.js` in `htmlRenderers/`.

---

## 9. Settings Panel – Weapon State

A new collapsible **"Details"** sub-section is added to the existing in-tool settings/pause panel. It is **closed by default**.

Inside it there is one **checkbox per weapon type** that exists anywhere in the current game (across all levels). The label is the weapon's `displayName`.

### Checkbox behaviour
| State | Meaning |
|---|---|
| ✅ Checked | Player currently holds this weapon type |
| ☐ Unchecked | Player does not hold this weapon type |

- The checkbox is set automatically when the player picks up a weapon during gameplay inside the tool.
- The user can **manually uncheck** a weapon type at any time.
  - That weapon type is removed from `player.weapons` (inventory updated, `activeWeaponIndex` clamped if needed).
  - All world instances of that weapon type across every level are **restored to their original spawn position** and become pick-up-able again.
- The user can **manually check** a weapon type at any time.
  - That weapon type is added to `player.weapons` (using its default attribute values).
  - Any world instances of that type are removed (treated as already picked up).
- This panel is only rendered when `WorldDataHandler.insideTool === true`. It is excluded from exported games.

### Storage
`WorldDataHandler.pickedUpWeaponTypes` — a `Set<string>` of `weaponType` strings the player currently holds. Serialised as an array in the tool's session state (not exported to the playable game).

---

## 10. Data Storage

### Build-time (per level)
`WorldDataHandler.levelData[n].weapons` — array of placed weapon instances:
```js
{ weaponType: 'pistol', x: 5, y: 3 }
```

### Weapon type attributes (global, like `enemyTypeAttributes`)
`WorldDataHandler.weaponTypeAttributes` — keyed by `weaponType`, stores overrides for each attribute listed above.

### Export
`ImportExportHandler` bundles weapon scripts the same way enemy scripts are bundled (`unNeededScripts` exclusion list already exists). Weapon runtime scripts must be added to the game bundle; editor-only scripts (`WeaponAttributesRenderer`) are excluded.

---

## 11. New Files / Modules

| File | Role |
|---|---|
| `weapons/Weapon.js` | Base class |
| `weapons/GunWeapon.js` | Gun superclass |
| `weapons/MeleeWeapon.js` | Melee superclass |
| `weapons/Pistol.js` | Pistol instance |
| `weapons/Laser.js` | Laser instance |
| `weapons/Shotgun.js` | Shotgun instance |
| `weapons/Uzi.js` | Uzi instance |
| `weapons/MachineGun.js` | Machine gun instance |
| `weapons/Bow.js` | Bow instance |
| `weapons/Sniper.js` | Sniper instance |
| `weapons/Spear.js` | Piercing melee instance |
| `weapons/Sword.js` | Slicing melee instance |
| `handlers/WeaponHandler.js` | Runtime update loop: pickup detection, attack dispatch, active weapon draw |
| `htmlRenderers/WeaponAttributesRenderer.js` | Build-mode editor panel (excluded from export) |

### Registration
- New `ObjectTypes.WEAPON_*` static getters + `objectToClass` entries (same pattern as enemies).
- **Sprites deferred**: each weapon is represented by a distinct solid-color square for now. No `SpritePixelArrays` entries needed yet. The build tab lists weapons by their `displayName` rather than a sprite thumbnail until real sprites are added.
- `index.html` `<script>` tags added after `Bullet.js`.

---

## 12. Implementation Notes

### Attribute system
Follows the enemy pattern end-to-end. `WeaponTypeAttributesHandler` is a thin clone of `EnemyTypeAttributesHandler`. The renderer reuses the same helper functions (`createSliderInput`, `createCheckboxInput`, etc.) already defined for the enemy panel.

### Sprites (deferred)
All weapons are drawn as **solid-color squares** (one unique color per weapon type) until real pixel-art sprites are designed. The draw methods in `Weapon.js` subclasses call `ctx.fillRect` with a fixed color. Once sprites exist, swap in `SpritePixelArrays` entries and update `draw()`.

---

## 13. Open Questions / Decisions to Make Before Implementation

1. **Ammo HUD**: Should remaining ammo be shown on screen? Where?
2. **Weapon drop**: Can the player drop a weapon (e.g. D-pad down + switch)? Or is it permanent once picked up?
3. **Melee vs. enemies**: Does melee respect `killedByBullets` flag, or have its own flag (`killedByMelee`)?
4. **Aiming up with melee**: Does aiming up (`up` key) change melee swing direction too?
5. **Infinite weapons**: Should a weapon with `ammo = 0` (infinite) be visually distinct in the editor?
6. **Mobile attack button placement**: Should it be a long-press on the jump button, or a fully separate button?
7. **Weapon sprites**: Deferred — colored squares used in the meantime.
