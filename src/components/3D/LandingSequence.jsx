import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3, Quaternion, Matrix4 } from 'three';
import { useGameMode } from '../../context/GameModeContext';

// Spacecraft model path
const SPACECRAFT_MODEL_PATH = '/models/SpaceshipCockpit.glb';

// Landing animation configuration
const LANDING_CONFIG = {
    // Phase durations (seconds)
    decelerationDuration: 2.0,
    approachDuration: 3.0,
    descentDuration: 2.5,
    touchdownDuration: 1.0,

    // Approach settings
    approachAltitude: 15, // Height above planet to start descent
    landingOffset: [5, 0, 8], // Final landing position relative to planet

    // Animation settings
    rotationLerpSpeed: 2.0,
    positionLerpSpeed: 1.5,
    shipScale: 0.15,
};

// Takeoff configuration
const TAKEOFF_CONFIG = {
    ascentDuration: 2.0,
    departDuration: 2.5,
    ascentAltitude: 20,
};

// Easing functions
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * LandingSequence Component
 *
 * Handles the animated landing/takeoff sequence:
 *
 * Landing Phases:
 * 1. Deceleration: Ship slows to stop
 * 2. Approach: Ship aligns and moves toward planet
 * 3. Descent: Vertical drop to surface
 * 4. Touchdown: Final landing animation
 *
 * Takeoff Phases:
 * 1. Ascent: Ship rises from surface
 * 2. Depart: Ship moves away and transitions to piloting
 */
