import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import HolographicTerminal from "./HolographicTerminal";
import * as THREE from "three";

// Cockpit model configuration
const COCKPIT_MODEL_PATH = "/models/SpaceshipCockpit.glb";
const COCKPIT_POSITION = [0, 0.2, -0.5];
const COCKPIT_ROTATION = [0, Math.PI / 2, 0];
const COCKPIT_SCALE = 1.5;

// Terminal position
const TERMINAL_POSITION = [0, -0.3, -2];

// Static background configuration
const BACKGROUND_IMAGE = '/images/SpaceCubeMap/Star2.jpeg';
const BACKGROUND_SPHERE_RADIUS = 200;

// Lighting configuration - array of light settings for easier management
const COCKPIT_LIGHTS = [
    { position: [0, 0, -2], color: "#00ff88", intensity: 2, distance: 5 },      // Terminal green glow
    { position: [1.5, -0.5, -2], color: "#06b6d4", intensity: 1.5, distance: 3 }, // Cyan right
    { position: [-1.5, -0.5, -2], color: "#3b82f6", intensity: 1.5, distance: 3 }, // Blue left
    { position: [0, 1.5, 0], color: "#ffffff", intensity: 1, distance: 4 },      // White overhead
    { position: [0, 0, 2], color: "#6366f1", intensity: 0.8, distance: 3 },      // Indigo rear
];

/**
 * StaticSpaceBackground Component
 * Uses single static texture instead of full cube map for better performance
 */
const StaticSpaceBackground = () => {
    const texture = useMemo(() => {
        const loader = new THREE.TextureLoader();
        const tex = loader.load(BACKGROUND_IMAGE);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, []);

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[BACKGROUND_SPHERE_RADIUS, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
};

/**
 * CockpitModel Component (Inner component that uses the model)
 */
const CockpitModel = () => {
    const { scene } = useGLTF(COCKPIT_MODEL_PATH);
    const clonedScene = scene.clone();

    return (
        <primitive
            object={clonedScene}
            position={COCKPIT_POSITION}
            rotation={COCKPIT_ROTATION}
            scale={COCKPIT_SCALE}
        />
    );
};

/**
 * CockpitInterior Component
 *
 * Renders spaceship cockpit with interactive holographic terminal
 * All interaction is handled through terminal commands
 *
 * @param {function} onCommand - Callback for terminal commands
 * @param {boolean} showTerminal - Whether to show the terminal (default: true)
 */
const CockpitInterior = ({ onCommand, showTerminal = true }) => {
    return (
        <group>
            {/* Static space background - single image instead of 6-texture cube map */}
            <StaticSpaceBackground />

            {/* Main cockpit model wrapped in Suspense */}
            <Suspense fallback={null}>
                <CockpitModel />
            </Suspense>

            {/* Holographic terminal (hidden during launch sequence) */}
            {showTerminal && (
                <HolographicTerminal
                    position={TERMINAL_POSITION}
                    onCommand={onCommand}
                />
            )}

            {/* Cockpit lighting system */}
            {COCKPIT_LIGHTS.map((light, index) => (
                <pointLight
                    key={index}
                    position={light.position}
                    color={light.color}
                    intensity={light.intensity}
                    distance={light.distance}
                />
            ))}
        </group>
    );
};

// ❌ Removed preload - model loads only when CockpitInterior renders
// This reduces initial bundle size and speeds up first page load
// useGLTF.preload(COCKPIT_MODEL_PATH);

export default CockpitInterior;
