import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * CameraController Component
 *
 * Handles smooth camera transitions to planets
 * Uses lerp for smooth animation
 *
 * Props:
 * @param {object} targetPlanet - Planet object to focus on (null for default view)
 * @param {boolean} isTransitioning - Whether camera is currently moving
 * @param {function} onTransitionComplete - Callback when transition completes
 */
const CameraController = ({
    targetPlanet = null,
    isTransitioning = false,
    onTransitionComplete = () => {},
}) => {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3(0, 15, 45));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

    useFrame(() => {
        if (!isTransitioning) return;

        // Calculate target position based on planet
        if (targetPlanet) {
            // Get planet's orbit radius to calculate camera distance
            // Closer camera for better planet visibility
            const distance = targetPlanet.orbitRadius * 0.25;

            // Position camera closer and more centered on planet
            // Slightly elevated for a good viewing angle
            targetPosition.current.set(
                distance * 0.6,
                15, // Fixed height for consistent viewing
                distance * 0.6
            );

            // Look directly at the sun (where planet orbits)
            // This keeps the planet prominently in view
            targetLookAt.current.set(0, 0, -10);
        } else {
            // Return to default view
            targetPosition.current.set(0, 15, 45);
            targetLookAt.current.set(0, 0, 0);
        }

        // Smoothly interpolate camera position
        camera.position.lerp(targetPosition.current, 0.05);

        // Smoothly update camera look-at
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);

        const newLookAt = new THREE.Vector3();
        newLookAt.lerpVectors(currentLookAt, targetLookAt.current, 0.05);
        camera.lookAt(newLookAt);

        // Check if we're close enough to the target
        const distance = camera.position.distanceTo(targetPosition.current);
        if (distance < 0.5) {
            onTransitionComplete();
        }
    });

    return null; // This component doesn't render anything
};

export default CameraController;
