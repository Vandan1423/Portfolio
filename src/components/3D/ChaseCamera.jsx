import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Quaternion, MathUtils } from 'three';
import { useGameMode } from '../../context/GameModeContext';

/**
 * Camera configuration — modern game-style spring-damper chase camera
 */
const CAMERA_CONFIG = {
    // Base offset behind and above the ship (in ship's local space)
    baseOffset: new Vector3(0, 1.8, 5.0),

    // How far ahead of the ship to look (in ship's forward direction)
    lookAheadDistance: 4,

    // Spring-damper for camera position (higher = stiffer/snappier)
    positionStiffness: 50,
    positionDamping: 12,

    // Spring-damper for look-at target (higher = more responsive aiming)
    lookAtStiffness: 80,
    lookAtDamping: 14,

    // Dynamic FOV based on speed
    baseFOV: 65,
    maxFOV: 80,
    speedForMaxFOV: 100,
    fovLerpSpeed: 3.0,

    // Speed-based camera pull-back (camera moves further at high speed)
    speedPullBackZ: 2.5,   // Extra distance behind at max speed
    speedPullBackY: 0.6,   // Extra height at max speed
    speedForMaxPullBack: 100,

    // Camera tilt on yaw (adds visceral turning feel)
    maxTiltAngle: 0.05,  // ~3 degrees in radians
    tiltSpeed: 4.0,       // How fast tilt responds
};

/**
 * Spring-damper update function
 * Models a critically-damped spring system for smooth, cinematic motion.
 *
 * @param {Vector3} current - Current position
 * @param {Vector3} target - Target position
 * @param {Vector3} velocity - Current velocity (mutated in-place)
 * @param {number} stiffness - Spring stiffness
 * @param {number} damping - Damping coefficient
 * @param {number} dt - Delta time
 */
function springDamperUpdate(current, target, velocity, stiffness, damping, dt) {
    // F = -stiffness * (current - target) - damping * velocity
    const fx = -stiffness * (current.x - target.x) - damping * velocity.x;
    const fy = -stiffness * (current.y - target.y) - damping * velocity.y;
    const fz = -stiffness * (current.z - target.z) - damping * velocity.z;

    // Semi-implicit Euler integration
    velocity.x += fx * dt;
    velocity.y += fy * dt;
    velocity.z += fz * dt;

    current.x += velocity.x * dt;
    current.y += velocity.y * dt;
    current.z += velocity.z * dt;
}

/**
 * ChaseCamera Component
 *
 * Modern game-style third-person camera with:
 * - Spring-damper position/look-at smoothing (elastic, cinematic lag)
 * - Dynamic FOV based on speed
 * - Speed-based camera pull-back for dramatic speed feel
 * - Camera tilt on yaw for visceral turning
 * - Look-ahead point for smooth forward visibility
 */
