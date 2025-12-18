import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo } from "react";
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

// Constants
const CAMERA_POSITIONS = {
    COCKPIT: [0, 0, 0.2],
    EXPLORATION: [120, 120, 140],
};

const TRANSITION_DELAYS = {
    BRIEF_FADE: 200,
    COCKPIT_VIEW: 3000,
    PLANET_SELECTION: 400,
};

const CAMERA_LERP_SPEED = 0.05;
const CAMERA_DISTANCE_THRESHOLD = 0.5;

/**
 * SmoothCameraTransition Component
 * Handles smooth camera transitions when returning to the star system
 */
const SmoothCameraTransition = ({
    targetPosition,
    targetLookAt,
    isTransitioningRef,
    onComplete,
}) => {
    const { camera } = useThree();
    const targetPosRef = useRef(new THREE.Vector3(...targetPosition));
    const targetLookRef = useRef(new THREE.Vector3(...targetLookAt));

    useFrame(() => {
        if (!isTransitioningRef.current) return;

        // Smoothly lerp camera position
        camera.position.lerp(targetPosRef.current, CAMERA_LERP_SPEED);

        // Smoothly lerp camera lookAt
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);

        const newLookAt = new THREE.Vector3();
        newLookAt.lerpVectors(
            currentLookAt,
            targetLookRef.current,
            CAMERA_LERP_SPEED
        );
        camera.lookAt(newLookAt);

        // Check if camera reached target position
        const distanceToTarget = camera.position.distanceTo(
            targetPosRef.current
        );
        if (distanceToTarget < CAMERA_DISTANCE_THRESHOLD) {
            camera.position.copy(targetPosRef.current);
            camera.lookAt(targetLookRef.current);
            isTransitioningRef.current = false;
            onComplete?.();
        }
    });

    return null;
};

/**
 * StatusDisplay Component
 * Shows current system status in the top-left corner
 */
const StatusDisplay = ({ phase, systemStatus, currentSystemName }) => {
    const statusConfig = {
        cockpit: {
            borderColor: "border-green-500/30",
            textColor: "text-green-400",
            title: "COCKPIT INTERFACE",
            helper: "Type 'launch' in terminal to begin",
        },
        launching: {
            borderColor: "border-red-500/50",
            textColor: "text-red-400",
            title: "⚠ LAUNCH SEQUENCE ACTIVE",
            pulse: true,
        },
        exploration: {
            borderColor: "border-cyan-500/30",
            textColor: "text-cyan-400",
            title: currentSystemName || "UNKNOWN SYSTEM",
            helper: "Press 'N' for navigation",
        },
    };

    const config = statusConfig[phase];
    if (!config) return null;

    return (
        <div className="absolute top-6 left-6 text-white font-mono z-10 helper-text">
            <div
                className={`bg-black/50 backdrop-blur-sm p-4 rounded border ${
                    config.borderColor
                } ${
                    config.pulse ? "animate-pulse" : ""
                } w-full h-full flex flex-col justify-center`}
            >
                <div
                    className={`${config.textColor} text-sm mb-1 ${
                        phase === "launching" ? "font-bold" : ""
                    }`}
                >
                    {config.title}
                </div>
                <div className="text-xs text-gray-400">{systemStatus}</div>
                {config.helper && (
                    <div className={`text-xs ${config.textColor}/60 mt-1`}>
                        {config.helper}
                    </div>
                )}
            </div>
        </div>
    );
};

