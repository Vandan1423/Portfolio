import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useNavigation } from "./context/NavigationContext";
import { useStarSystem } from "./context/StarSystemContext";
import CockpitInterior from "./components/3D/CockpitInterior";
import Wormhole from "./components/3D/Wormhole";
import LaunchSequence from "./components/3D/LaunchSequence";
import StarSystem from "./components/3D/StarSystem";
import SpaceCubeMap from "./components/3D/SpaceCubeMap";
import NavigationScreen from "./components/UI/NavigationScreen";
import PlanetDetailScene from "./components/3D/PlanetDetailScene";
import AboutMe from "./pages/AboutMe/AboutMe";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import Projects from "./pages/Projects/Projects";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contact/Contact";
import Technologies from "./pages/Technologies/Technologies";
import Journey from "./pages/Journey/Journey";
import HelpButton from "./components/UI/HelpButton";
import "./App.css";

/**
 * SmoothCameraTransition Component
 * Handles smooth camera transitions when returning to the star system
 */
const SmoothCameraTransition = ({ targetPosition, targetLookAt, isTransitioningRef, onComplete }) => {
    const { camera } = useThree();
    const targetPosRef = useRef(new THREE.Vector3(...targetPosition));
    const targetLookRef = useRef(new THREE.Vector3(...targetLookAt));

    useFrame(() => {
        if (!isTransitioningRef.current) return;

        // Smoothly lerp camera position
        camera.position.lerp(targetPosRef.current, 0.05);

        // Smoothly lerp camera lookAt
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);

        const newLookAt = new THREE.Vector3();
        newLookAt.lerpVectors(currentLookAt, targetLookRef.current, 0.05);
        camera.lookAt(newLookAt);

        // Check if we're close enough to target
        const distanceToTarget = camera.position.distanceTo(targetPosRef.current);
        if (distanceToTarget < 0.5) {
            camera.position.copy(targetPosRef.current);
            camera.lookAt(targetLookRef.current);
            isTransitioningRef.current = false;
            if (onComplete) onComplete();
        }
    });

    return null;
};

