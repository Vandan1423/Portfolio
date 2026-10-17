import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo, lazy, Suspense, useCallback } from "react";
import {Vector3} from "three";
import { useNavigation } from "./context/NavigationContext";
import { useStarSystem } from "./context/StarSystemContext";
import { useTutorial } from "./context/TutorialContext";
import { useGameMode } from "./context/GameModeContext";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import FullscreenPrompt from "./components/UI/FullscreenPrompt";
import ExplorationControls from "./components/UI/ExplorationControls";
import WebsiteLink from "./components/UI/WebsiteLink";
import TutorialHint from "./components/UI/TutorialHint";
import { saveLastView } from "./utils/lastView";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import styles from "./App.module.css";

// Lazy load heavy 3D components
const CockpitInterior = lazy(() => import("./components/3D/CockpitInterior"));
const Wormhole = lazy(() => import("./components/3D/Wormhole"));
const LaunchSequence = lazy(() => import("./components/3D/LaunchSequence"));
const StarSystem = lazy(() => import("./components/3D/StarSystem"));
const SpaceCubeMap = lazy(() => import("./components/3D/SpaceCubeMap"));
const PlanetDetailScene = lazy(() => import("./components/3D/PlanetDetailScene"));
const NeuralLinkMap = lazy(() => import("./components/UI/NeuralLinkMap"));

// Piloting mode components
const PilotingController = lazy(() => import("./components/3D/PilotingController"));
const PilotingHUD = lazy(() => import("./components/UI/PilotingHUD"));

