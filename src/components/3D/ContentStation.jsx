import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Vector3 } from 'three';
import { useGameMode } from '../../context/GameModeContext';

/**
 * Station configuration
 */
const STATION_CONFIG = {
    // Geometry
    baseRadius: 0.8,
    baseHeight: 0.3,
    pillarRadius: 0.15,
    pillarHeight: 2,
    topRadius: 1.2,
    topHeight: 0.1,

    // Hologram
    hologramHeight: 1.5,
    hologramScale: 0.8,

    // Interaction
    interactionRadius: 3,

    // Animation
    rotationSpeed: 0.5,
    pulseSpeed: 2,
    glowIntensity: {
        idle: 0.5,
        active: 1.5,
    },
};

/**
 * ContentStation Component
 *
 * Interactive holographic terminal/kiosk for exploring content:
 * - Glowing pedestal design
 * - Holographic label display
 * - Proximity detection for interaction
 * - Visual feedback when player is nearby
 */
const ContentStation = ({
    position = [0, 0, 0],
    label = 'Station',
    sectionId,
    color = '#00ffff',
    onInteract,
}) => {
    const { characterPosition } = useGameMode();

    const groupRef = useRef();
    const hologramRef = useRef();
    const [isNearby, setIsNearby] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useFrame((state) => {
        if (!groupRef.current || !hologramRef.current) return;

        // Check proximity to player
        const stationPos = new Vector3(...position);
        const distance = characterPosition.distanceTo(stationPos);
        const nearby = distance < STATION_CONFIG.interactionRadius;
        setIsNearby(nearby);

        // Hologram rotation
        hologramRef.current.rotation.y += STATION_CONFIG.rotationSpeed * 0.01;

        // Pulse effect
        const pulse = 1 + Math.sin(state.clock.elapsedTime * STATION_CONFIG.pulseSpeed) * 0.1;
        const scale = nearby ? STATION_CONFIG.hologramScale * 1.2 * pulse : STATION_CONFIG.hologramScale * pulse;
        hologramRef.current.scale.setScalar(scale);
    });

    const glowIntensity = isNearby
        ? STATION_CONFIG.glowIntensity.active
        : STATION_CONFIG.glowIntensity.idle;

    return (
        <group ref={groupRef} position={position}>
            {/* Base platform */}
            <mesh position={[0, STATION_CONFIG.baseHeight / 2, 0]} receiveShadow>
                <cylinderGeometry args={[STATION_CONFIG.baseRadius, STATION_CONFIG.baseRadius * 1.2, STATION_CONFIG.baseHeight, 6]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Central pillar */}
            <mesh position={[0, STATION_CONFIG.baseHeight + STATION_CONFIG.pillarHeight / 2, 0]}>
                <cylinderGeometry args={[STATION_CONFIG.pillarRadius, STATION_CONFIG.pillarRadius, STATION_CONFIG.pillarHeight, 8]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={glowIntensity * 0.5}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            {/* Top platform */}
            <mesh position={[0, STATION_CONFIG.baseHeight + STATION_CONFIG.pillarHeight + STATION_CONFIG.topHeight / 2, 0]}>
                <cylinderGeometry args={[STATION_CONFIG.topRadius, STATION_CONFIG.topRadius * 0.8, STATION_CONFIG.topHeight, 6]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={glowIntensity}
                    metalness={0.7}
                    roughness={0.3}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Hologram display */}
            <group
                ref={hologramRef}
                position={[0, STATION_CONFIG.baseHeight + STATION_CONFIG.pillarHeight + STATION_CONFIG.hologramHeight, 0]}
            >
                {/* Holographic ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.6, 0.05, 8, 32]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={glowIntensity}
                        transparent
                        opacity={0.7}
                    />
                </mesh>

                {/* Inner holographic sphere */}
                <mesh>
                    <icosahedronGeometry args={[0.3, 1]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={glowIntensity * 1.5}
                        transparent
                        opacity={0.5}
                        wireframe
                    />
                </mesh>

                {/* Label text */}
                <Text
                    position={[0, 0.8, 0]}
                    fontSize={0.25}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Orbitron-Bold.woff"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {label.toUpperCase()}
                </Text>
            </group>

            {/* Interaction prompt */}
            {isNearby && (
                <group position={[0, STATION_CONFIG.baseHeight + STATION_CONFIG.pillarHeight + STATION_CONFIG.hologramHeight + 1.5, 0]}>
                    <Text
                        fontSize={0.2}
                        color="#00ff00"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Rajdhani-Bold.woff"
                    >
                        [E] INTERACT
                    </Text>
                </group>
            )}

            {/* Station light */}
            <pointLight
                position={[0, STATION_CONFIG.baseHeight + STATION_CONFIG.pillarHeight + 0.5, 0]}
                color={color}
                intensity={isNearby ? 3 : 1}
                distance={isNearby ? 8 : 5}
            />

            {/* Ground glow */}
            <mesh
                position={[0, 0.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[STATION_CONFIG.baseRadius * 1.5, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={isNearby ? 0.3 : 0.1}
                />
            </mesh>
        </group>
    );
};

export default ContentStation;