const ChaseCamera = () => {
    const { camera } = useThree();
    const { shipPosition, shipRotation, shipVelocity } = useGameMode();

    // Spring state refs
    const currentPositionRef = useRef(new Vector3());
    const positionVelocityRef = useRef(new Vector3());
    const currentLookAtRef = useRef(new Vector3());
    const lookAtVelocityRef = useRef(new Vector3());
    const currentFOVRef = useRef(CAMERA_CONFIG.baseFOV);
    const currentTiltRef = useRef(0);
    const prevYawRef = useRef(0);
    const initializedRef = useRef(false);

    // Auto-center tracking: when mouse idle > threshold, snap camera behind ship
    const prevRotationRef = useRef({ x: 0, y: 0 });
    const lastRotationChangeTimeRef = useRef(0);
    const AUTO_CENTER_DELAY = 1.5;       // seconds before auto-centering kicks in
    const AUTO_CENTER_RAMP = 1.0;        // seconds to fully ramp stiffness
    const AUTO_CENTER_POS_STIFFNESS = 140;
    const AUTO_CENTER_LOOK_STIFFNESS = 180;

    // Temp objects for calculations
    const tempQuat = useRef(new Quaternion());
    const tempVec = useRef(new Vector3());
    const targetPosition = useRef(new Vector3());
    const targetLookAt = useRef(new Vector3());
    const dynamicOffset = useRef(new Vector3());

    useFrame((state, delta) => {
        // Clamp delta to prevent jumps on lag
        const dt = Math.min(delta, 0.1);

        // Get ship's rotation as quaternion
        tempQuat.current.setFromEuler(shipRotation);

        // ===== SPEED-BASED DYNAMIC OFFSET =====
        const speed = shipVelocity.length();
        const speedRatio = Math.min(speed / CAMERA_CONFIG.speedForMaxPullBack, 1);

        // Compute dynamic offset: base + speed-based pull-back
        dynamicOffset.current.copy(CAMERA_CONFIG.baseOffset);
        dynamicOffset.current.z += speedRatio * CAMERA_CONFIG.speedPullBackZ;
        dynamicOffset.current.y += speedRatio * CAMERA_CONFIG.speedPullBackY;

        // ===== TARGET CAMERA POSITION =====
        // Rotate the offset by ship's quaternion and add to ship position
        targetPosition.current.copy(dynamicOffset.current);
        targetPosition.current.applyQuaternion(tempQuat.current);
        targetPosition.current.add(shipPosition);

        // ===== TARGET LOOK-AT POINT =====
        // Ahead of ship in its forward direction
        tempVec.current.set(0, 0, -CAMERA_CONFIG.lookAheadDistance);
        tempVec.current.applyQuaternion(tempQuat.current);
        targetLookAt.current.copy(shipPosition).add(tempVec.current);

        // ===== SNAP ON FIRST FRAME =====
        if (!initializedRef.current) {
            currentPositionRef.current.copy(targetPosition.current);
            currentLookAtRef.current.copy(targetLookAt.current);
            positionVelocityRef.current.set(0, 0, 0);
            lookAtVelocityRef.current.set(0, 0, 0);
            prevYawRef.current = shipRotation.y;
            initializedRef.current = true;
        }

        // ===== AUTO-CENTER: detect mouse idle, boost stiffness to snap behind ship =====
        const rotDelta = Math.abs(shipRotation.y - prevRotationRef.current.y)
                       + Math.abs(shipRotation.x - prevRotationRef.current.x);
        prevRotationRef.current.y = shipRotation.y;
        prevRotationRef.current.x = shipRotation.x;

        if (rotDelta > 0.0005) {
            // Rotation changed — mouse is active, reset idle timer
            lastRotationChangeTimeRef.current = state.clock.elapsedTime;
        }

        const mouseIdleTime = state.clock.elapsedTime - lastRotationChangeTimeRef.current;
        // Ramp 0→1 over AUTO_CENTER_RAMP seconds after AUTO_CENTER_DELAY seconds of idle
        const centerRatio = Math.min(
            Math.max(mouseIdleTime - AUTO_CENTER_DELAY, 0) / AUTO_CENTER_RAMP,
            1
        );
        const effectivePosStiffness = CAMERA_CONFIG.positionStiffness
            + centerRatio * (AUTO_CENTER_POS_STIFFNESS - CAMERA_CONFIG.positionStiffness);
        const effectiveLookStiffness = CAMERA_CONFIG.lookAtStiffness
            + centerRatio * (AUTO_CENTER_LOOK_STIFFNESS - CAMERA_CONFIG.lookAtStiffness);

        // ===== SPRING-DAMPER CAMERA POSITION =====
        springDamperUpdate(
            currentPositionRef.current,
            targetPosition.current,
            positionVelocityRef.current,
            effectivePosStiffness,
            CAMERA_CONFIG.positionDamping,
            dt
        );

        // ===== SPRING-DAMPER LOOK-AT =====
        springDamperUpdate(
            currentLookAtRef.current,
            targetLookAt.current,
            lookAtVelocityRef.current,
            effectiveLookStiffness,
            CAMERA_CONFIG.lookAtDamping,
            dt
        );

        // ===== DYNAMIC FOV =====
        const fovSpeedRatio = Math.min(speed / CAMERA_CONFIG.speedForMaxFOV, 1);
        const targetFOV = CAMERA_CONFIG.baseFOV + fovSpeedRatio * (CAMERA_CONFIG.maxFOV - CAMERA_CONFIG.baseFOV);
        currentFOVRef.current += (targetFOV - currentFOVRef.current) * CAMERA_CONFIG.fovLerpSpeed * dt;

        // ===== CAMERA TILT ON YAW =====
        // Calculate yaw rate from frame difference
        const yawRate = (shipRotation.y - prevYawRef.current) / Math.max(dt, 0.001);
        prevYawRef.current = shipRotation.y;

        // Target tilt proportional to yaw rate, clamped
        const targetTilt = MathUtils.clamp(
            -yawRate * 0.02,
            -CAMERA_CONFIG.maxTiltAngle,
            CAMERA_CONFIG.maxTiltAngle
        );
        currentTiltRef.current = MathUtils.lerp(
            currentTiltRef.current,
            targetTilt,
            1 - Math.exp(-CAMERA_CONFIG.tiltSpeed * dt)
        );

        // ===== APPLY TO CAMERA =====
        camera.position.copy(currentPositionRef.current);
        camera.lookAt(currentLookAtRef.current);

        // Apply tilt roll after lookAt
        camera.rotation.z += currentTiltRef.current;

        camera.fov = currentFOVRef.current;
        camera.updateProjectionMatrix();
    });

    return null;
};

export default ChaseCamera;
