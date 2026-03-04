import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Trail } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { useGameMode } from '../../context/GameModeContext';

// Spacecraft model path
const SPACECRAFT_MODEL_PATH = '/models/SpaceshipCockpit.glb';

// Visual configuration
const CONFIG = {
    shipScale: 0.15,
    engineGlowIntensity: {
        idle: 0.5,
        thrust: 2.0,
        boost: 4.0,
    },
    bankingAngle: 0.3, // Max banking angle in radians
    bankingSpeed: 3.0, // How fast to bank
    trailLength: 15,
    trailWidth: 0.5,
};

/**
 * EngineGlow Component
 *
 * Creates a glowing effect behind the ship based on thrust level
 */
const EngineGlow = ({ thrustLevel, isBoosting }) => {
    const glowRef = useRef();

    useFrame((state) => {
        if (!glowRef.current) return;

        // Pulse effect
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;

        // Scale based on thrust
        const baseScale = 0.3 + thrustLevel * 0.5;
        glowRef.current.scale.setScalar(baseScale * pulse);

        // Color shift when boosting
        const intensity = isBoosting
            ? CONFIG.engineGlowIntensity.boost
            : CONFIG.engineGlowIntensity.idle + thrustLevel * (CONFIG.engineGlowIntensity.thrust - CONFIG.engineGlowIntensity.idle);

        glowRef.current.material.emissiveIntensity = intensity;
    });

    const glowColor = isBoosting ? '#ff6600' : '#00ffff';

    return (
        <group position={[0, 0, 0.8]}>
            {/* Main engine glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                    color={glowColor}
                    emissive={glowColor}
                    emissiveIntensity={CONFIG.engineGlowIntensity.idle}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Engine light */}
            <pointLight
                color={glowColor}
                intensity={2 + thrustLevel * 3}
                distance={5}
                decay={2}
            />
        </group>
    );
};

/**
 * PilotableSpaceship Component
 *
 * Renders the player's spaceship with:
 * - Ship model
 * - Engine glow effect based on thrust
 * - Banking animation when turning
 * - Optional exhaust trail
 */
const PilotableSpaceship = () => {
    const { scene } = useGLTF(SPACECRAFT_MODEL_PATH);
    const {
        shipPosition,
        shipRotation,
        shipVelocity,
        thrustLevel,
        isBoosting,
    } = useGameMode();

    const groupRef = useRef();
    const meshRef = useRef();
    const bankingRef = useRef(0);

    // Clone scene to avoid conflicts
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Calculate banking based on turning
    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) return;

        // Update group position and rotation from game state
        groupRef.current.position.copy(shipPosition);
        groupRef.current.rotation.copy(shipRotation);

        // Calculate banking based on velocity direction vs facing direction
        // When turning, the ship should bank in the direction of the turn
        const speed = shipVelocity.length();
        const turnRate = shipRotation.y; // Current yaw

        // Smooth banking
        const targetBank = -turnRate * CONFIG.bankingAngle * Math.min(speed / 30, 1);
        bankingRef.current += (targetBank - bankingRef.current) * CONFIG.bankingSpeed * delta;

        // Apply banking to the mesh (local rotation)
        meshRef.current.rotation.z = bankingRef.current;
    });

    return (
        <group ref={groupRef}>
            {/* Ship model with banking */}
            <group ref={meshRef}>
                <primitive
                    object={clonedScene}
                    scale={CONFIG.shipScale}
                    rotation={[0, Math.PI, 0]} // Face forward
                />

                {/* Engine glow effects */}
                <EngineGlow thrustLevel={thrustLevel} isBoosting={isBoosting} />

                {/* Secondary engine glows (left and right) */}
                <group position={[-0.3, -0.1, 0.6]}>
                    <pointLight
                        color={isBoosting ? '#ff6600' : '#00ffff'}
                        intensity={1 + thrustLevel * 2}
                        distance={3}
                        decay={2}
                    />
                </group>
                <group position={[0.3, -0.1, 0.6]}>
                    <pointLight
                        color={isBoosting ? '#ff6600' : '#00ffff'}
                        intensity={1 + thrustLevel * 2}
                        distance={3}
                        decay={2}
                    />
                </group>
            </group>

            {/* Trail effect when moving */}
            {thrustLevel > 0.1 && (
                <Trail
                    width={CONFIG.trailWidth * (isBoosting ? 2 : 1)}
                    length={CONFIG.trailLength}
                    color={isBoosting ? new Color('#ff6600') : new Color('#00ffff')}
                    attenuation={(t) => t * t}
                    target={meshRef}
                />
            )}

            {/* Ship lighting */}
            <pointLight
                position={[0, 0.5, 0]}
                color="#ffffff"
                intensity={0.5}
                distance={3}
            />
        </group>
    );
};

export default PilotableSpaceship;
