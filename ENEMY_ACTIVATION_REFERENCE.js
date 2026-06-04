/**
 * QUICK REFERENCE: Enemy Activation System
 * 
 * Place this code in Enemy1.js or Enemy2.js constructor to set activation behavior
 */

// Example 1: Enemy always active (default)
// No setup needed - enemies are active by default

// Example 2: Activate after 3 seconds, deactivate if player is 10 tiles away
// this.setActivationConditions(
//     { type: 'afterSeconds', value: 3 },
//     { type: 'playerFurtherThanDistance', value: 10 }
// );

// Example 3: Activate when player can be seen, deactivate when out of sight
// this.setActivationConditions(
//     { type: 'canSeePlayer' },
//     { type: 'notSeeingPlayer' }
// );

// Example 4: Activate when player is on same X axis (within 1 tile buffer)
// this.setActivationConditions(
//     { type: 'playerApproxSameX', value: 1 },
//     { type: 'playerNotApproxSameX', value: 1 }
// );

// Example 5: Activate within 8 tiles, deactivate after 10 seconds of being active
// this.setActivationConditions(
//     { type: 'playerInDistance', value: 8 },
//     { type: 'afterSeconds', value: 10 }
// );

// Example 6: Complex - Activate when player is visible AND on same Y axis
// Only deactivate if player is very far away
// this.setActivationConditions(
//     { type: 'canSeePlayer' },  // AND player approx same Y
//     { type: 'playerFurtherThanDistance', value: 15 }
// );

/**
 * ACTIVATION CONDITIONS (turn enemy ON)
 * 
 * 'alwaysActive' 
 *   - No value needed
 *   - Enemy is always on
 * 
 * 'afterSeconds' 
 *   - value: number of seconds
 *   - Activates after X seconds from level start/enemy spawn
 * 
 * 'playerInDistance' 
 *   - value: distance in tiles
 *   - Activates when player is within X tiles
 * 
 * 'canSeePlayer' 
 *   - No value needed
 *   - Activates when enemy has line of sight to player
 * 
 * 'playerApproxSameX' 
 *   - value: tile buffer (default 1)
 *   - Activates when player X position is within buffer
 * 
 * 'playerApproxSameY' 
 *   - value: tile buffer (default 1)
 *   - Activates when player Y position is within buffer
 */

/**
 * INACTIVATION CONDITIONS (turn enemy OFF)
 * 
 * 'becomesInactive'
 *   - No value needed
 *   - Enemy becomes inactive immediately
 * 
 * 'neverInactive'
 *   - No value needed
 *   - Enemy never becomes inactive once activated
 * 
 * 'afterSeconds' 
 *   - value: number of seconds
 *   - Becomes inactive after X seconds of being active
 * 
 * 'playerFurtherThanDistance' 
 *   - value: distance in tiles
 *   - Becomes inactive when player is beyond X tiles
 * 
 * 'notSeeingPlayer'
 *   - No value needed
 *   - Becomes inactive when line of sight to player is blocked
 * 
 * 'playerNotApproxSameX'
 *   - value: tile buffer (default 1)
 *   - Becomes inactive when player X is outside buffer
 * 
 * 'playerNotApproxSameY'
 *   - value: tile buffer (default 1)
 *   - Becomes inactive when player Y is outside buffer
 */