function App() {
    const { currentPage, onNavigate } = useNavigation();
    const {
        currentSystem,
        destinationSystem,
        selectedPlanet,
        travelPhase,
        setTravelPhase,
        setSelectedPlanet,
        setTravelDestination,
        setCurrentSystemId,
        starSystems
    } = useStarSystem();

    const [currentPhase, setCurrentPhase] = useState("cockpit");
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [systemStatus, setSystemStatus] = useState("SYSTEMS STANDBY");
    const [_velocityFactor, setVelocityFactor] = useState(0);
    const _spacecraftRef = useRef();
    const wormholeRef = useRef();

    const CAMERA_POSITIONS = {
        COCKPIT: [0, 0, 0.2],
        // Changed to a more dynamic angle - slightly elevated and to the side for better view
        EXPLORATION: [120, 120, 140], // [x, y, z] - adjusted for a more cinematic angle
    };

    const cameraRef = useRef();
    const isCameraTransitioningRef = useRef(false);
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(false);
    const prevPhaseRef = useRef(currentPhase);

    useEffect(() => {
        if (!cameraRef.current) return;

        const phaseChanged = prevPhaseRef.current !== currentPhase;
        prevPhaseRef.current = currentPhase;

        if (currentPhase === "cockpit" || currentPhase === "launching") {
            // Keep camera in cockpit for both phases
            cameraRef.current.position.set(...CAMERA_POSITIONS.COCKPIT);
            cameraRef.current.lookAt(0, 0, -5); // Look forward
            isCameraTransitioningRef.current = false;
        } else if (currentPhase === "exploration" && phaseChanged) {
            // Trigger smooth transition when entering exploration phase
            isCameraTransitioningRef.current = true;
        }
    }, [currentPhase, CAMERA_POSITIONS.COCKPIT]);

    // Effect to handle returning from a page back to 3D portfolio
    useEffect(() => {
        if (currentPage === "3d-portfolio" && currentPhase === "exploration" && cameraRef.current) {
            // Trigger camera transition when returning to 3D portfolio
            isCameraTransitioningRef.current = true;
        }
    }, [currentPage, currentPhase]);

    const handleLaunchCommand = (command) => {
        if (command === "launch") {
            // Start the launch sequence
            setCurrentPhase("launching");
            setTravelPhase("launching");
            setSystemStatus("LAUNCHING");
            // Note: LaunchSequence component will handle completion and transition
        }
    };

    const handleSystemTravel = (systemId) => {
        console.log("Initiating wormhole travel to system:", systemId);
        
        // Set the travel destination in context (already destructured at top of component)
        setTravelDestination(systemId);
        
        // Start transition with brief fade
        setIsTransitioning(true);
        
        // Stop any camera transitions and disable orbit controls
        isCameraTransitioningRef.current = false;
        setOrbitControlsEnabled(false);
        
        // Brief delay for transition, then show cockpit
        setTimeout(() => {
            // Immediately position camera in cockpit if available
            if (cameraRef.current) {
                cameraRef.current.position.set(...CAMERA_POSITIONS.COCKPIT);
                cameraRef.current.lookAt(0, 0, -5);
            }
            
            // Set cockpit phase
            setCurrentPhase("cockpit");
            setSystemStatus("WARP DRIVE INITIATED - PREPARE FOR JUMP");
            setTravelPhase("preparing");
            setIsTransitioning(false);
        }, 200); // Brief 200ms transition
        
        // After a delay to show cockpit, automatically trigger launch sequence
        setTimeout(() => {
            setCurrentPhase("launching");
            setTravelPhase("launching");
            setSystemStatus("WORMHOLE JUMP IN PROGRESS");
        }, 3200); // 200ms transition + 3000ms cockpit view
    };

    const handleDockingComplete = (planet) => {
        console.log("Docking complete for planet:", planet);

        if (planet && currentSystem) {
            // Convert page name to URL format (e.g., "About Me" -> "about-me")
            const pageSlug = currentSystem.page.toLowerCase().replace(/\s+/g, '-');

            // Navigate to the page and section
            onNavigate(pageSlug, planet.sectionId);

            console.log(`Navigating to ${pageSlug} -> ${planet.sectionId}`);
        }
    };

    // Navigation screen toggle with 'N' key
    const { isActive: isNavigationVisible, setIsActive: setNavigationVisible } = useKeyboardShortcut("n");

    useKeyboardShortcut("Escape", () => {
        if (currentPhase === "planet-detail") {
            setSelectedPlanet(null);
            setCurrentPhase("exploration");
        }
    });

    const renderPage = () => {
        switch (currentPage) {
            case "about-me":
                return <AboutMe />;
            case "projects":
                return <Projects />;
            case "experience":
                return <Experience />;
            case "contact":
                return <Contact />;
            case "journey":
                return <Journey />;
            case "technologies":
                return <Technologies />;
            default:
                return null;
        }
    };

    if (currentPage !== "3d-portfolio") {
        return renderPage();
    }

    return (
        <div className="w-full h-screen bg-deep-space relative overflow-hidden">
            {currentPhase === "planet-detail" && selectedPlanet ? (
                <PlanetDetailScene
                    planet={selectedPlanet}
                    systemId={currentSystem?.id}
                    onBack={() => {
                        setSelectedPlanet(null);
                        setCurrentPhase("exploration");
                    }}
                    onDockComplete={handleDockingComplete}
                />
            ) : (
                <>
                    <Canvas
                        camera={{
                            position: CAMERA_POSITIONS.COCKPIT,
                            fov: 60,
                            near: 0.1,
                            far: 2000,
                        }}
                        onCreated={({ camera }) => {
                            cameraRef.current = camera;
                            // Set initial camera based on current phase
                            if (currentPhase === "cockpit" || currentPhase === "launching") {
                                camera.position.set(...CAMERA_POSITIONS.COCKPIT);
                                camera.lookAt(0, 0, -5); // Look forward
                            }
                        }}
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: "high-performance",
                        }}
                    >
                        <color attach="background" args={["#000000"]} />
                        <SpaceCubeMap />
                        <ambientLight intensity={0.3} />
                        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />

                        {/* Smooth camera transition when returning to exploration */}
                        <SmoothCameraTransition 
                            targetPosition={CAMERA_POSITIONS.EXPLORATION}
                            targetLookAt={[0, 0, 0]}
                            isTransitioningRef={isCameraTransitioningRef}
                            onComplete={() => {
                                isCameraTransitioningRef.current = false;
                                setOrbitControlsEnabled(true);
                            }}
                        />

                        <OrbitControls
                            enabled={currentPhase === "exploration" && orbitControlsEnabled}
                            enablePan={false}
                            minDistance={50}
                            maxDistance={300}
                            maxPolarAngle={Math.PI / 1.8}
                            minPolarAngle={Math.PI / 4}
                        />

                        {/* Render cockpit only during cockpit and launching phases */}
                        {(currentPhase === "cockpit" || currentPhase === "launching") && (
                            <CockpitInterior
                                onCommand={handleLaunchCommand}
                                showTerminal={currentPhase === "cockpit" && travelPhase !== "preparing"}
                            />
                        )}

                        {currentPhase === "launching" && (
                            <>
                                <Wormhole
                                    ref={wormholeRef}
                                    position={[0, 0, -300]}
                                    scale={10}
                                    colorScheme={destinationSystem?.color || "cyan"}
                                />
                                <LaunchSequence
                                    isActive={true}
                                    wormholeRef={wormholeRef}
                                    onSequenceComplete={() => {
                                        setVelocityFactor(0);
                                        setCurrentPhase("exploration");
                                        
                                        // If we have a travel destination, change to that system
                                        if (destinationSystem) {
                                            setCurrentSystemId(destinationSystem.id);
                                            setSystemStatus(`ARRIVED AT ${destinationSystem.name}`);
                                            setTravelDestination(null); // Clear travel destination
                                        } else {
                                            setSystemStatus("EXPLORATION MODE");
                                        }
                                        
                                        setTravelPhase(null);
                                    }}
                                    onVelocityChange={(velocity) => {
                                        setVelocityFactor(velocity);
                                    }}
                                />
                            </>
                        )}

                        {currentPhase === "exploration" && currentSystem && (
                            <StarSystem
                                visible={true}
                                planets={currentSystem.planets || []}
                                animationsPaused={false}
                            />
                        )}
                    </Canvas>

                    {currentPhase === "cockpit" && (
                        <div className="absolute top-6 left-6 text-white font-mono z-10">
                            <div className="bg-black/50 backdrop-blur-sm p-4 rounded border border-green-500/30">
                                <div className="text-green-400 text-sm mb-1">
                                    COCKPIT INTERFACE
                                </div>
                                <div className="text-xs text-gray-400">{systemStatus}</div>
                                <div className="text-xs text-green-400/60 mt-1">
                                    Type 'launch' in terminal to begin
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPhase === "launching" && (
                        <div className="absolute top-6 left-6 text-white font-mono z-10">
                            <div className="bg-black/50 backdrop-blur-sm p-4 rounded border border-red-500/50 animate-pulse">
                                <div className="text-red-400 text-sm mb-1 font-bold">
                                    ⚠ LAUNCH SEQUENCE ACTIVE
                                </div>
                                <div className="text-xs text-gray-400">{systemStatus}</div>
                            </div>
                        </div>
                    )}

                    {currentPhase === "exploration" && (
                        <div className="absolute top-6 left-6 text-white font-mono z-10">
                            <div className="bg-black/50 backdrop-blur-sm p-4 rounded border border-cyan-500/30 text-sm/8">
                                <div className="text-cyan-400 text-sm mb-1">
                                    {currentSystem?.name || "UNKNOWN SYSTEM"}
                                </div>
                                <div className="text-xs text-gray-400">{systemStatus}</div>
                                <div className="text-xs text-cyan-400/60 mt-1">
                                    Press 'N' for navigation
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPhase === "exploration" && (
                        <NavigationScreen
                            isVisible={isNavigationVisible}
                            onClose={() => setNavigationVisible(false)}
                            onPlanetSelect={(planet) => {
                                setSelectedPlanet(planet);
                                // Small delay to show selection before transitioning
                                setTimeout(() => {
                                    setCurrentPhase("planet-detail");
                                    setNavigationVisible(false);
                                }, 400);
                            }}
                            onSystemTravelSelect={(systemId) => {
                                handleSystemTravel(systemId);
                                setNavigationVisible(false);
                            }}
                            currentSystemId={currentSystem?.id}
                            selectedPlanet={selectedPlanet}
                            planets={currentSystem?.planets || []}
                            starSystems={starSystems}
                        />
                    )}

                    {/* Black transition screen when switching to cockpit */}
                    {isTransitioning && (
                        <div className="absolute inset-0 bg-black z-30 pointer-events-none" />
                    )}
                </>
            )}

            {/* Help Button - Available on all pages */}
            <HelpButton />
        </div>
    );
}

export default App;
