import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo, lazy, Suspense, startTransition, useCallback } from "react";
import {Vector3} from "three";
import { useNavigation } from "./context/NavigationContext";
import { useStarSystem } from "./context/StarSystemContext";
import { useAI } from "./context/AIContext";
import { useTutorial } from "./context/TutorialContext";
import { useGameMode } from "./context/GameModeContext";
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

// Piloting mode components
const PilotingController = lazy(() => import("./components/3D/PilotingController"));
const PilotingHUD = lazy(() => import("./components/UI/PilotingHUD"));
const PlanetSurface = lazy(() => import("./components/3D/PlanetSurface"));

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
const StatusDisplay = ({ phase, systemStatus, currentSystemName, controlMode }) => {
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
            borderColor: controlMode === 'piloting' ? "border-orange-500/30" : "border-cyan-500/30",
            textColor: controlMode === 'piloting' ? "text-orange-400" : "text-cyan-400",
            title: currentSystemName || "UNKNOWN SYSTEM",
            helper: controlMode === 'piloting'
                ? "PILOTING MODE - Press 'O' for orbit view"
                : "Press 'N' for navigation | 'P' to pilot ship",
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

    // Game mode context
    const {
        controlMode,
        enterPilotingMode,
        enterOrbitMode,
        nearestPlanet,
        canLand,
        landedPlanet,
    } = useGameMode();

    // Component state
    const [currentPhase, setCurrentPhase] = useState("cockpit");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [systemStatus, setSystemStatus] = useState("EXPLORATION MODE");
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
    const [isFullscreenCheckComplete, setIsFullscreenCheckComplete] = useState(false);

    // Refs for 3D scene management
    const cameraRef = useRef();
    const wormholeRef = useRef();
    const isCameraTransitioningRef = useRef(false);
    const prevPhaseRef = useRef(currentPhase);
    const prevControlModeRef = useRef(controlMode);

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

        document.addEventListener("fullscreenchange", handleFullscreenChange, { passive: true });
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange, { passive: true });
        document.addEventListener("msfullscreenchange", handleFullscreenChange, { passive: true });

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

    // Handle ESC / any exit from piloting — always trigger smooth return to orbit view
    useEffect(() => {
        const prev = prevControlModeRef.current;
        prevControlModeRef.current = controlMode;

        if (prev === 'piloting' && controlMode === 'orbit' && currentPhase === 'exploration') {
            // Disable orbit controls during transition; they re-enable in onComplete callback
            setOrbitControlsEnabled(false);
            isCameraTransitioningRef.current = true;
        }
    }, [controlMode, currentPhase]);

    // Handler for wormhole travel to another system
    const handleSystemTravel = useCallback((systemId) => {
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

            // Wrap non-urgent state updates in startTransition to reduce INP
            startTransition(() => {
                setCurrentPhase("cockpit");
                setSystemStatus("WARP DRIVE INITIATED - PREPARE FOR JUMP");
                setTravelPhase("preparing");
                setIsTransitioning(false);
            });
        }, TRANSITION_DELAYS.BRIEF_FADE);

        // Auto-trigger launch sequence after showing cockpit
        const totalDelay =
            TRANSITION_DELAYS.BRIEF_FADE + TRANSITION_DELAYS.COCKPIT_VIEW;
        setTimeout(() => {
            startTransition(() => {
                setCurrentPhase("launching");
                setTravelPhase("launching");
                setSystemStatus("WORMHOLE JUMP IN PROGRESS");
            });
        }, totalDelay);
    }, [setTravelDestination, setTravelPhase]);

    // Handler for launch command from cockpit terminal
    const handleLaunchCommand = (command) => {
        if (command !== "launch") return;

        setCurrentPhase("launching");
        setTravelPhase("launching");
        setSystemStatus("LAUNCHING");
    };

    // Listen for AI-triggered travel requests
    useEffect(() => {
        if (travelPhase === 'preparing' && destinationSystem) {
            console.log('Detected travel request to:', destinationSystem.id);
            // Trigger the wormhole travel sequence
            handleSystemTravel(destinationSystem.id);
        }
    }, [travelPhase, destinationSystem, handleSystemTravel]);

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
        window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
        window.addEventListener('click', handleInteraction, { once: true, passive: true });
        window.addEventListener('keydown', handleInteraction, { once: true, passive: true });

        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [showTutorial, currentPhase, notifyUserInteraction]);

    // Terminal keyboard shortcut (T key) AND P/O/L mode switching - CONSOLIDATED into single listener
    // Combining multiple keydown listeners into one reduces INP by avoiding redundant event processing
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore if user is typing in an input field
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            const key = event.key.toLowerCase();

            // 'T' key opens terminal
            if (key === 't') {
                event.preventDefault();
                openTerminal();
                return;
            }

            // Escape key - return from planet detail
            if (event.key === 'Escape' && currentPhase === "planet-detail") {
                startTransition(() => {
                    setSelectedPlanet(null);
                    setCurrentPhase("exploration");
                });
                return;
            }

            // Only allow mode switching during exploration phase
            if (currentPhase !== "exploration") return;

            // 'P' key enters piloting mode
            if (key === 'p' && controlMode === 'orbit') {
                event.preventDefault();
                enterPilotingMode();
                setOrbitControlsEnabled(false);
            }

            // 'O' key returns to orbit mode
            if (key === 'o' && controlMode === 'piloting') {
                event.preventDefault();
                // Release pointer lock before switching to orbit
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
                enterOrbitMode();
                isCameraTransitioningRef.current = true;
            }

            // 'L' key initiates landing - navigate directly to planet detail scene
            if (key === 'l' && controlMode === 'piloting' && canLand && nearestPlanet) {
                event.preventDefault();
                // Release pointer lock and exit piloting mode
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
                enterOrbitMode();
                // Navigate directly to the planet's detail scene
                setSelectedPlanet(nearestPlanet);
                startTransition(() => setCurrentPhase("planet-detail"));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openTerminal, currentPhase, controlMode, canLand, nearestPlanet, enterPilotingMode, enterOrbitMode, setSelectedPlanet, setCurrentPhase]);

    // Lazy page component getter - only creates the component when actually needed
    // Instead of eagerly creating ALL 6 page components on every render
    const getPageComponent = useCallback((page) => {
        switch (page) {
            case 'about-me': return <AboutMe />;
            case 'projects': return <Projects />;
            case 'experience': return <Experience />;
            case 'contact': return <Contact />;
            case 'journey': return <Journey />;
            case 'technologies': return <Technologies />;
            default: return <AboutMe />;
        }
    }, []);

    // Cache touch device detection to avoid expensive matchMedia call on every render
    const isTouchDevice = useMemo(() => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    }, []);

    // Render non-3D pages (including mobile)
    if (currentPage !== "3d-portfolio" || isMobile) {
        return (
            <div className="w-full h-screen bg-deep-space relative overflow-y-auto">
                <Suspense fallback={<div className="w-full h-screen bg-deep-space" />}>
                    {getPageComponent(currentPage)}
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
                    {/* Planet Surface - Walking exploration mode */}
                    {controlMode === 'walking' && landedPlanet && (
                        <Suspense fallback={<div className="w-full h-screen bg-deep-space" />}>
                            <PlanetSurface />
                        </Suspense>
                    )}

                    {currentPhase === "planet-detail" && selectedPlanet && controlMode !== 'walking' ? (
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
                            position: currentPhase === "cockpit" || currentPhase === "launching"
                                ? CAMERA_POSITIONS.COCKPIT
                                : CAMERA_POSITIONS.EXPLORATION,
                            fov: 60,
                            near: 0.1,
                            far: 2000,
                        }}
                        onCreated={({ camera }) => {
                            cameraRef.current = camera;
                            // Position camera based on current phase
                            const isCockpitPhase = currentPhase === "cockpit" || currentPhase === "launching";
                            if (isCockpitPhase) {
                                camera.position.set(...CAMERA_POSITIONS.COCKPIT);
                                camera.lookAt(0, 0, -5);
                            } else {
                                camera.position.set(...CAMERA_POSITIONS.EXPLORATION);
                                camera.lookAt(0, 0, 0);
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
                                orbitControlsEnabled &&
                                controlMode === 'orbit'
                            }
                            enablePan={false}
                            minDistance={50}
                            maxDistance={300}
                            maxPolarAngle={Math.PI / 1.8}
                            minPolarAngle={Math.PI / 4}
                        />

                        {/* Piloting controller (spaceship, camera, collision detection) */}
                        {currentPhase === "exploration" && (controlMode === 'piloting' || controlMode === 'landing') && (
                            <Suspense fallback={null}>
                                <PilotingController planets={currentSystem?.planets || []} />
                            </Suspense>
                        )}

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

                    {/* Status display for all phases (hidden during piloting — PilotingHUD takes over) */}
                    {controlMode !== 'walking' && controlMode !== 'piloting' && (
                        <StatusDisplay
                            phase={currentPhase}
                            systemStatus={systemStatus}
                            currentSystemName={currentSystem?.name}
                            controlMode={controlMode}
                        />
                    )}

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

                    {/* Exploration controls hint panel - only in exploration phase and orbit mode */}
                    <ExplorationControls
                        isVisible={currentPhase === "exploration" && controlMode === 'orbit'}
                        isNavigationOpen={isNavigationVisible}
                    />

                    {/* Piloting HUD - only in exploration phase and piloting mode */}
                    {currentPhase === "exploration" && controlMode === 'piloting' && (
                        <Suspense fallback={null}>
                            <PilotingHUD />
                        </Suspense>
                    )}

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
