import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef } from "react";
import CockpitInterior from "./components/3D/CockpitInterior";
import Wormhole from "./components/3D/Wormhole";
import LaunchSequence from "./components/3D/LaunchSequence";
import StarSystem from "./components/3D/StarSystem";
import SpaceCubeMap from "./components/3D/SpaceCubeMap";
import "./App.css";

function App() {
    const [currentPhase, setCurrentPhase] = useState("cockpit"); // 'cockpit', 'launching', 'exploration'
    const [systemStatus, setSystemStatus] = useState("READY FOR LAUNCH");
    const [velocityFactor, setVelocityFactor] = useState(0); // 0-1 for background rotation
    const spacecraftRef = useRef(); // Reference to the entire cockpit
    const wormholeRef = useRef(); // Reference to the wormhole for FPP movement

    // Handle commands from the terminal
    const handleTerminalCommand = (command) => {
        console.log("Command received:", command);

        if (command === "launch") {
            setSystemStatus("LAUNCH INITIATED");
            // Start launch sequence immediately after countdown (3 seconds + 0.5s for "GO!")
            setTimeout(() => {
                setCurrentPhase("launching");
            }, 3500); // 3 seconds countdown + 0.5s for "GO!"
        } else if (command === "navigate") {
            setSystemStatus("NAVIGATION MODE");
            console.log("Navigation mode activated");
        }
    };

    const handleSequenceComplete = () => {
        setCurrentPhase("exploration");
        setSystemStatus("EXPLORATION MODE");
        setVelocityFactor(0); // Reset velocity
        console.log("🌟 Arrived at destination star system!");
    };

    const handleVelocityChange = (velocity) => {
        setVelocityFactor(velocity);
    };

    return (
        <div className="w-full h-screen bg-deep-space">
            <Canvas
                camera={{
                    position: [0, 0, -0.5], // FPP view - closer to cockpit interior
                    fov: 75,
                    near: 0.1,
                    far: 500, // Need to see far for wormhole
                }}
                gl={{ antialias: true }}
            >
                {/* Space Background Cube Map - Always visible, rotates based on velocity */}
                <SpaceCubeMap
                    velocityFactor={velocityFactor}
                    enableRelativistic={true}
                />

                {/* Lighting */}
                <ambientLight intensity={0.8} />
                <pointLight
                    position={[0, 2, -1]}
                    intensity={1.5}
                    color="#6366f1"
                />
                <hemisphereLight
                    intensity={0.5}
                    color="#ffffff"
                    groundColor="#00ff88"
                />

                {/* Camera Controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    target={[0, -0.2, -2]}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={(3 * Math.PI) / 4}
                    minAzimuthAngle={-Math.PI / 3}
                    maxAzimuthAngle={Math.PI / 3}
                    rotateSpeed={0.5}
                    enableDamping={true}
                    dampingFactor={0.05}
                />

                {/* Cockpit - visible only in cockpit phase */}
                {currentPhase === "cockpit" && (
                    <group ref={spacecraftRef}>
                        <CockpitInterior onCommand={handleTerminalCommand} showTerminal={true} />
                    </group>
                )}

                {/* During launch - show cockpit WITHOUT terminal */}
                {currentPhase === "launching" && (
                    <>
                        <group ref={spacecraftRef}>
                            <CockpitInterior onCommand={handleTerminalCommand} showTerminal={false} />
                        </group>
                        {/* Wormhole wrapped in group for animation - starts 100 units away */}
                        <group ref={wormholeRef} position={[0, 0, -100]}>
                            <Wormhole position={[0, 0, 0]} scale={5} colorScheme="cyan" />
                        </group>
                        <LaunchSequence
                            isActive={true}
                            spacecraftRef={spacecraftRef}
                            wormholeRef={wormholeRef}
                            initialWormholePosition={[0, 0, -100]}
                            onSequenceComplete={handleSequenceComplete}
                            onVelocityChange={handleVelocityChange}
                        />
                    </>
                )}

                {/* Exploration phase - show star system */}
                {currentPhase === "exploration" && (
                    <StarSystem visible={true} />
                )}
            </Canvas>

            {/* HUD Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Top HUD - Ship Name */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                    <h1 className="text-2xl font-heading text-nebula-purple mb-2">
                        CAPTAIN VANDAN'S VESSEL
                    </h1>
                    <div className="text-sm text-asteroid-gray">
                        Neural Interface v2.5.1
                    </div>
                </div>

                {/* Status Indicators - Top Right */}
                <div className="absolute top-8 right-8 space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-moon-white">
                            SYSTEMS ONLINE
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-moon-white">
                            FUEL: 100%
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`w-3 h-3 rounded-full animate-pulse ${
                                currentPhase === "launching"
                                    ? "bg-orange-500"
                                    : "bg-cyan-400"
                            }`}
                        ></div>
                        <span className="text-sm text-moon-white">
                            {systemStatus}
                        </span>
                    </div>
                </div>

                {/* Instructions - Bottom (hide during launch and exploration) */}
                {currentPhase === "cockpit" && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-deep-space/80 backdrop-blur-md px-6 py-3 rounded-lg border border-cyan-400/30">
                            <p className="text-cyan-400 text-sm mb-1">
                                🖥️ INTERACTIVE TERMINAL ACTIVE
                            </p>
                            <p className="text-asteroid-gray text-xs">
                                Click the terminal screen to interact • Type 'help'
                                for commands
                            </p>
                        </div>
                    </div>
                )}

                {/* System Info - Bottom Left (hide during launch) */}
                {currentPhase !== "launching" && (
                    <div className="absolute bottom-8 left-8 text-xs text-asteroid-gray space-y-1">
                        <div>COORDINATES: 0.0000, 0.0000, 0.0000</div>
                        <div>QUANTUM DRIVE: STANDBY</div>
                        <div>SHIELD STATUS: NOMINAL</div>
                    </div>
                )}

                {/* Launch Status Overlay - Speed HUD */}
                {currentPhase === "launching" && (
                    <>
                        {/* Speed indicator - top right */}
                        <div className="absolute top-8 right-8">
                            <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-cyan-500/30">
                                <p className="text-cyan-400 text-xs mb-1">VELOCITY</p>
                                <p className="text-2xl font-bold text-white font-mono">
                                    ACCELERATING
                                </p>
                                <div className="mt-2 w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-linear-to-r from-cyan-500 to-purple-500 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Wormhole approach indicator - bottom center */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg border border-purple-500/30">
                                <p className="text-purple-400 text-center text-sm">
                                    🌀 APPROACHING WORMHOLE
                                </p>
                            </div>
                        </div>

                        {/* Warning indicators */}
                        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 space-y-2">
                            <div className="bg-orange-500/20 border border-orange-500 px-3 py-1 rounded">
                                <p className="text-orange-400 text-xs">⚠ HIGH SPEED</p>
                            </div>
                            <div className="bg-purple-500/20 border border-purple-500 px-3 py-1 rounded">
                                <p className="text-purple-400 text-xs">⚡ WARP ACTIVE</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
