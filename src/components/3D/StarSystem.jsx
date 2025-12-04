import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * StarSystem Component
 *
 * The destination after exiting the wormhole
 * Features:
 * - Dense starfield background
 * - Multiple planets orbiting a central star
 * - Nebula effects
 * - Ambient space atmosphere
 *
 * This is the portfolio exploration area where users can navigate
 * to different sections (planets = portfolio sections)
 */
const StarSystem = ({ visible = true }) => {
    const groupRef = useRef();
    const centralStarRef = useRef();

    // Planet data - each planet represents a portfolio section
    const planets = useMemo(() => [
        {
            name: "About",
            position: [8, 0, -5],
            size: 1.2,
            color: "#4f46e5", // Indigo
            orbitRadius: 8,
            orbitSpeed: 0.3,
        },
        {
            name: "Projects",
            position: [-10, 2, -3],
            size: 1.5,
            color: "#06b6d4", // Cyan
            orbitRadius: 10,
            orbitSpeed: 0.2,
        },
        {
            name: "Skills",
            position: [5, -3, -8],
            size: 1.0,
            color: "#8b5cf6", // Purple
            orbitRadius: 7,
            orbitSpeed: 0.4,
        },
        {
            name: "Contact",
            position: [-6, 1, -10],
            size: 0.9,
            color: "#10b981", // Green
            orbitRadius: 9,
            orbitSpeed: 0.25,
        },
    ], []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
        }

        if (centralStarRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
            centralStarRef.current.intensity = 3 * pulse;
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef}>
            {/* Dense starfield background */}
            <Stars
                radius={300}
                depth={100}
                count={8000}
                factor={6}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Central star (sun) */}
            <mesh position={[0, 0, -30]}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial
                    emissive="#ffaa00"
                    emissiveIntensity={2}
                    color="#ffaa00"
                />
            </mesh>

            {/* Star light source */}
            <pointLight
                ref={centralStarRef}
                position={[0, 0, -30]}
                color="#ffaa00"
                intensity={3}
                distance={100}
                decay={1}
            />

            {/* Planets (Portfolio sections) */}
            {planets.map((planet, index) => (
                <Planet
                    key={planet.name}
                    {...planet}
                    index={index}
                />
            ))}

            {/* Nebula effect (ambient particles) */}
            <NebulaEffect />

            {/* Ambient lighting */}
            <ambientLight intensity={0.3} />
            <hemisphereLight
                intensity={0.5}
                color="#ffffff"
                groundColor="#000033"
            />
        </group>
    );
};

/**
 * Planet Component
 * Individual planet with atmosphere glow
 */
const Planet = ({ position, size, color, name, orbitRadius, orbitSpeed, index }) => {
    const planetRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        if (planetRef.current) {
            // Slow rotation
            planetRef.current.rotation.y = state.clock.elapsedTime * 0.1;

            // Orbital motion around central star
            const angle = state.clock.elapsedTime * orbitSpeed + index * (Math.PI / 2);
            const x = Math.cos(angle) * orbitRadius;
            const z = -30 + Math.sin(angle) * orbitRadius;
            planetRef.current.position.set(x, position[1], z);
        }

        if (glowRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2 + 0.8;
            glowRef.current.scale.setScalar(1 + pulse * 0.1);
        }
    });

    return (
        <group ref={planetRef} position={position}>
            {/* Planet body */}
            <mesh>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    roughness={0.8}
                    metalness={0.2}
                />
            </mesh>

            {/* Atmospheric glow */}
            <mesh ref={glowRef} scale={1.2}>
                <sphereGeometry args={[size * 1.1, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Planet light */}
            <pointLight
                color={color}
                intensity={1.5}
                distance={10}
            />
        </group>
    );
};

/**
 * NebulaEffect Component
 * Creates colorful space dust particles
 */
const NebulaEffect = () => {
    const particlesRef = useRef();

    const particleData = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const nebulaColors = [
            new THREE.Color("#ff00ff"),
            new THREE.Color("#00ffff"),
            new THREE.Color("#ffaa00"),
            new THREE.Color("#00ff88"),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random position in large sphere
            const radius = 20 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = -30 + radius * Math.cos(phi);

            // Random color from nebula palette
            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        return { positions, colors, count };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleData.count}
                    array={particleData.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleData.count}
                    array={particleData.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.3}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default StarSystem;
