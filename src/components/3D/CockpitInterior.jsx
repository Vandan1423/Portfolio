import { useGLTF } from "@react-three/drei";
import HolographicTerminal from "./HolographicTerminal";

// Cockpit model configuration
const COCKPIT_MODEL_PATH = "/models/SpaceshipCockpit.glb";
const COCKPIT_POSITION = [0, 0.2, -0.5];
const COCKPIT_ROTATION = [0, Math.PI / 2, 0];
const COCKPIT_SCALE = 1.5;

// Terminal position
const TERMINAL_POSITION = [0, -0.3, -2];

// Lighting configuration - array of light settings for easier management
const COCKPIT_LIGHTS = [
    { position: [0, 0, -2], color: "#00ff88", intensity: 2, distance: 5 },      // Terminal green glow
    { position: [1.5, -0.5, -2], color: "#06b6d4", intensity: 1.5, distance: 3 }, // Cyan right
    { position: [-1.5, -0.5, -2], color: "#3b82f6", intensity: 1.5, distance: 3 }, // Blue left
    { position: [0, 1.5, 0], color: "#ffffff", intensity: 1, distance: 4 },      // White overhead
    { position: [0, 0, 2], color: "#6366f1", intensity: 0.8, distance: 3 },      // Indigo rear
];

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
    const { scene } = useGLTF(COCKPIT_MODEL_PATH);
    const clonedScene = scene.clone();

    return (
        <group>
            {/* Main cockpit model */}
            <primitive
                object={clonedScene}
                position={COCKPIT_POSITION}
                rotation={COCKPIT_ROTATION}
                scale={COCKPIT_SCALE}
            />

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

// REMOVED preload - model loads on-demand with Suspense boundary
// This reduces initial bundle load time significantly

export default CockpitInterior;
