import { useRef } from 'react';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameMode } from '../context/GameModeContext';

/**
 * Collision detection configuration
 */
const DETECTION_CONFIG = {
    // Update rate (every N frames) - throttle for performance
    updateInterval: 2,
    // Distance multiplier for landing zone (relative to orbit radius)
    landingZoneMultiplier: 0.45,
    // Distance multiplier for collision zone
    collisionZoneMultiplier: 0.15,
    // Hysteresis: keep canLand=true for this many frames after leaving the zone
    hysteresisFrames: 45,
};

// Must match StarSystem.jsx constants
const SUN_X = 0;
const SUN_Z = -10;
const SYSTEM_ROTATION_SPEED = 0.01;

/**
 * useCollisionDetection Hook
 *
 * Checks ship position against all planets for:
 * - Landing zone detection (show "Press L to land" prompt)
 * - Collision detection (force landing or bounce)
 * - Nearest planet tracking
 *
 * @param {Array} planets - Array of planet objects from current star system
 * @param {boolean} enabled - Whether detection is active
 * @returns {Object} Collision state
 */
export function useCollisionDetection(planets, enabled = true) {
    const { shipPosition, updateCollisionState, controlMode } = useGameMode();

    const frameCount = useRef(0);
    const tempVec = useRef(new Vector3());
    // Hysteresis counter: counts down after canLand last became true
    const canLandLatchRef = useRef(0);

    useFrame((state) => {
        if (!enabled || controlMode !== 'piloting' || !planets?.length) {
            return;
        }

        // Throttle updates
        frameCount.current++;
        if (frameCount.current % DETECTION_CONFIG.updateInterval !== 0) {
            return;
        }

        // Use the same clock as StarSystem.jsx (r3f clock, starts at 0)
        const elapsedTime = state.clock.elapsedTime;

        // System group Y-rotation (matches StarSystem.jsx: SYSTEM_ROTATION_SPEED = 0.01)
        const groupRotY = elapsedTime * SYSTEM_ROTATION_SPEED;
        const cosR = Math.cos(groupRotY);
        const sinR = Math.sin(groupRotY);

        let nearestPlanet = null;
        let nearestDistance = Infinity;
        let rawCanLand = false;

        // Check each planet — index must match what StarSystem.jsx passes to Planet
        planets.forEach((planet, index) => {
            // Exactly matches Planet component in StarSystem.jsx:
            //   const initialAngle = useMemo(() => index * (Math.PI / 2), [index]);
            //   const angle = state.clock.elapsedTime * orbitSpeed + initialAngle;
            //   x = sunPosition[0] + cos(angle) * orbitRadius
            //   z = sunPosition[2] + sin(angle) * orbitRadius
            const initialAngle = index * (Math.PI / 2);
            const angle = elapsedTime * planet.orbitSpeed + initialAngle;

            // Planet local position inside the rotating StarSystem group
            const localX = SUN_X + Math.cos(angle) * planet.orbitRadius;
            const localZ = SUN_Z + Math.sin(angle) * planet.orbitRadius;

            // Rotate by the StarSystem group's Y rotation to get world-space position
            const worldX = localX * cosR - localZ * sinR;
            const worldZ = localX * sinR + localZ * cosR;

            tempVec.current.set(worldX, 0, worldZ);

            // Calculate distance from ship to planet
            const distance = shipPosition.distanceTo(tempVec.current);

            // Track nearest planet
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPlanet = {
                    ...planet,
                    distance,
                    position: tempVec.current.clone(),
                };
            }

            // Check landing zone
            const landingRadius = planet.orbitRadius * DETECTION_CONFIG.landingZoneMultiplier;
            if (distance < landingRadius) {
                rawCanLand = true;
            }

            // Check collision zone (too close)
            const collisionRadius = planet.orbitRadius * DETECTION_CONFIG.collisionZoneMultiplier;
            if (distance < collisionRadius) {
                rawCanLand = true;
            }
        });

        // Hysteresis: keep canLand true for a short window after leaving the zone
        // This prevents the prompt from flickering at zone edges
        if (rawCanLand) {
            canLandLatchRef.current = DETECTION_CONFIG.hysteresisFrames;
        } else if (canLandLatchRef.current > 0) {
            canLandLatchRef.current--;
            rawCanLand = true;
        }

        // Update context with results
        updateCollisionState(nearestPlanet, rawCanLand, nearestDistance);
    });

    return null; // State is managed in context
}

export default useCollisionDetection;
