import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameMode } from '../../context/GameModeContext';

/**
 * Camera configuration
 */
const CAMERA_CONFIG = {
    // Offset behind and above character
    offset: new Vector3(0, 4, 8),

    // Look-at offset (slightly above character)
    lookAtOffset: new Vector3(0, 1.5, 0),

    // Smooth following
    positionLerpSpeed: 5.0,
    rotationLerpSpeed: 3.0,

    // FOV
    fov: 70,
};

/**
 * WalkingCamera Component
 *
 * Third-person camera for character exploration:
 * - Follows behind character
 * - Smooth movement
 * - Fixed vertical angle
 */
const WalkingCamera = () => {
    const { camera } = useThree();
    const { characterPosition, characterRotation } = useGameMode();

    const currentPosition = useRef(new Vector3());
    const targetPosition = useRef(new Vector3());
    const lookAtTarget = useRef(new Vector3());

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);

        // Calculate camera position based on character rotation
        const cos = Math.cos(characterRotation);
        const sin = Math.sin(characterRotation);

        // Offset in character's local space, transformed to world space
        targetPosition.current.set(
            characterPosition.x + CAMERA_CONFIG.offset.x * cos + CAMERA_CONFIG.offset.z * sin,
            characterPosition.y + CAMERA_CONFIG.offset.y,
            characterPosition.z - CAMERA_CONFIG.offset.x * sin + CAMERA_CONFIG.offset.z * cos
        );

        // Smooth position interpolation
        currentPosition.current.lerp(
            targetPosition.current,
            1 - Math.exp(-CAMERA_CONFIG.positionLerpSpeed * dt)
        );

        // Look-at point (character position + offset)
        lookAtTarget.current.set(
            characterPosition.x + CAMERA_CONFIG.lookAtOffset.x,
            characterPosition.y + CAMERA_CONFIG.lookAtOffset.y,
            characterPosition.z + CAMERA_CONFIG.lookAtOffset.z
        );

        // Apply to camera
        camera.position.copy(currentPosition.current);
        camera.lookAt(lookAtTarget.current);
        camera.fov = CAMERA_CONFIG.fov;
        camera.updateProjectionMatrix();
    });

    return null;
};

export default WalkingCamera;
