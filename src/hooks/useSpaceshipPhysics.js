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
    strafeAcceleration: 18, // ~60% of forward accel for strafing
    deceleration: 20,
    brakeDeceleration: 50,
    // Keyboard pitch/roll (manual override, secondary to mouse)
    pitchSpeed: 1.0,
    rollSpeed: 1.5,
    dragCoefficient: 0.98, // Per-frame at 60fps, applied frame-rate independently
    minVelocity: 0.1,
    // Pitch limits (in radians)
    maxPitch: Math.PI * 0.44, // ~80 degrees
};

/**
 * useSpaceshipPhysics Hook
 *
 * Handles physics simulation for spaceship movement using useFrame.
 * Mouse controls yaw/pitch (ship follows where you look).
 * WASD controls thrust/strafe. Q/E for roll. R/F for manual pitch.
 *
 * @param {Object} controls - Control state from useSpaceshipControls (includes consumeMouseDelta)
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
            strafeLeft,
            strafeRight,
            up,
            down,
            rollLeft,
            rollRight,
            boost,
            brake,
            consumeMouseDelta,
        } = controls;

        // Get current config based on boost state
        const maxSpeed = boost ? PHYSICS_CONFIG.boostMaxSpeed : PHYSICS_CONFIG.maxSpeed;
        const accel = boost ? PHYSICS_CONFIG.boostAcceleration : PHYSICS_CONFIG.acceleration;
        const strafeAccel = boost ? PHYSICS_CONFIG.strafeAcceleration * 1.5 : PHYSICS_CONFIG.strafeAcceleration;

        // Update boost state
        setIsBoosting(boost);

        // ===== MOUSE-DRIVEN YAW/PITCH =====
        if (consumeMouseDelta) {
            const mouseDelta = consumeMouseDelta();

            // Apply mouse yaw (horizontal mouse = yaw rotation)
            rotation.current.y -= mouseDelta.x;

            // Apply mouse pitch (vertical mouse = pitch rotation) with clamping
            rotation.current.x -= mouseDelta.y;
            rotation.current.x = Math.max(-PHYSICS_CONFIG.maxPitch, Math.min(PHYSICS_CONFIG.maxPitch, rotation.current.x));
        }

        // ===== KEYBOARD ROTATION (manual overrides) =====
        // Pitch (R/F keys - manual pitch override)
        if (up) {
            rotation.current.x = Math.max(rotation.current.x - PHYSICS_CONFIG.pitchSpeed * dt, -PHYSICS_CONFIG.maxPitch);
        }
        if (down) {
            rotation.current.x = Math.min(rotation.current.x + PHYSICS_CONFIG.pitchSpeed * dt, PHYSICS_CONFIG.maxPitch);
        }

        // Roll (Q/E keys)
        if (rollLeft) {
            rotation.current.z += PHYSICS_CONFIG.rollSpeed * dt;
        }
        if (rollRight) {
            rotation.current.z -= PHYSICS_CONFIG.rollSpeed * dt;
        }

        // Frame-rate independent roll auto-leveling
        if (!rollLeft && !rollRight) {
            rotation.current.z *= Math.pow(0.05, dt); // Exponential decay, ~95% per second
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

        // ===== STRAFE (A/D) =====
        if (strafeLeft) {
            const right = getRightDirection();
            velocity.current.addScaledVector(right, -strafeAccel * dt);
            thrustAmount = Math.max(thrustAmount, 0.2);
        }
        if (strafeRight) {
            const right = getRightDirection();
            velocity.current.addScaledVector(right, strafeAccel * dt);
            thrustAmount = Math.max(thrustAmount, 0.2);
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

        // ===== DRAG (frame-rate independent) =====
        if (!forward && !backward && !brake && !strafeLeft && !strafeRight) {
            velocity.current.multiplyScalar(Math.pow(PHYSICS_CONFIG.dragCoefficient, dt * 60));
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
        const maxDistance = 500;
        if (position.current.length() > maxDistance) {
            position.current.normalize().multiplyScalar(maxDistance);
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
