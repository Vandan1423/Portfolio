import { useEffect, useRef } from 'react';
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
    landingZoneMultiplier: 0.4,
    // Distance multiplier for collision zone
    collisionZoneMultiplier: 0.15,
};

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

    useFrame(() => {
        if (!enabled || controlMode !== 'piloting' || !planets?.length) {
            return;
        }

        // Throttle updates
        frameCount.current++;
        if (frameCount.current % DETECTION_CONFIG.updateInterval !== 0) {
            return;
        }

        let nearestPlanet = null;
        let nearestDistance = Infinity;
        let canLand = false;

        // Check each planet
        for (const planet of planets) {
            // Calculate planet's current position in orbit
            // Planets orbit around origin, so we need their current position
            const time = Date.now() * 0.001; // Current time in seconds
            const angle = time * planet.orbitSpeed;
            const planetX = Math.cos(angle) * planet.orbitRadius;
            const planetZ = Math.sin(angle) * planet.orbitRadius;
            const planetY = 0; // Planets orbit on XZ plane

            tempVec.current.set(planetX, planetY, planetZ);

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
                canLand = true;
            }

            // Check collision zone (too close)
            const collisionRadius = planet.orbitRadius * DETECTION_CONFIG.collisionZoneMultiplier;
            if (distance < collisionRadius) {
                // Could trigger forced landing or bounce here
                // For now, just ensure canLand is true
                canLand = true;
            }
        }

        // Update context with results
        updateCollisionState(nearestPlanet, canLand, nearestDistance);
    });

    return null; // State is managed in context
}

export default useCollisionDetection;
