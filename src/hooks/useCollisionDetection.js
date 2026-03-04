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
    // Absolute landing zone radius (units) — ship must be within this distance
    landingRadius: 15,
    // Hysteresis: keep canLand=true for this many frames after leaving the zone
    hysteresisFrames: 45,
};

/**
 * useCollisionDetection Hook
 *
 * Reads actual planet world positions from the shared
 * planetWorldPositionsRef (written each frame by StarSystem's Planet components
 * via getWorldPosition). This eliminates all mathematical recomputation and
 * guarantees positions match the rendered scene.
 *
 * @param {Array} planets - Array of planet objects from current star system
 * @param {boolean} enabled - Whether detection is active
 * @returns {null} State is managed in GameModeContext
 */
export function useCollisionDetection(planets, enabled = true) {
    const { shipPosition, updateCollisionState, controlMode, planetWorldPositionsRef } = useGameMode();

    const frameCount = useRef(0);
    const canLandLatchRef = useRef(0);

    useFrame(() => {
        if (!enabled || controlMode !== 'piloting' || !planets?.length) {
            return;
        }

        // Throttle updates
        frameCount.current++;
        if (frameCount.current % DETECTION_CONFIG.updateInterval !== 0) {
            return;
        }

        const posMap = planetWorldPositionsRef.current;
        // Wait until planets have written their positions
        if (!posMap || posMap.size === 0) return;

        let nearestPlanet = null;
        let nearestDistance = Infinity;
        let rawCanLand = false;

        planets.forEach((planet) => {
            const worldPos = posMap.get(planet.id);
            if (!worldPos) return; // planet hasn't reported yet

            const distance = shipPosition.distanceTo(worldPos);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPlanet = {
                    ...planet,
                    distance,
                    position: worldPos.clone(),
                };
            }

            if (distance < DETECTION_CONFIG.landingRadius) {
                rawCanLand = true;
            }
        });

        // Hysteresis: keep canLand true for a short window after leaving the zone
        if (rawCanLand) {
            canLandLatchRef.current = DETECTION_CONFIG.hysteresisFrames;
        } else if (canLandLatchRef.current > 0) {
            canLandLatchRef.current--;
            rawCanLand = true;
        }

        updateCollisionState(nearestPlanet, rawCanLand, nearestDistance);
    });

    return null;
}

export default useCollisionDetection;