// Lazy load page components
const AboutMe = lazy(() => import("./pages/AboutMe/AboutMe"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Experience = lazy(() => import("./pages/Experience/Experience"));
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
 * Shows where the visitor is, in the top-left corner
 */
const StatusDisplay = ({ phase, systemStatus, currentSystem }) => {
    const statusConfig = {
        cockpit: {
            title: "Cockpit",
            // While travelling the status line says what is happening instead
            helper: !systemStatus && <>Type <kbd>launch</kbd> or press Launch to start</>,
        },
        launching: {
            title: "Launching",
        },
        exploration: {
            title: currentSystem?.name || "Unknown system",
            subtitle: currentSystem?.page,
            helper: <><kbd>N</kbd> map · <kbd>P</kbd> pilot the ship</>,
        },
    };

    const config = statusConfig[phase];
    if (!config) return null;

    return (
        <div className={styles.status}>
            <div className={styles.statusTitle}>
                {config.title}
                {config.subtitle && <span className={styles.statusSubtitle}> · {config.subtitle}</span>}
            </div>
            {systemStatus && <div className={styles.statusLine}>{systemStatus}</div>}
            {config.helper && <div className={styles.statusHelper}>{config.helper}</div>}
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
        currentSystemId,
        initialView,
    } = useStarSystem();

    // Tutorial context
    const { completeTip } = useTutorial();

    // Game mode context
    const {
        controlMode,
        enterPilotingMode,
        enterOrbitMode,
        nearestPlanet,
        canLand,
    } = useGameMode();

    // Component state
    // A visitor coming back in the same tab returns to their last 3D view,
    // with no landing screen or cockpit in the way
    const [currentPhase, setCurrentPhase] = useState(initialView?.phase ?? "cockpit");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [systemStatus, setSystemStatus] = useState(null);
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(!initialView);
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
        }
    }, [currentPhase]);

    // Remember the current system and open planet for the "3D view" link
    useEffect(() => {
        if (travelPhase) return;
        if (currentPhase === "exploration") {
            saveLastView(currentSystemId);
        } else if (currentPhase === "planet-detail" && selectedPlanet) {
            saveLastView(currentSystemId, selectedPlanet.id);
        }
    }, [currentPhase, currentSystemId, selectedPlanet, travelPhase]);

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

            setCurrentPhase("cockpit");
            setSystemStatus("Preparing to jump");
            setTravelPhase("preparing");
            setIsTransitioning(false);
        }, TRANSITION_DELAYS.BRIEF_FADE);

        // Auto-trigger launch sequence after showing cockpit
        const totalDelay =
            TRANSITION_DELAYS.BRIEF_FADE + TRANSITION_DELAYS.COCKPIT_VIEW;
        setTimeout(() => {
            setCurrentPhase("launching");
            setTravelPhase("launching");
            setSystemStatus("Jumping through the wormhole");
        }, totalDelay);
    }, [setTravelDestination, setTravelPhase]);

    // Handler for launch command from cockpit terminal
    const handleLaunchCommand = (command) => {
        if (command !== "launch") return;

        setCurrentPhase("launching");
        setTravelPhase("launching");
        setSystemStatus(null);
    };

    // Handler for planet docking completion
    const handleDockingComplete = (planet) => {
        if (!planet || !currentSystem) return;

        const pageSlug = currentSystem.page.toLowerCase().replace(/\s+/g, "-");

        // Navigate to the content page
        onNavigate(pageSlug, planet.sectionId);
    };

    // Keyboard shortcuts
    const { isActive: isNavigationVisible, setIsActive: setNavigationVisible } =
        useKeyboardShortcut("n");

    // Opening the map completes the map tip
    useEffect(() => {
        if (isNavigationVisible) completeTip('navigation-hint');
    }, [isNavigationVisible, completeTip]);

    useKeyboardShortcut("Escape", () => {
        if (currentPhase === "planet-detail") {
            setSelectedPlanet(null);
            setCurrentPhase("exploration");
        }
    });

    // P/O key handlers for piloting/orbit mode toggle
    useEffect(() => {
        const handleModeSwitch = (event) => {
            // Ignore if user is typing in an input field
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            // Only allow mode switching during exploration phase
            if (currentPhase !== "exploration") return;

            const key = event.key.toLowerCase();

            // 'P' key enters piloting mode
            if (key === 'p' && controlMode === 'orbit') {
                event.preventDefault();
                enterPilotingMode();
                setOrbitControlsEnabled(false);
                completeTip('piloting-hint');
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
                completeTip('landing-hint');
                // Navigate directly to the planet's detail scene
                setSelectedPlanet(nearestPlanet);
                setCurrentPhase("planet-detail");
            }
        };

        window.addEventListener("keydown", handleModeSwitch);
        return () => window.removeEventListener("keydown", handleModeSwitch);
    }, [currentPhase, controlMode, canLand, nearestPlanet, enterPilotingMode, enterOrbitMode, setSelectedPlanet, completeTip]);

    // Memoized page components mapping
    const pageComponents = useMemo(
        () => ({
            "about-me": <AboutMe />,
            projects: <Projects />,
            experience: <Experience />,
            journey: <Journey />,
        }),
        []
    );

    // Render non-3D pages (including mobile)
    if (currentPage !== "3d-portfolio" || isMobile) {
        return (
            <div className="w-full min-h-screen relative">
                <Suspense fallback={<div className={styles.pageFallback} />}>
                    {pageComponents[currentPage] || pageComponents["about-me"]}
                </Suspense>
            </div>
        );
    }

    return (
        <div className={styles.scene}>
            {/* Fullscreen prompt - shows on initial load if not already in fullscreen */}
            {isFullscreenCheckComplete && showFullscreenPrompt && (
                <FullscreenPrompt
                    onDismiss={() => setShowFullscreenPrompt(false)}
                    onViewWebsite={() => {
                        setShowFullscreenPrompt(false);
                        onNavigate("about-me");
                    }}
                />
            )}

            {/* Only render 3D content after fullscreen check is complete and prompt is dismissed */}
            {isFullscreenCheckComplete && !showFullscreenPrompt && (
                <>
                    {currentPhase === "planet-detail" && selectedPlanet ? (
                <Suspense fallback={<div className={styles.sceneFallback} />}>
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
                        {currentPhase === "exploration" && controlMode === 'piloting' && (
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
                                        destinationSystem?.color || "amber"
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
                                            setSystemStatus(null);
                                            setTravelDestination(null);
                                        } else {
                                            setSystemStatus(null);
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
                    {controlMode !== 'piloting' && (
                        <StatusDisplay
                            phase={currentPhase}
                            systemStatus={systemStatus}
                            currentSystem={currentSystem}
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

                    {/* Way out to the plain website (piloting has its own HUD in this corner) */}
                    {(currentPhase === "cockpit" || currentPhase === "exploration") &&
                        controlMode === 'orbit' &&
                        !travelPhase &&
                        !isNavigationVisible && <WebsiteLink />}

                    {/* First-visit tips */}
                    {currentPhase === "exploration" && !isNavigationVisible && (
                        <TutorialHint view={controlMode} />
                    )}

                    {/* Black transition screen when switching to cockpit */}
                    {isTransitioning && (
                        <div className="absolute inset-0 bg-black z-30 pointer-events-none" />
                    )}
                </>
            )}
            </>
        )}
        <Analytics />
        <SpeedInsights />
        </div>
    );
}

export default App;
