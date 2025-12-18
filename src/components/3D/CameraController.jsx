import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Camera animation constants
const CAMERA_LERP_SPEED = 0.05;
const CAMERA_DISTANCE_THRESHOLD = 0.5;
const CAMERA_DISTANCE_MULTIPLIER = 0.25;
const CAMERA_OFFSET_MULTIPLIER = 0.6;
const DEFAULT_CAMERA_HEIGHT = 15;
const DEFAULT_CAMERA_DISTANCE = 45;
const PLANET_LOOKAT_Z_OFFSET = -10;

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

    // Target vectors for camera animation
    const targetPosition = useRef(new THREE.Vector3(0, DEFAULT_CAMERA_HEIGHT, DEFAULT_CAMERA_DISTANCE));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

    // Reusable vectors to avoid object creation in useFrame (performance optimization)
    const currentLookAt = useRef(new THREE.Vector3());
    const newLookAt = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!isTransitioning) return;

        // Calculate target position based on planet
        if (targetPlanet) {
            // Get planet's orbit radius to calculate camera distance
            const cameraDistance = targetPlanet.orbitRadius * CAMERA_DISTANCE_MULTIPLIER;

            // Position camera closer and more centered on planet
            targetPosition.current.set(
                cameraDistance * CAMERA_OFFSET_MULTIPLIER,
                DEFAULT_CAMERA_HEIGHT,
                cameraDistance * CAMERA_OFFSET_MULTIPLIER
            );

            // Look directly at the sun (where planet orbits)
            targetLookAt.current.set(0, 0, PLANET_LOOKAT_Z_OFFSET);
        } else {
            // Return to default view
            targetPosition.current.set(0, DEFAULT_CAMERA_HEIGHT, DEFAULT_CAMERA_DISTANCE);
            targetLookAt.current.set(0, 0, 0);
        }

        // Smoothly interpolate camera position
        camera.position.lerp(targetPosition.current, CAMERA_LERP_SPEED);

        // Smoothly update camera look-at
        camera.getWorldDirection(currentLookAt.current);
        currentLookAt.current.add(camera.position);

        newLookAt.current.lerpVectors(currentLookAt.current, targetLookAt.current, CAMERA_LERP_SPEED);
        camera.lookAt(newLookAt.current);

        // Check if we're close enough to the target
        const distanceToTarget = camera.position.distanceTo(targetPosition.current);
        if (distanceToTarget < CAMERA_DISTANCE_THRESHOLD) {
            onTransitionComplete();
        }
    });

    return null; // This component doesn't render anything
};

export default CameraController;