function App() {
    const { currentPage, onNavigate, isMobile } = useNavigation();
    const {
        currentSystem,
        destinationSystem,
        selectedPlanet,
        travelPhase,
        setTravelPhase,
        setSelectedPlanet,
        setTravelDestination,
        setCurrentSystemId,
        starSystems,
    } = useStarSystem();

    // Component state
    const [currentPhase, setCurrentPhase] = useState("cockpit");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [systemStatus, setSystemStatus] = useState("SYSTEMS STANDBY");
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(false);

    // Refs for 3D scene management
    const cameraRef = useRef();
    const wormholeRef = useRef();
    const isCameraTransitioningRef = useRef(false);
    const prevPhaseRef = useRef(currentPhase);

    // Handle camera positioning based on current phase
    useEffect(() => {
        if (!cameraRef.current) return;

        const phaseChanged = prevPhaseRef.current !== currentPhase;
        prevPhaseRef.current = currentPhase;

        const isCockpitPhase =
            currentPhase === "cockpit" || currentPhase === "launching";

        if (isCockpitPhase) {
            // Position camera in cockpit view
            cameraRef.current.position.set(...CAMERA_POSITIONS.COCKPIT);
            cameraRef.current.lookAt(0, 0, -5);
            isCameraTransitioningRef.current = false;
        } else if (currentPhase === "exploration" && phaseChanged) {
            // Trigger smooth transition to exploration view
            isCameraTransitioningRef.current = true;
        }
    }, [currentPhase]);

    // Handle camera transition when returning from a page
    useEffect(() => {
        const isReturningToExploration =
            currentPage === "3d-portfolio" &&
            currentPhase === "exploration" &&
            cameraRef.current;

        if (isReturningToExploration) {
            isCameraTransitioningRef.current = true;
        }
    }, [currentPage, currentPhase]);

    // Handler for launch command from cockpit terminal
    const handleLaunchCommand = (command) => {
        if (command !== "launch") return;

        setCurrentPhase("launching");
        setTravelPhase("launching");
        setSystemStatus("LAUNCHING");
    };

    // Handler for wormhole travel to another system
    const handleSystemTravel = (systemId) => {
        setTravelDestination(systemId);
        setIsTransitioning(true);
        isCameraTransitioningRef.current = false;
        setOrbitControlsEnabled(false);

        // Brief fade transition, then show cockpit
        setTimeout(() => {
            if (cameraRef.current) {
                cameraRef.current.position.set(...CAMERA_POSITIONS.COCKPIT);
                cameraRef.current.lookAt(0, 0, -5);
            }

            setCurrentPhase("cockpit");
            setSystemStatus("WARP DRIVE INITIATED - PREPARE FOR JUMP");
            setTravelPhase("preparing");
            setIsTransitioning(false);
        }, TRANSITION_DELAYS.BRIEF_FADE);

        // Auto-trigger launch sequence after showing cockpit
        const totalDelay =
            TRANSITION_DELAYS.BRIEF_FADE + TRANSITION_DELAYS.COCKPIT_VIEW;
        setTimeout(() => {
            setCurrentPhase("launching");
            setTravelPhase("launching");
            setSystemStatus("WORMHOLE JUMP IN PROGRESS");
        }, totalDelay);
    };

    // Handler for planet docking completion
    const handleDockingComplete = (planet) => {
        if (!planet || !currentSystem) return;

        const pageSlug = currentSystem.page.toLowerCase().replace(/\s+/g, "-");
        onNavigate(pageSlug, planet.sectionId);
    };

    // Keyboard shortcuts
    const { isActive: isNavigationVisible, setIsActive: setNavigationVisible } =
        useKeyboardShortcut("n");

    useKeyboardShortcut("Escape", () => {
        if (currentPhase === "planet-detail") {
            setSelectedPlanet(null);
            setCurrentPhase("exploration");
        }
    });

    // Memoized page components mapping
    const pageComponents = useMemo(
        () => ({
            "about-me": <AboutMe />,
            projects: <Projects />,
            experience: <Experience />,
            contact: <Contact />,
            journey: <Journey />,
            technologies: <Technologies />,
        }),
        []
    );

    // Render non-3D pages (including mobile)
    if (currentPage !== "3d-portfolio" || isMobile) {
        return pageComponents[currentPage] || pageComponents["about-me"];
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
                            if (
                                currentPhase === "cockpit" ||
                                currentPhase === "launching"
                            ) {
                                camera.position.set(
                                    ...CAMERA_POSITIONS.COCKPIT
                                );
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
                        <pointLight
                            position={[0, 0, 0]}
                            intensity={2}
                            color="#FDB813"
                        />

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
                            enabled={
                                currentPhase === "exploration" &&
                                orbitControlsEnabled
                            }
                            enablePan={false}
                            minDistance={50}
                            maxDistance={300}
                            maxPolarAngle={Math.PI / 1.8}
                            minPolarAngle={Math.PI / 4}
                        />

                        {/* Cockpit interior for cockpit and launching phases */}
                        {(currentPhase === "cockpit" ||
                            currentPhase === "launching") && (
                            <CockpitInterior
                                onCommand={handleLaunchCommand}
                                showTerminal={
                                    currentPhase === "cockpit" &&
                                    travelPhase !== "preparing"
                                }
                            />
                        )}

                        {/* Wormhole and launch sequence */}
                        {currentPhase === "launching" && (
                            <>
                                <Wormhole
                                    ref={wormholeRef}
                                    position={[0, 0, -300]}
                                    scale={10}
                                    colorScheme={
                                        destinationSystem?.color || "cyan"
                                    }
                                />
                                <LaunchSequence
                                    isActive={true}
                                    wormholeRef={wormholeRef}
                                    onSequenceComplete={() => {
                                        setCurrentPhase("exploration");

                                        // Change to travel destination or stay in current system
                                        if (destinationSystem) {
                                            setCurrentSystemId(
                                                destinationSystem.id
                                            );
                                            setSystemStatus(
                                                `ARRIVED AT ${destinationSystem.name}`
                                            );
                                            setTravelDestination(null);
                                        } else {
                                            setSystemStatus("EXPLORATION MODE");
                                        }

                                        setTravelPhase(null);
                                    }}
                                />
                            </>
                        )}

                        {/* Star system for exploration phase */}
                        {currentPhase === "exploration" && currentSystem && (
                            <StarSystem
                                visible={true}
                                planets={currentSystem.planets || []}
                                animationsPaused={false}
                            />
                        )}
                    </Canvas>

                    {/* Status display for all phases */}
                    <StatusDisplay
                        phase={currentPhase}
                        systemStatus={systemStatus}
                        currentSystemName={currentSystem?.name}
                    />

                    {/* Navigation screen for exploration phase */}
                    {currentPhase === "exploration" && (
                        <NavigationScreen
                            isVisible={isNavigationVisible}
                            onClose={() => setNavigationVisible(false)}
                            onPlanetSelect={(planet) => {
                                setSelectedPlanet(planet);
                                setTimeout(() => {
                                    setCurrentPhase("planet-detail");
                                    setNavigationVisible(false);
                                }, TRANSITION_DELAYS.PLANET_SELECTION);
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
