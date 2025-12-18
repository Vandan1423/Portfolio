import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Animation phase durations (seconds)
const DURATION_TRAVEL = 10;
const DURATION_FLASH_IN = 0.3;
const DURATION_PORTAL_HOLD = 0.5;
const DURATION_FADE_OUT = 2;

// Camera effects
const CAMERA_SHAKE_INTENSITY = 0.01;
const CAMERA_SHAKE_FREQUENCY_X = 20;
const CAMERA_SHAKE_FREQUENCY_Y = 15;
const FOV_NORMAL = 75;
const FOV_MAX_INCREASE = 35; // 75 + 35 = 110 degrees at max speed
const FOV_LERP_SPEED = 2;

// Wormhole positioning
const WORMHOLE_OVERSHOOT = 5; // Units past camera for full engulfment
const TRAVEL_COMPLETION_THRESHOLD = 0.99;

// Speed and velocity
const MAX_SPEED = 15;
const VELOCITY_EXIT_REDUCTION = 0.5; // Reduce to 50% during exit

// Camera restoration during exit
const CAMERA_RESTORE_LERP_SPEED = 3;

// White flash overlay
const FLASH_OVERLAY_SIZE = 200;
const FLASH_OVERLAY_DISTANCE = 1; // Distance in front of camera

// Star streaks configuration
const STAR_COUNT = 1000;
const STAR_SPREAD_XY = 100;
const STAR_DEPTH_RANGE = 200;
const STAR_MIN_DISTANCE = 10;
const STAR_MOVEMENT_SPEED = 50;
const STAR_RESET_DISTANCE = 10;
const STAR_SIZE_MIN = 0.1;
const STAR_SIZE_MAX_INCREASE = 0.4;
const STAR_OPACITY = 0.8;
const STAR_MIN_VELOCITY = 0.5;
const STAR_MAX_VELOCITY_RANGE = 1.5;

// Seeded random constants (mathematical constants for variation)
const SEED_X = 3.14159;
const SEED_Y = 2.71828;
const SEED_Z = 1.41421;
const SEED_VEL = 1.61803;

/**
 * Seeded random number generator for consistent star positions
 */
const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * LaunchSequence Component
 *
 * Cinematic launch sequence with true first-person perspective
 * Camera remains in cockpit while wormhole approaches
 *
 * Phases:
 * 1. Traveling: Wormhole approaches, camera shakes, FOV increases
 * 2. Entering: White flash as wormhole engulfs cockpit
 * 3. Portal: Hold white screen
 * 4. Exiting: Fade to reveal star system
 *
 * @param {boolean} isActive - Whether sequence is active
 * @param {function} onSequenceComplete - Callback when sequence completes
 * @param {object} wormholeRef - Reference to wormhole object to animate
 * @param {array} initialWormholePosition - Starting position [x, y, z]
 * @param {function} onVelocityChange - Callback for velocity updates (0-1 range)
 */
