import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import HolographicTerminal from "./HolographicTerminal";

/**
 * CockpitInterior Component - With Interactive Terminal
 *
 * Features a holographic terminal screen for user interaction
 * No buttons - all interaction through terminal commands
 */
const CockpitInterior = ({ onCommand }) => {
    const groupRef = useRef();

    const { scene } = useGLTF("/models/SpaceshipCockpit.glb");
    const clonedScene = scene.clone();

    return (
        <group ref={groupRef}>
            {/* Main cockpit model - EXACT position from your working version */}
            <primitive
                object={clonedScene}
                position={[0, 0.2, -0.5]} // Your exact position
                rotation={[0, Math.PI / 2, 0]} // Your exact rotation
                scale={1.5} // Your exact scale
            />

            {/* Holographic Terminal Screen - Main interaction interface */}
            <HolographicTerminal
                position={[0, -0.3, -2]} // Same position as your button was
                onCommand={onCommand}
            />

            {/* Cockpit Lighting - Updated to complement terminal green glow */}
            <pointLight
                position={[0, 0, -2]}
                color="#00ff88" // Changed to terminal green
                intensity={2}
                distance={5}
            />
            <pointLight
                position={[1.5, -0.5, -2]}
                color="#06b6d4"
                intensity={1.5}
                distance={3}
            />
            <pointLight
                position={[-1.5, -0.5, -2]}
                color="#3b82f6"
                intensity={1.5}
                distance={3}
            />
            <pointLight
                position={[0, 1.5, 0]}
                color="#ffffff"
                intensity={1}
                distance={4}
            />
            <pointLight
                position={[0, 0, 2]}
                color="#6366f1"
                intensity={0.8}
                distance={3}
            />
        </group>
    );
};

useGLTF.preload("/models/SpaceshipCockpit.glb");

export default CockpitInterior;
