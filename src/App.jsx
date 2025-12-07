import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import CockpitInterior from "./components/3D/CockpitInterior";
import Wormhole from "./components/3D/Wormhole";
import LaunchSequence from "./components/3D/LaunchSequence";
import StarSystem from "./components/3D/StarSystem";
import SpaceCubeMap from "./components/3D/SpaceCubeMap";
import NavigationScreen from "./components/UI/NavigationScreen";
import PlanetDetailScene from "./components/3D/PlanetDetailScene";
import AboutMe from "./pages/AboutMe";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import "./App.css";

function App() {
    // DEVELOPMENT MODE: Skip to exploration phase for StarSystem testing
    const [currentPhase, setCurrentPhase] = useState("exploration");
    // Phases: 'cockpit', 'launching', 'exploration', 'planet-detail'

    const [systemStatus, setSystemStatus] = useState("EXPLORATION MODE");
    const [velocityFactor, setVelocityFactor] = useState(0);
    const spacecraftRef = useRef();
    const wormholeRef = useRef();

    // Selected planet for detail view
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    // Page navigation state (3d-portfolio or about-me)
    const [currentPage, setCurrentPage] = useState("3d-portfolio");

    /**
     * Planet data - shared between StarSystem and NavigationScreen
     *
     * NEW PROPERTIES FOR DETAIL VIEW:
     * - detailOffset: [x, y, z] - Adjust planet position in detail view
     *   Positive X = move right, Negative X = move left
     *   Positive Y = move up, Negative Y = move down
     *   Positive Z = move toward camera, Negative Z = move away
     *
     * - detailScale: number - Override the auto-calculated scale in detail view
     *   If not provided, scale is calculated automatically
     */
    const planets = [
        {
            name: "Pluto",
            section: "About Me",
            modelPath: "/models/Pluto.glb",
            scale: 2.0,
            orbitRadius: 25,
            orbitSpeed: 0.3,
            orbitColor: "#ffc649",
            yOffset: -1.8,
            // Detail view adjustments
            detailOffset: [0, 0, 0], // [x, y, z] - adjust as needed
            detailScale: 2.5, // Override scale for detail view
        },
        {
            name: "Earth",
            section: "Technical Arsenal",
            modelPath: "/models/Earth.glb",
            scale: 2.2,
            orbitRadius: 45,
            orbitSpeed: 0.28,
            orbitColor: "#4a90e2",
            yOffset: -2,
            // Detail view adjustments
            detailOffset: [0, 0, 0], // Adjust if not centered
            detailScale: 2.8,
        },
        {
            name: "Planet1",
            section: "Achievements",
            modelPath: "/models/Planet1.glb",
            scale: 3,
            orbitRadius: 75,
            orbitSpeed: 0.22,
            orbitColor: "#e27b58",
            yOffset: 0,
            // Detail view adjustments
            detailOffset: [0, 0, 0],
            detailScale: 3.5,
        },
        {
            name: "Planet2",
            section: "Interests & Hobbies",
            modelPath: "/models/Planet2.glb",
            scale: 5,
            orbitRadius: 95,
            orbitSpeed: 0.18,
            orbitColor: "#9b59b6",
            yOffset: 0,
            // Detail view adjustments
            detailOffset: [0, 0, 0],
            detailScale: 5,
        },
        {
            name: "Saturn",
            section: "Quick Links",
            modelPath: "/models/Saturn.glb",
            scale: 0.015,
            orbitRadius: 115,
            orbitSpeed: 0.15,
            orbitColor: "#f39c12",
            yOffset: 0,
            // Detail view adjustments - Saturn needs significant adjustment
            detailOffset: [0, 0, 0], // Adjust position
            detailScale: 3, // Saturn's original scale is 0.015, so this overrides it
        },
    ];

    // Keyboard shortcut for navigation screen (N key)
    const { isActive: isNavigationActive, setIsActive: setNavigationActive } =
        useKeyboardShortcut("n");

    // Handle commands from the terminal
    const handleTerminalCommand = (command) => {
        console.log("Command received:", command);

        if (command === "launch") {
            setSystemStatus("LAUNCH INITIATED");
            setTimeout(() => {
                setCurrentPhase("launching");
            }, 3500);
        } else if (command === "navigate") {
            setSystemStatus("NAVIGATION MODE");
            console.log("Navigation mode activated");
        }
    };

    const handleSequenceComplete = () => {
        setCurrentPhase("exploration");
        setSystemStatus("EXPLORATION MODE");
        setVelocityFactor(0);
        console.log("🌟 Arrived at destination star system!");
    };

    const handleVelocityChange = (velocity) => {
        setVelocityFactor(velocity);
    };

    // Handle planet selection from navigation screen
    const handlePlanetSelect = (planet) => {
        console.log("Planet selected for detail view:", planet);
        setSelectedPlanet(planet);
        setNavigationActive(false); // Close navigation screen
        setCurrentPhase("planet-detail"); // Switch to planet detail view
    };

    // Handle returning from planet detail to exploration
    const handleBackToExploration = () => {
        console.log("Returning to exploration...");
        setSelectedPlanet(null);
        setCurrentPhase("exploration");
    };

    // Handle orbit sequence completion
    const handleOrbitComplete = (planet) => {
        console.log("✅ Orbit complete! Navigating to AboutMe...");
        setCurrentPage("about-me");
        // Keep selectedPlanet and phase for back navigation
    };

    // Handle returning from AboutMe to planet detail
    const handleBackFromAboutMe = () => {
        console.log("Returning to planet detail...");
        setCurrentPage("3d-portfolio");
        // Stay in planet-detail phase with same planet
    };

    return (
        <div className="w-full h-screen bg-deep-space">
            {/* AboutMe Page - 2D React Page */}
            {currentPage === "about-me" && (
                <AboutMe planet={selectedPlanet} onBack={handleBackFromAboutMe} />
            )}

            {/* 3D Portfolio - Main Application */}
            {currentPage === "3d-portfolio" && (
                <>
                    {/* Planet Detail View - Isolated Scene */}
            {currentPhase === "planet-detail" && selectedPlanet && (
                <PlanetDetailScene
                    planet={selectedPlanet}
                    onBack={handleBackToExploration}
                    onOrbitComplete={handleOrbitComplete}
                />
            )}

            {/* Main 3D Canvas - Only render when NOT in planet-detail */}
            {currentPhase !== "planet-detail" && (
                <Canvas
                    camera={{
                        position: [0, 15, 45],
                        fov: 50,
                        near: 0.1,
                        far: 1000,
                    }}
                    gl={{ antialias: true }}
                    onCreated={({ scene }) => {
                        scene.background = new THREE.Color(0x000000);
                    }}
                >
                    {/* Space Background Cube Map */}
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

                    {/* Cockpit Camera Controls */}
                    {(currentPhase === "cockpit" ||
                        currentPhase === "launching") && (
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={true}
                            target={[0, -0.2, -2]}
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI}
                            minAzimuthAngle={-Infinity}
                            maxAzimuthAngle={Infinity}
                            rotateSpeed={0.5}
                            enableDamping={true}
                            dampingFactor={0.05}
                        />
                    )}

                    {/* Exploration Camera Controls */}
                    {currentPhase === "exploration" && (
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                            target={[0, 0, 0]}
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI}
                            minAzimuthAngle={-Infinity}
                            maxAzimuthAngle={Infinity}
                            minDistance={10}
                            maxDistance={400}
                            rotateSpeed={0.5}
                            zoomSpeed={1.0}
                            enableDamping={true}
                            dampingFactor={0.05}
                        />
                    )}

                    {/* Cockpit Phase */}
                    {currentPhase === "cockpit" && (
                        <group ref={spacecraftRef}>
                            <CockpitInterior
                                onCommand={handleTerminalCommand}
                                showTerminal={true}
                            />
                        </group>
                    )}

                    {/* Launching Phase */}
                    {currentPhase === "launching" && (
                        <>
                            <group ref={spacecraftRef}>
                                <CockpitInterior
                                    onCommand={handleTerminalCommand}
                                    showTerminal={false}
                                />
                            </group>
                            <group ref={wormholeRef} position={[0, 0, -100]}>
                                <Wormhole
                                    position={[0, 0, 0]}
                                    scale={5}
                                    colorScheme="cyan"
                                />
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

                    {/* Exploration Phase */}
                    {currentPhase === "exploration" && (
                        <StarSystem
                            visible={true}
                            planets={planets}
                            selectedPlanet={null}
                            animationsPaused={false}
                        />
                    )}
                </Canvas>
            )}

            {/* HUD Overlay - Only show when NOT in planet-detail */}
            {currentPhase !== "planet-detail" && (
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

                    {/* Instructions - Cockpit Phase */}
                    {currentPhase === "cockpit" && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                            <div className="bg-deep-space/80 backdrop-blur-md px-6 py-3 rounded-lg border border-cyan-400/30">
                                <p className="text-cyan-400 text-sm mb-1">
                                    🖥️ INTERACTIVE TERMINAL ACTIVE
                                </p>
                                <p className="text-asteroid-gray text-xs">
                                    Click the terminal screen to interact • Type
                                    'help' for commands
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Exploration Instructions */}
                    {currentPhase === "exploration" && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto">
                            <div className="bg-deep-space/80 backdrop-blur-md px-6 py-3 rounded-lg border border-cyan-400/30">
                                <p className="text-cyan-400 text-sm mb-1">
                                    Press{" "}
                                    <span className="font-bold text-white">
                                        N
                                    </span>{" "}
                                    to open Navigation
                                </p>
                                <p className="text-asteroid-gray text-xs">
                                    Scroll to zoom • Drag to rotate •
                                    Right-click to pan
                                </p>
                            </div>
                        </div>
                    )}

                    {/* System Info - Bottom Left */}
                    {currentPhase !== "launching" && (
                        <div className="absolute bottom-8 left-8 text-xs text-asteroid-gray space-y-1">
                            <div>COORDINATES: 0.0000, 0.0000, 0.0000</div>
                            <div>QUANTUM DRIVE: STANDBY</div>
                            <div>SHIELD STATUS: NOMINAL</div>
                        </div>
                    )}

                    {/* Launch Status Overlay */}
                    {currentPhase === "launching" && (
                        <>
                            <div className="absolute top-8 right-8">
                                <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-cyan-500/30">
                                    <p className="text-cyan-400 text-xs mb-1">
                                        VELOCITY
                                    </p>
                                    <p className="text-2xl font-bold text-white font-mono">
                                        ACCELERATING
                                    </p>
                                    <div className="mt-2 w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-linear-to-r from-cyan-500 to-purple-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg border border-purple-500/30">
                                    <p className="text-purple-400 text-center text-sm">
                                        🌀 APPROACHING WORMHOLE
                                    </p>
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 space-y-2">
                                <div className="bg-orange-500/20 border border-orange-500 px-3 py-1 rounded">
                                    <p className="text-orange-400 text-xs">
                                        ⚠ HIGH SPEED
                                    </p>
                                </div>
                                <div className="bg-purple-500/20 border border-purple-500 px-3 py-1 rounded">
                                    <p className="text-purple-400 text-xs">
                                        ⚡ WARP ACTIVE
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

                    {/* Navigation Screen - Only in exploration phase */}
                    {currentPhase === "exploration" && (
                        <NavigationScreen
                            isVisible={isNavigationActive}
                            onClose={() => setNavigationActive(false)}
                            onPlanetSelect={handlePlanetSelect}
                            selectedPlanet={null}
                            planets={planets}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