const LandingSequence = () => {
    const { scene } = useGLTF(SPACECRAFT_MODEL_PATH);
    const { camera } = useThree();

    const {
        landedPlanet,
        landingPhase,
        setLandingPhase,
        completeLanding,
        completeTakeoff,
        shipPosition,
        shipRotation,
        updateShipState,
    } = useGameMode();

    const groupRef = useRef();
    const animationState = useRef({
        elapsedTime: 0,
        phase: null,
        startPosition: new Vector3(),
        targetPosition: new Vector3(),
        startRotation: new Quaternion(),
        targetRotation: new Quaternion(),
        planetPosition: new Vector3(),
    });

    // Temp objects for calculations
    const tempVec = useRef(new Vector3());
    const tempQuat = useRef(new Quaternion());
    const tempMatrix = useRef(new Matrix4());

    // Clone scene
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Initialize animation when landing phase changes
    useEffect(() => {
        if (!landedPlanet) return;

        const state = animationState.current;

        // Calculate planet's current position
        const time = Date.now() * 0.001;
        const angle = time * landedPlanet.orbitSpeed;
        state.planetPosition.set(
            Math.cos(angle) * landedPlanet.orbitRadius,
            0,
            Math.sin(angle) * landedPlanet.orbitRadius
        );

        if (landingPhase === 'approaching') {
            state.elapsedTime = 0;
            state.phase = 'deceleration';
            state.startPosition.copy(shipPosition);
            state.startRotation.setFromEuler(shipRotation);

            // Calculate approach target (above planet)
            state.targetPosition.copy(state.planetPosition);
            state.targetPosition.y += LANDING_CONFIG.approachAltitude;

        } else if (landingPhase === 'taking_off') {
            state.elapsedTime = 0;
            state.phase = 'ascent';
            state.startPosition.copy(state.planetPosition);
            state.startPosition.add(new Vector3(...LANDING_CONFIG.landingOffset));

            // Target: above planet
            state.targetPosition.copy(state.planetPosition);
            state.targetPosition.y += TAKEOFF_CONFIG.ascentAltitude;
        }
    }, [landingPhase, landedPlanet, shipPosition, shipRotation]);

    // Animation loop
    useFrame((state, delta) => {
        if (!groupRef.current || !landedPlanet) return;

        const anim = animationState.current;
        anim.elapsedTime += delta;

        // LANDING SEQUENCE
        if (landingPhase === 'approaching') {
            const { decelerationDuration, approachDuration, descentDuration, touchdownDuration } = LANDING_CONFIG;

            // Phase 1: Deceleration
            if (anim.phase === 'deceleration') {
                const progress = Math.min(anim.elapsedTime / decelerationDuration, 1);
                const eased = easeOutCubic(progress);

                // Slow down and start turning toward planet
                tempVec.current.lerpVectors(anim.startPosition, anim.targetPosition, eased * 0.1);
                groupRef.current.position.copy(tempVec.current);

                if (progress >= 1) {
                    anim.phase = 'approach';
                    anim.elapsedTime = 0;
                    anim.startPosition.copy(groupRef.current.position);
                }
            }

            // Phase 2: Approach
            else if (anim.phase === 'approach') {
                const progress = Math.min(anim.elapsedTime / approachDuration, 1);
                const eased = easeInOutQuad(progress);

                // Move toward approach point
                tempVec.current.lerpVectors(anim.startPosition, anim.targetPosition, eased);
                groupRef.current.position.copy(tempVec.current);

                // Rotate to face down toward planet
                if (progress > 0.5) {
                    const rotProgress = (progress - 0.5) * 2;
                    groupRef.current.rotation.x = -Math.PI / 6 * rotProgress;
                }

                if (progress >= 1) {
                    anim.phase = 'descent';
                    anim.elapsedTime = 0;
                    anim.startPosition.copy(groupRef.current.position);

                    // Set descent target (landing position)
                    anim.targetPosition.copy(anim.planetPosition);
                    anim.targetPosition.add(new Vector3(...LANDING_CONFIG.landingOffset));
                }
            }

            // Phase 3: Descent
            else if (anim.phase === 'descent') {
                const progress = Math.min(anim.elapsedTime / descentDuration, 1);
                const eased = easeOutCubic(progress);

                // Descend to surface
                tempVec.current.lerpVectors(anim.startPosition, anim.targetPosition, eased);
                groupRef.current.position.copy(tempVec.current);

                // Level out rotation
                groupRef.current.rotation.x *= (1 - progress);

                if (progress >= 1) {
                    anim.phase = 'touchdown';
                    anim.elapsedTime = 0;
                }
            }

            // Phase 4: Touchdown
            else if (anim.phase === 'touchdown') {
                const progress = Math.min(anim.elapsedTime / touchdownDuration, 1);

                // Subtle bounce effect
                const bounce = Math.sin(progress * Math.PI) * 0.2;
                groupRef.current.position.y = anim.targetPosition.y + bounce;

                if (progress >= 1) {
                    setLandingPhase('touched_down');
                    completeLanding();
                }
            }
        }

        // TAKEOFF SEQUENCE
        else if (landingPhase === 'taking_off') {
            const { ascentDuration, departDuration } = TAKEOFF_CONFIG;

            // Phase 1: Ascent
            if (anim.phase === 'ascent') {
                const progress = Math.min(anim.elapsedTime / ascentDuration, 1);
                const eased = easeInOutQuad(progress);

                // Rise up
                tempVec.current.lerpVectors(anim.startPosition, anim.targetPosition, eased);
                groupRef.current.position.copy(tempVec.current);

                if (progress >= 1) {
                    anim.phase = 'depart';
                    anim.elapsedTime = 0;
                    anim.startPosition.copy(groupRef.current.position);

                    // Depart target: away from planet
                    anim.targetPosition.copy(anim.startPosition);
                    anim.targetPosition.y += 30;
                    anim.targetPosition.x += 50;
                }
            }

            // Phase 2: Depart
            else if (anim.phase === 'depart') {
                const progress = Math.min(anim.elapsedTime / departDuration, 1);
                const eased = easeOutCubic(progress);

                tempVec.current.lerpVectors(anim.startPosition, anim.targetPosition, eased);
                groupRef.current.position.copy(tempVec.current);

                if (progress >= 1) {
                    // Update ship state to final position
                    const finalPos = groupRef.current.position.clone();
                    const finalRot = groupRef.current.rotation.clone();
                    updateShipState(finalPos, new Vector3(0, 0, 0), finalRot);

                    completeTakeoff();
                }
            }
        }

        // Update camera to follow ship
        const cameraOffset = new Vector3(0, 8, 20);
        cameraOffset.applyQuaternion(tempQuat.current.setFromEuler(groupRef.current.rotation));
        camera.position.copy(groupRef.current.position).add(cameraOffset);
        camera.lookAt(groupRef.current.position);
    });

    if (!landedPlanet || (landingPhase !== 'approaching' && landingPhase !== 'taking_off')) {
        return null;
    }

    return (
        <group ref={groupRef} position={shipPosition.toArray()}>
            <primitive
                object={clonedScene}
                scale={LANDING_CONFIG.shipScale}
                rotation={[0, Math.PI, 0]}
            />

            {/* Landing lights */}
            <pointLight
                position={[0, -0.5, 0]}
                color="#00ff00"
                intensity={3}
                distance={10}
            />
            <pointLight
                position={[0, 0, 0.5]}
                color="#00ffff"
                intensity={2}
                distance={5}
            />
        </group>
    );
};

export default LandingSequence;
