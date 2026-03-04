import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import { useGameMode } from '../../context/GameModeContext';

/**
 * Camera configuration
 */
const CAMERA_CONFIG = {
    // Offset behind and above the ship (in ship's local space)
    offset: new Vector3(0, 4, 12),

    // How far ahead of the ship to look
    lookAheadDistance: 2,

    // Lerp speeds for smooth following
    positionLerpSpeed: 3.0,
    rotationLerpSpeed: 4.0,

    // Dynamic FOV based on speed
    baseFOV: 60,
    maxFOV: 85,
    speedForMaxFOV: 100, // Speed at which max FOV is reached

    // Smoothing for FOV changes
    fovLerpSpeed: 2.0,
};

/**
 * ChaseCamera Component
 *
 * Third-person camera that follows the spaceship with:
 * - Smooth position lerping
 * - Dynamic FOV based on speed
 * - Look-at point ahead of ship for smooth feel
 */
const ChaseCamera = () => {
    const { camera } = useThree();
    const { shipPosition, shipRotation, shipVelocity } = useGameMode();

    // Refs for smooth interpolation
    const currentPositionRef = useRef(new Vector3());
    const currentLookAtRef = useRef(new Vector3());
    const currentFOVRef = useRef(CAMERA_CONFIG.baseFOV);

    // Temp objects for calculations
    const tempQuat = useRef(new Quaternion());
    const tempVec = useRef(new Vector3());
    const targetPosition = useRef(new Vector3());
    const targetLookAt = useRef(new Vector3());

    useFrame((state, delta) => {
        // Clamp delta to prevent jumps on lag
        const dt = Math.min(delta, 0.1);

        // Get ship's rotation as quaternion
        tempQuat.current.setFromEuler(shipRotation);

        // Calculate target camera position (behind and above ship)
        targetPosition.current.copy(CAMERA_CONFIG.offset);
        targetPosition.current.applyQuaternion(tempQuat.current);
        targetPosition.current.add(shipPosition);

        // Calculate look-at point (ahead of ship)
        tempVec.current.set(0, 0, -CAMERA_CONFIG.lookAheadDistance);
        tempVec.current.applyQuaternion(tempQuat.current);
        targetLookAt.current.copy(shipPosition).add(tempVec.current);

        // Smooth interpolation for camera position
        currentPositionRef.current.lerp(
            targetPosition.current,
            1 - Math.exp(-CAMERA_CONFIG.positionLerpSpeed * dt)
        );

        // Smooth interpolation for look-at point
        currentLookAtRef.current.lerp(
            targetLookAt.current,
            1 - Math.exp(-CAMERA_CONFIG.rotationLerpSpeed * dt)
        );

        // Calculate dynamic FOV based on speed
        const speed = shipVelocity.length();
        const speedRatio = Math.min(speed / CAMERA_CONFIG.speedForMaxFOV, 1);
        const targetFOV = CAMERA_CONFIG.baseFOV + speedRatio * (CAMERA_CONFIG.maxFOV - CAMERA_CONFIG.baseFOV);

        // Smooth FOV interpolation
        currentFOVRef.current += (targetFOV - currentFOVRef.current) * CAMERA_CONFIG.fovLerpSpeed * dt;

        // Apply to camera
        camera.position.copy(currentPositionRef.current);
        camera.lookAt(currentLookAtRef.current);
        camera.fov = currentFOVRef.current;
        camera.updateProjectionMatrix();
    });

    return null; // This component only manipulates the camera
};

export default ChaseCamera;
