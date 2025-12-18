import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LaunchSequence Component - TRUE FPP Cockpit View
 *
 * Complete cinematic launch sequence from INSIDE cockpit perspective:
 * 1. User types "launch" in terminal (handled by parent)
 * 2. Countdown: 3... 2... 1... GO! with Countdown.mp3
 * 3. Camera STAYS IN COCKPIT (FPP view maintained)
 * 4. Wormhole MOVES TOWARD camera (not camera toward wormhole)
 * 5. Stars stream toward camera as speed increases
 * 6. Relativistic effects: FOV increase, camera shake, background rotation
 * 7. Wormhole engulfs cockpit with white flash
 * 8. Hold white for 0.5s
 * 9. Fade from white revealing star system
 *
 * Key features:
 * - TRUE First Person Perspective - camera never leaves cockpit
 * - Cockpit visible throughout entire sequence
 * - Wormhole approaches camera
 * - Camera shake intensity based on speed
 * - Star streaking toward camera
 * - Smooth exponential acceleration
 * - White flash transition
 * - Background rotation synced to velocity (relativistic physics)
 */
const LaunchSequence = ({
    isActive,
    onSequenceComplete,
    wormholeRef, // Need ref to the wormhole to move it
    initialWormholePosition = [0, 0, -300], // Wormhole starts 300 units away
    onVelocityChange, // Callback to pass velocity to parent for background rotation
}) => {
    const { camera } = useThree();
    const [phase, setPhase] = useState("idle"); // idle, traveling, entering, portal, exiting, complete
    const [whiteFlashOpacity, setWhiteFlashOpacity] = useState(0);

    // Animation state
    const animationState = useRef({
        startTime: 0,
        elapsedTime: 0,
        initialCameraPos: new THREE.Vector3(),
        initialWormholeZ: initialWormholePosition[2],
        speed: 0,
        maxSpeed: 15, // Max speed value
        targetWormholeZ: 0, // Wormhole moves to camera position (fully engulfs it)
    });

    // Initialize - camera stays in place!
    useEffect(() => {
        if (isActive && phase === "idle") {
            // Store initial camera position (never changes - TRUE FPP!)
            animationState.current.initialCameraPos.copy(camera.position);
            animationState.current.startTime = Date.now();
            animationState.current.elapsedTime = 0;
            animationState.current.speed = 0;

            // Get actual wormhole position from ref
            if (wormholeRef?.current) {
                animationState.current.initialWormholeZ = wormholeRef.current.position.z;
            }

            // Set target to camera position so wormhole fully engulfs it
            animationState.current.targetWormholeZ = camera.position.z + 5; // Move 5 units past camera

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

        // === PHASE 1: TRAVELING - WORMHOLE APPROACHES CAMERA ===
        if (phase === "traveling") {
            // Acceleration (0-10 seconds) - exponential ease-in
            const duration = 10; // 10 seconds for wormhole to reach camera
            const progress = Math.min(t / duration, 1);
            const easedProgress = Math.pow(progress, 2); // Quadratic ease-in

            animationState.current.speed = easedProgress * animationState.current.maxSpeed;

            // Pass velocity factor to parent (0-1 range for background rotation)
            if (onVelocityChange) {
                onVelocityChange(easedProgress);
            }

            // === WORMHOLE MOVEMENT (moves TOWARD camera) ===
            if (wormholeRef?.current) {
                const wormholeTotalDistance = animationState.current.initialWormholeZ - animationState.current.targetWormholeZ;
                const wormholeTraveledDistance = easedProgress * wormholeTotalDistance;
                const newWormholeZ = animationState.current.initialWormholeZ - wormholeTraveledDistance;

                wormholeRef.current.position.z = newWormholeZ;
            }

            // === CAMERA STAYS IN COCKPIT - ONLY SHAKE ===
            const speedRatio = animationState.current.speed / animationState.current.maxSpeed;
            const shakeIntensity = speedRatio * 0.01; // Reduced from 0.08 for smoother experience
            const shakeX = Math.sin(state.clock.elapsedTime * 20) * shakeIntensity;
            const shakeY = Math.cos(state.clock.elapsedTime * 15) * shakeIntensity;

            // Camera only shakes, doesn't move forward/backward
            camera.position.set(
                animationState.current.initialCameraPos.x + shakeX,
                animationState.current.initialCameraPos.y + shakeY,
                animationState.current.initialCameraPos.z // Z NEVER CHANGES - TRUE FPP!
            );

            // FOV increase (speed tunnel effect)
            const newFov = 75 + speedRatio * 35; // 75 to 110 degrees
            if (Math.abs(camera.fov - newFov) > 0.1) {
                camera.fov = newFov;
                camera.updateProjectionMatrix();
            }

            // Check if wormhole has reached camera
            if (progress >= 0.99) {
                console.log("⚡ Wormhole engulfing cockpit!");
                console.log("Final wormhole Z:", wormholeRef?.current?.position.z);
                console.log("Camera stayed at Z:", camera.position.z);
                setPhase("entering");
                animationState.current.elapsedTime = 0;
            }
        }

        // === PHASE 2: ENTERING WORMHOLE (instant white flash) ===
        else if (phase === "entering") {
            // Keep velocity at max during entry
            if (onVelocityChange) {
                onVelocityChange(1);
            }
            // Rapid white flash (0.3 seconds)
            const flashTime = Math.min(t / 0.3, 1);
            setWhiteFlashOpacity(flashTime);

            if (flashTime >= 1) {
                console.log("🌀 Inside wormhole portal!");
                setPhase("portal");
                animationState.current.elapsedTime = 0;
            }
        }

        // === PHASE 3: PORTAL TRANSIT (white screen holds) ===
        else if (phase === "portal") {
            // Maintain max velocity during portal transit
            if (onVelocityChange) {
                onVelocityChange(1);
            }
            // Hold white screen for 0.5 seconds
            if (t > 0.5) {
                console.log("✨ Exiting wormhole!");
                setPhase("exiting");
                animationState.current.elapsedTime = 0;

                // Transition to exploration mode immediately
                // This hides cockpit and moves camera before white flash fades
                if (onSequenceComplete) {
                    onSequenceComplete();
                }
            }
        }

        // === PHASE 4: EXITING WORMHOLE (fade from white) ===
        else if (phase === "exiting") {
            // Fade from white to reveal star system (2 seconds)
            const fadeTime = Math.min(t / 2, 1);
            setWhiteFlashOpacity(1 - fadeTime);

            // Gradually reduce velocity during exit
            if (onVelocityChange) {
                onVelocityChange(1 - fadeTime * 0.5); // Reduce to 50% velocity
            }

            // Restore normal FOV
            const restoredFov = THREE.MathUtils.lerp(camera.fov, 75, delta * 2);
            camera.fov = restoredFov;
            camera.updateProjectionMatrix();

            // Reset camera shake
            const restoredX = THREE.MathUtils.lerp(
                camera.position.x,
                animationState.current.initialCameraPos.x,
                delta * 3
            );
            const restoredY = THREE.MathUtils.lerp(
                camera.position.y,
                animationState.current.initialCameraPos.y,
                delta * 3
            );
            camera.position.set(restoredX, restoredY, camera.position.z);

            if (fadeTime >= 1) {
                console.log("🌟 Star system revealed!");
                setPhase("complete");
                // onSequenceComplete already called at start of exiting phase
            }
        }
    });

    return (
        <>
            {/* White flash overlay for wormhole entry/exit */}
            {whiteFlashOpacity > 0 && (
                <mesh position={[0, 0, camera.position.z - 1]}>
                    <planeGeometry args={[200, 200]} />
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
 * Seeded random number generator for consistent star positions
 */
const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * StarStreaks Component
 * Creates the hyperspace star streaking effect
 * Stars move toward camera as speed increases
 */
const StarStreaks = ({ speed = 0, maxSpeed = 1, cameraZ = 0 }) => {
    const pointsRef = useRef();
    const speedRatio = speed / maxSpeed;

    // Generate star positions using seeded random for consistency
    const { positions, velocities } = useMemo(() => {
        const count = 1000;
        const pos = new Float32Array(count * 3);
        const vel = [];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Use seeded random based on index
            const x = (seededRandom(i * 3.14159) - 0.5) * 100;
            const y = (seededRandom(i * 2.71828) - 0.5) * 100;
            const z = -seededRandom(i * 1.41421) * 200 - 10; // Behind camera

            pos[i3] = x;
            pos[i3 + 1] = y;
            pos[i3 + 2] = z;

            vel.push({
                speed: 0.5 + seededRandom(i * 1.61803) * 1.5,
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
            pos[i3 + 2] += speed * delta * 50 * velocities[i].speed;

            // Reset stars that pass the camera
            if (pos[i3 + 2] > cameraZ + 10) {
                pos[i3 + 2] = cameraZ - 200;
                // Use seeded random for reset positions
                pos[i3] = (seededRandom(i * 3.14159 + state.clock.elapsedTime) - 0.5) * 100;
                pos[i3 + 1] = (seededRandom(i * 2.71828 + state.clock.elapsedTime) - 0.5) * 100;
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
                size={0.1 + speedRatio * 0.4} // Size increases with speed
                color="#ffffff"
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default LaunchSequence;