const LaunchSequence = ({
    isActive,
    onSequenceComplete,
    wormholeRef,
    initialWormholePosition = [0, 0, -300],
    onVelocityChange,
}) => {
    const { camera } = useThree();
    const [phase, setPhase] = useState("idle");
    const [whiteFlashOpacity, setWhiteFlashOpacity] = useState(0);

    // Animation state
    const animationState = useRef({
        startTime: 0,
        elapsedTime: 0,
        initialCameraPos: new THREE.Vector3(),
        initialWormholeZ: initialWormholePosition[2],
        speed: 0,
        maxSpeed: MAX_SPEED,
        targetWormholeZ: 0,
    });

    // Initialize sequence - camera stays in place (true FPP)
    useEffect(() => {
        if (isActive && phase === "idle") {
            animationState.current.initialCameraPos.copy(camera.position);
            animationState.current.startTime = Date.now();
            animationState.current.elapsedTime = 0;
            animationState.current.speed = 0;

            // Get actual wormhole position from ref
            if (wormholeRef?.current) {
                animationState.current.initialWormholeZ = wormholeRef.current.position.z;
            }

            // Set target so wormhole fully engulfs camera
            animationState.current.targetWormholeZ = camera.position.z + WORMHOLE_OVERSHOOT;

            console.log("🚀 Launch sequence initiated - TRUE FPP View!");
            console.log("Camera stays at:", camera.position);
            console.log("Wormhole will move from", animationState.current.initialWormholeZ, "to", animationState.current.targetWormholeZ);
            setPhase("traveling");
        }
    }, [isActive, phase, camera, wormholeRef]);

    useFrame((state, delta) => {
        if (!isActive) return;

        animationState.current.elapsedTime += delta;
        const t = animationState.current.elapsedTime;

        // Phase 1: Traveling - Wormhole approaches camera
        if (phase === "traveling") {
            const progress = Math.min(t / DURATION_TRAVEL, 1);
            const easedProgress = Math.pow(progress, 2); // Quadratic ease-in

            animationState.current.speed = easedProgress * animationState.current.maxSpeed;

            // Update velocity for parent (background rotation)
            onVelocityChange?.(easedProgress);

            // Move wormhole toward camera
            if (wormholeRef?.current) {
                const totalDistance = animationState.current.initialWormholeZ - animationState.current.targetWormholeZ;
                const traveledDistance = easedProgress * totalDistance;
                wormholeRef.current.position.z = animationState.current.initialWormholeZ - traveledDistance;
            }

            // Camera shake based on speed
            const speedRatio = animationState.current.speed / animationState.current.maxSpeed;
            const shakeIntensity = speedRatio * CAMERA_SHAKE_INTENSITY;
            const shakeX = Math.sin(state.clock.elapsedTime * CAMERA_SHAKE_FREQUENCY_X) * shakeIntensity;
            const shakeY = Math.cos(state.clock.elapsedTime * CAMERA_SHAKE_FREQUENCY_Y) * shakeIntensity;

            camera.position.set(
                animationState.current.initialCameraPos.x + shakeX,
                animationState.current.initialCameraPos.y + shakeY,
                animationState.current.initialCameraPos.z // Z never changes (true FPP)
            );

            // FOV increase for speed tunnel effect
            const newFov = FOV_NORMAL + speedRatio * FOV_MAX_INCREASE;
            if (Math.abs(camera.fov - newFov) > 0.1) {
                camera.fov = newFov;
                camera.updateProjectionMatrix();
            }

            // Check if wormhole has reached camera
            if (progress >= TRAVEL_COMPLETION_THRESHOLD) {
                console.log("⚡ Wormhole engulfing cockpit!");
                console.log("Final wormhole Z:", wormholeRef?.current?.position.z);
                console.log("Camera stayed at Z:", camera.position.z);
                setPhase("entering");
                animationState.current.elapsedTime = 0;
            }
        }

        // Phase 2: Entering wormhole (white flash)
        else if (phase === "entering") {
            onVelocityChange?.(1); // Max velocity during entry

            const flashProgress = Math.min(t / DURATION_FLASH_IN, 1);
            setWhiteFlashOpacity(flashProgress);

            if (flashProgress >= 1) {
                console.log("🌀 Inside wormhole portal!");
                setPhase("portal");
                animationState.current.elapsedTime = 0;
            }
        }

        // Phase 3: Portal transit (white screen hold)
        else if (phase === "portal") {
            onVelocityChange?.(1); // Maintain max velocity

            if (t > DURATION_PORTAL_HOLD) {
                console.log("✨ Exiting wormhole!");
                setPhase("exiting");
                animationState.current.elapsedTime = 0;

                // Trigger exploration mode transition
                onSequenceComplete?.();
            }
        }

        // Phase 4: Exiting wormhole (fade from white)
        else if (phase === "exiting") {
            const fadeProgress = Math.min(t / DURATION_FADE_OUT, 1);
            setWhiteFlashOpacity(1 - fadeProgress);

            // Gradually reduce velocity
            onVelocityChange?.(1 - fadeProgress * VELOCITY_EXIT_REDUCTION);

            // Restore normal FOV
            camera.fov = THREE.MathUtils.lerp(camera.fov, FOV_NORMAL, delta * FOV_LERP_SPEED);
            camera.updateProjectionMatrix();

            // Reset camera shake
            const restoredX = THREE.MathUtils.lerp(
                camera.position.x,
                animationState.current.initialCameraPos.x,
                delta * CAMERA_RESTORE_LERP_SPEED
            );
            const restoredY = THREE.MathUtils.lerp(
                camera.position.y,
                animationState.current.initialCameraPos.y,
                delta * CAMERA_RESTORE_LERP_SPEED
            );
            camera.position.set(restoredX, restoredY, camera.position.z);

            if (fadeProgress >= 1) {
                console.log("🌟 Star system revealed!");
                setPhase("complete");
            }
        }
    });

    return (
        <>
            {/* White flash overlay for wormhole entry/exit */}
            {whiteFlashOpacity > 0 && (
                <mesh position={[0, 0, camera.position.z - FLASH_OVERLAY_DISTANCE]}>
                    <planeGeometry args={[FLASH_OVERLAY_SIZE, FLASH_OVERLAY_SIZE]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={whiteFlashOpacity}
                        depthTest={false}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Star streaking effect during travel */}
            {phase === "traveling" && (
                <StarStreaks
                    speed={animationState.current.speed}
                    maxSpeed={animationState.current.maxSpeed}
                    cameraZ={camera.position.z}
                />
            )}
        </>
    );
};

/**
 * StarStreaks Component
 *
 * Creates hyperspace star streaking effect
 * Stars move toward camera as speed increases
 *
 * @param {number} speed - Current speed value
 * @param {number} maxSpeed - Maximum speed value
 * @param {number} cameraZ - Camera Z position for star reset
 */
const StarStreaks = ({ speed = 0, maxSpeed = 1, cameraZ = 0 }) => {
    const pointsRef = useRef();
    const speedRatio = speed / maxSpeed;

    // Generate star positions using seeded random for consistency
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(STAR_COUNT * 3);
        const vel = [];

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;

            // Seeded random positions for consistency
            const x = (seededRandom(i * SEED_X) - 0.5) * STAR_SPREAD_XY;
            const y = (seededRandom(i * SEED_Y) - 0.5) * STAR_SPREAD_XY;
            const z = -seededRandom(i * SEED_Z) * STAR_DEPTH_RANGE - STAR_MIN_DISTANCE;

            pos[i3] = x;
            pos[i3 + 1] = y;
            pos[i3 + 2] = z;

            vel.push({
                speed: STAR_MIN_VELOCITY + seededRandom(i * SEED_VEL) * STAR_MAX_VELOCITY_RANGE,
            });
        }

        return { positions: pos, velocities: vel };
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const pos = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < pos.length / 3; i++) {
            const i3 = i * 3;

            // Move stars toward camera based on speed
            pos[i3 + 2] += speed * delta * STAR_MOVEMENT_SPEED * velocities[i].speed;

            // Reset stars that pass the camera
            if (pos[i3 + 2] > cameraZ + STAR_RESET_DISTANCE) {
                pos[i3 + 2] = cameraZ - STAR_DEPTH_RANGE;
                // Randomize X/Y positions on reset
                pos[i3] = (seededRandom(i * SEED_X + state.clock.elapsedTime) - 0.5) * STAR_SPREAD_XY;
                pos[i3 + 1] = (seededRandom(i * SEED_Y + state.clock.elapsedTime) - 0.5) * STAR_SPREAD_XY;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={STAR_SIZE_MIN + speedRatio * STAR_SIZE_MAX_INCREASE}
                color="#ffffff"
                transparent
                opacity={STAR_OPACITY}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default LaunchSequence;
