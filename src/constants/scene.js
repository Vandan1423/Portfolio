/**
 * Scene constants shared between the star system and the piloting code.
 */

// Where the sun sits inside the star system group. The group turns slowly about the
// origin, so the sun's world position moves; StarSystem publishes it every frame
// to GameModeContext's sunWorldPositionRef.
export const SUN_POSITION = [0, 0, -10];
