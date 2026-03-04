import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Euler, Quaternion, Matrix4 } from 'three';
import { useGameMode } from '../context/GameModeContext';

/**
 * Physics configuration
 */
const PHYSICS_CONFIG = {
    maxSpeed: 60,
    boostMaxSpeed: 120,
    acceleration: 30,
    boostAcceleration: 60,
    deceleration: 20,
    brakeDeceleration: 50,
    turnSpeed: 1.5,
    pitchSpeed: 1.0,
    rollSpeed: 1.5,
    dragCoefficient: 0.98, // Air resistance (1 = no drag, 0 = instant stop)
    minVelocity: 0.1, // Below this, velocity becomes 0
};

/**
 * useSpaceshipPhysics Hook
 *
 * Handles physics simulation for spaceship movement using useFrame.
 * Updates position, velocity, and rotation based on control inputs.
 *
 * @param {Object} controls - Control state from useSpaceshipControls
 * @param {boolean} enabled - Whether physics simulation is active
 * @returns {Object} Current physics state and methods
 */
export function useSpaceshipPhysics(controls, enabled = true) {
    const { updateShipState, setThrustLevel, setIsBoosting, shipPositionRef, shipVelocityRef, shipRotationRef } = useGameMode();

    // Reusable objects to avoid garbage collection
    const tempVec = useRef(new Vector3());
    const tempQuat = useRef(new Quaternion());
    const tempMatrix = useRef(new Matrix4());
    const forwardDir = useRef(new Vector3());
    const rightDir = useRef(new Vector3());
    const upDir = useRef(new Vector3(0, 1, 0));

    // Physics state refs for high-frequency updates
    const position = shipPositionRef;
    const velocity = shipVelocityRef;
    const rotation = shipRotationRef;

    // Calculate forward direction from rotation
    const getForwardDirection = useCallback(() => {
        const euler = rotation.current;
        tempQuat.current.setFromEuler(euler);
        forwardDir.current.set(0, 0, -1).applyQuaternion(tempQuat.current);
        return forwardDir.current;
    }, [rotation]);

    // Calculate right direction from rotation
    const getRightDirection = useCallback(() => {
        const euler = rotation.current;
        tempQuat.current.setFromEuler(euler);
        rightDir.current.set(1, 0, 0).applyQuaternion(tempQuat.current);
        return rightDir.current;
    }, [rotation]);

    // Physics update loop
    useFrame((state, delta) => {
        if (!enabled) return;

        // Clamp delta to prevent physics explosions on lag spikes
        const dt = Math.min(delta, 0.1);

        const {
            forward,
            backward,
            left,
            right,
            up,
            down,
            rollLeft,
            rollRight,
            boost,
            brake,
        } = controls;

        // Get current config based on boost state
        const maxSpeed = boost ? PHYSICS_CONFIG.boostMaxSpeed : PHYSICS_CONFIG.maxSpeed;
        const accel = boost ? PHYSICS_CONFIG.boostAcceleration : PHYSICS_CONFIG.acceleration;

        // Update boost state
        setIsBoosting(boost);

        // ===== ROTATION =====
        // Yaw (left/right turning)
        if (left) {
            rotation.current.y += PHYSICS_CONFIG.turnSpeed * dt;
        }
        if (right) {
            rotation.current.y -= PHYSICS_CONFIG.turnSpeed * dt;
        }

        // Pitch (up/down)
        if (up) {
            rotation.current.x = Math.max(rotation.current.x - PHYSICS_CONFIG.pitchSpeed * dt, -Math.PI / 3);
        }
        if (down) {
            rotation.current.x = Math.min(rotation.current.x + PHYSICS_CONFIG.pitchSpeed * dt, Math.PI / 3);
        }

        // Roll
        if (rollLeft) {
            rotation.current.z += PHYSICS_CONFIG.rollSpeed * dt;
        }
        if (rollRight) {
            rotation.current.z -= PHYSICS_CONFIG.rollSpeed * dt;
        }

        // Gradual roll return to level
        if (!rollLeft && !rollRight) {
            rotation.current.z *= 0.95;
        }

        // ===== THRUST =====
        let thrustAmount = 0;

        if (forward) {
            // Forward thrust
            const fwd = getForwardDirection();
            velocity.current.addScaledVector(fwd, accel * dt);
            thrustAmount = boost ? 1 : 0.6;
        }

        if (backward) {
            // Reverse thrust (slower)
            const fwd = getForwardDirection();
            velocity.current.addScaledVector(fwd, -accel * 0.5 * dt);
            thrustAmount = Math.max(thrustAmount, 0.3);
        }

        // ===== BRAKING =====
        if (brake) {
            // Active braking
            const speed = velocity.current.length();
            if (speed > PHYSICS_CONFIG.minVelocity) {
                const brakeForce = Math.min(PHYSICS_CONFIG.brakeDeceleration * dt, speed);
                tempVec.current.copy(velocity.current).normalize().multiplyScalar(-brakeForce);
                velocity.current.add(tempVec.current);
            }
            thrustAmount = 0.2; // Slight glow during brake
        }

        // ===== DRAG =====
        // Natural deceleration when not thrusting
        if (!forward && !backward && !brake) {
            velocity.current.multiplyScalar(PHYSICS_CONFIG.dragCoefficient);
        }

        // ===== SPEED CLAMPING =====
        const currentSpeed = velocity.current.length();
        if (currentSpeed > maxSpeed) {
            velocity.current.normalize().multiplyScalar(maxSpeed);
        }
        if (currentSpeed < PHYSICS_CONFIG.minVelocity) {
            velocity.current.set(0, 0, 0);
        }

        // ===== POSITION UPDATE =====
        position.current.addScaledVector(velocity.current, dt);

        // ===== BOUNDARY CHECK =====
        // Keep ship within playable area
        const maxDistance = 500;
        if (position.current.length() > maxDistance) {
            position.current.normalize().multiplyScalar(maxDistance);
            // Bounce velocity back
            velocity.current.multiplyScalar(-0.5);
        }

        // ===== UPDATE CONTEXT STATE =====
        setThrustLevel(thrustAmount);
        updateShipState(position.current, velocity.current, rotation.current);
    });

    return {
        position: position.current,
        velocity: velocity.current,
        rotation: rotation.current,
        getForwardDirection,
        getRightDirection,
    };
}

export default useSpaceshipPhysics;
