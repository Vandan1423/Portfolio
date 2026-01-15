import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import {Vector3} from "three";
import { useNavigation } from "./context/NavigationContext";
import { useStarSystem } from "./context/StarSystemContext";
import { useAI } from "./context/AIContext";
import { useTutorial } from "./context/TutorialContext";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import FullscreenPrompt from "./components/UI/FullscreenPrompt";
import ExplorationControls from "./components/UI/ExplorationControls";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

// Lazy load heavy 3D components
const CockpitInterior = lazy(() => import("./components/3D/CockpitInterior"));
const Wormhole = lazy(() => import("./components/3D/Wormhole"));
const LaunchSequence = lazy(() => import("./components/3D/LaunchSequence"));
const StarSystem = lazy(() => import("./components/3D/StarSystem"));
const SpaceCubeMap = lazy(() => import("./components/3D/SpaceCubeMap"));
const PlanetDetailScene = lazy(() => import("./components/3D/PlanetDetailScene"));
const NeuralLinkMap = lazy(() => import("./components/UI/NeuralLinkMap"));
const SagittariusTerminal = lazy(() => import("./components/AI/SagittariusTerminal"));
const SagittariusAvatar = lazy(() => import("./components/UI/SagittariusAvatar"));

// Lazy load page components
const AboutMe = lazy(() => import("./pages/AboutMe/AboutMe"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Experience = lazy(() => import("./pages/Experience/Experience"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Technologies = lazy(() => import("./pages/Technologies/Technologies"));
const Journey = lazy(() => import("./pages/Journey/Journey"));

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
    const targetPosRef = useRef(new Vector3(...targetPosition));
    const targetLookRef = useRef(new Vector3(...targetLookAt));

    useFrame(() => {
        if (!isTransitioningRef.current) return;

        // Smoothly lerp camera position
        camera.position.lerp(targetPosRef.current, CAMERA_LERP_SPEED);

        // Smoothly lerp camera lookAt
        const currentLookAt = new Vector3();
        camera.getWorldDirection(currentLookAt);
        currentLookAt.add(camera.position);

        const newLookAt = new Vector3();
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
                    <div className={`text-xs ${config.textColor}/60 mt-1 navigation-hint`}>
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
    } = useStarSystem();

    // AI context
    const { openTerminal } = useAI();
    
    // Tutorial context
    const { setTutorialStep, tutorialStep, notifyUserInteraction, notifyExplorationEntered, dismissCurrentTutorial, showTutorial } = useTutorial();

    // Component state
    const [currentPhase, setCurrentPhase] = useState("cockpit");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [systemStatus, setSystemStatus] = useState("SYSTEMS STANDBY");
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(false);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
    const [isFullscreenCheckComplete, setIsFullscreenCheckComplete] = useState(false);

    // Refs for 3D scene management
    const cameraRef = useRef();
    const wormholeRef = useRef();
    const isCameraTransitioningRef = useRef(false);
    const prevPhaseRef = useRef(currentPhase);

    // Check if user is already in fullscreen mode on mount
    useEffect(() => {
        const checkFullscreen = () => {
            const isFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement
            );

            // If already in fullscreen, don't show the prompt
            if (isFullscreen) {
                setShowFullscreenPrompt(false);
            }
            setIsFullscreenCheckComplete(true);
        };

        checkFullscreen();

        // Listen for fullscreen changes (for future enhancements)
        const handleFullscreenChange = () => {
            // Currently we don't show the prompt again if user exits fullscreen
            // (they've already made their choice)
            // Future enhancement: could add logic here if needed
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("msfullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("msfullscreenchange", handleFullscreenChange);
        };
    }, []);

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
            // Notify tutorial that we've entered exploration phase
            notifyExplorationEntered();
        }
    }, [currentPhase, notifyExplorationEntered]);

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

    // Listen for AI-triggered travel requests
    useEffect(() => {
        if (travelPhase === 'preparing' && destinationSystem) {
            console.log('Detected travel request to:', destinationSystem.id);
            // Trigger the wormhole travel sequence
            handleSystemTravel(destinationSystem.id);
        }
    }, [travelPhase, destinationSystem]);

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

        // Navigate to the content page
        // During tutorial, user will see EXPLORE_CONTENT message on the page
        onNavigate(pageSlug, planet.sectionId);
    };

    // Keyboard shortcuts
    const { isActive: isNavigationVisible, setIsActive: setNavigationVisible } =
        useKeyboardShortcut("n");

    // Auto-dismiss navigation tutorial when navigation panel is opened
    useEffect(() => {
        if (isNavigationVisible && showTutorial && tutorialStep === 0) {
            dismissCurrentTutorial();
        }
    }, [isNavigationVisible, showTutorial, tutorialStep, dismissCurrentTutorial]);

    // Detect user interaction for tutorial (mouse or keyboard)
    useEffect(() => {
        if (!showTutorial || currentPhase !== 'exploration') return;

        const handleInteraction = () => {
            notifyUserInteraction();
        };

        // Listen for mouse movement, clicks, or keyboard
        window.addEventListener('mousemove', handleInteraction, { once: true });
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [showTutorial, currentPhase, notifyUserInteraction]);

    // Terminal keyboard shortcut (T key) - custom implementation
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ignore if user is typing in an input field
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            // 'T' key opens terminal
            if (event.key.toLowerCase() === 't') {
                event.preventDefault();
                openTerminal();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [openTerminal]);

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
        // Detect touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
        
        return (
            <div className="w-full h-screen bg-deep-space relative overflow-y-auto">
                <Suspense fallback={<div className="w-full h-screen bg-deep-space" />}>
                    {pageComponents[currentPage] || pageComponents["about-me"]}
                </Suspense>
                
                {/* Sagittarius Avatar - Hidden on static pages for touch devices */}
                {!isTouchDevice && (
                    <Suspense fallback={null}>
                        <SagittariusAvatar />
                    </Suspense>
                )}
                
                {/* Sagittarius Terminal - Hidden on static pages for touch devices */}
                {!isTouchDevice && (
                    <Suspense fallback={null}>
                        <SagittariusTerminal />
                    </Suspense>
                )}
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-deep-space relative overflow-hidden">
            {/* Fullscreen prompt - shows on initial load if not already in fullscreen */}
            {isFullscreenCheckComplete && showFullscreenPrompt && (
                <FullscreenPrompt onDismiss={() => setShowFullscreenPrompt(false)} />
            )}

            {/* Only render 3D content after fullscreen check is complete and prompt is dismissed */}
            {isFullscreenCheckComplete && !showFullscreenPrompt && (
                <>
                    {currentPhase === "planet-detail" && selectedPlanet ? (
                <Suspense fallback={<div className="w-full h-screen bg-deep-space" />}>
                    <PlanetDetailScene
                        planet={selectedPlanet}
                        systemId={currentSystem?.id}
                        onBack={() => {
                            setSelectedPlanet(null);
                            setCurrentPhase("exploration");
                        }}
                        onDockComplete={handleDockingComplete}
                    />
                </Suspense>
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
                        <Suspense fallback={null}>
                            <SpaceCubeMap />
                        </Suspense>
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
                            <Suspense fallback={null}>
                                <CockpitInterior
                                    onCommand={handleLaunchCommand}
                                    showTerminal={
                                        currentPhase === "cockpit" &&
                                        travelPhase !== "preparing"
                                    }
                                />
                            </Suspense>
                        )}

                        {/* Wormhole and launch sequence */}
                        {currentPhase === "launching" && (
                            <Suspense fallback={null}>
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
                            </Suspense>
                        )}

                        {/* Star system for exploration phase */}
                        {currentPhase === "exploration" && currentSystem && (
                            <Suspense fallback={null}>
                                <StarSystem
                                    visible={true}
                                    planets={currentSystem.planets || []}
                                    animationsPaused={false}
                                />
                            </Suspense>
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
                        <Suspense fallback={null}>
                            <NeuralLinkMap
                                isVisible={isNavigationVisible}
                                onClose={() => setNavigationVisible(false)}
                                onPlanetSelect={(planet) => {
                                    setSelectedPlanet(planet);
                                    setTimeout(() => {
                                        setCurrentPhase("planet-detail");
                                        setNavigationVisible(false);
                                        
                                        // Trigger tutorial step for docking if on step 0 (navigation hint already shown)
                                        if (showTutorial && tutorialStep === 0) {
                                            setTutorialStep(1);
                                        }
                                    }, TRANSITION_DELAYS.PLANET_SELECTION);
                                }}
                                onSystemTravel={(systemId) => {
                                    handleSystemTravel(systemId);
                                    setNavigationVisible(false);
                                }}
                            />
                        </Suspense>
                    )}

                    {/* Exploration controls hint panel - only in exploration phase */}
                    <ExplorationControls
                        isVisible={currentPhase === "exploration"}
                        isNavigationOpen={isNavigationVisible}
                    />

                    {/* Black transition screen when switching to cockpit */}
                    {isTransitioning && (
                        <div className="absolute inset-0 bg-black z-30 pointer-events-none" />
                    )}
                </>
            )}

            {/* Sagittarius Avatar - Floating button to access AI */}
            {/* Hidden during cockpit, launching, and travel phases */}
            {currentPhase !== 'cockpit' && currentPhase !== 'launching' && !travelPhase && (
                <Suspense fallback={null}>
                    <SagittariusAvatar
                        positionVariant={currentPhase === 'planet-detail' ? 'planetDetail' : null}
                    />
                </Suspense>
            )}

            {/* Sagittarius Terminal - Opens with T key or Avatar click */}
            <Suspense fallback={null}>
                <SagittariusTerminal />
            </Suspense>
            </>
        )}
        <Analytics />
        <SpeedInsights />
        </div>
    );
}

export default App;
