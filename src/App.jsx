import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import CockpitInterior from "./components/3D/CockpitInterior";
import "./App.css";

function App() {
    const [currentPhase, setCurrentPhase] = useState("cockpit"); // 'cockpit', 'launching', 'exploration'
    const [systemStatus, setSystemStatus] = useState("READY FOR LAUNCH");

    // Handle commands from the terminal
    const handleTerminalCommand = (command) => {
        console.log("Command received:", command);

        if (command === "launch") {
            setSystemStatus("LAUNCH INITIATED");
            setCurrentPhase("launching");
            // Later: trigger launch animation
            setTimeout(() => {
                console.log("Launch sequence would start here");
                // setCurrentPhase("exploration"); // Transition to next phase
            }, 3000);
        } else if (command === "navigate") {
            setSystemStatus("NAVIGATION MODE");
            // Later: show navigation menu in terminal or overlay
            console.log("Navigation mode activated");
        }
    };

    return (
        <div className="w-full h-screen bg-deep-space">
            <Canvas
                camera={{
                    position: [0, -0.3, 0], // Adjusted to your preference
                    fov: 75,
                    near: 0.1,
                }}
                gl={{ antialias: true }}
            >
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

                <CockpitInterior onCommand={handleTerminalCommand} />
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

                {/* Instructions - Bottom */}
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

                {/* System Info - Bottom Left */}
                <div className="absolute bottom-8 left-8 text-xs text-asteroid-gray space-y-1">
                    <div>COORDINATES: 0.0000, 0.0000, 0.0000</div>
                    <div>QUANTUM DRIVE: STANDBY</div>
                    <div>SHIELD STATUS: NOMINAL</div>
                </div>

                {/* Launch Status Overlay */}
                {currentPhase === "launching" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
                        <div className="text-center">
                            <p className="text-6xl font-heading text-orange-500 animate-pulse mb-4">
                                🚀
                            </p>
                            <p className="text-3xl font-heading text-orange-500 animate-pulse">
                                LAUNCH SEQUENCE INITIATED
                            </p>
                            <p className="text-sm text-asteroid-gray mt-4">
                                Preparing for departure...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
