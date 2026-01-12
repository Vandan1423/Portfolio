import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { getSectionData } from "../../data/sectionData";
import { useTutorial } from "../../context/TutorialContext";
import PlanetInfoPanel from "../UI/PlanetInfoPanel";
import useKeyboardShortcut from "../../hooks/useKeyboardShortcut";
import DockingSpacecraft from "./DockingSpacecraft";

// Camera configuration
const CAMERA_POSITION = [0, 0, 15];
const CAMERA_FOV = 50;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

// Lighting configuration
const LIGHTS = {
    ambient: { intensity: 2 },
    key: { position: [10, 5, 10], intensity: 1.5, color: "#ffffff" },
    rim: { position: [-10, 0, -5], intensity: 0.8, color: "#00ffff" },
};

// Planet positioning
const PLANET_GROUP_OFFSET = [-4, 0, 0];
const LINE_START_POINT = [0, 0, 0];
const LINE_END_POINT = [8, 0, 0];
const LINE_COLOR = "#00ffff";

// Planet rotation settings
const ROTATION_SENSITIVITY = 0.005;
const ROTATION_FRICTION = 0.95;
const IDLE_ROTATION_SPEED = 0.002;
const IDLE_ROTATION_THRESHOLD = 0.0001;

// Planet scale normalization
const SMALL_PLANET_MULTIPLIER = 200; // For planets with scale < 1
const NORMAL_PLANET_MULTIPLIER = 1.2;
const SMALL_PLANET_THRESHOLD = 1;

// Corner frame configuration
const CORNER_SIZE = 80;
const CORNER_OFFSET = 4; // Tailwind units (top-4, left-4, etc.)
const CORNER_STROKE_PRIMARY = 2;
const CORNER_STROKE_SECONDARY = 1;
const CORNER_OPACITY_PRIMARY = 0.7;
const CORNER_OPACITY_SECONDARY = 0.3;
const CORNER_COLOR = "#00ffff";

// Corner frame path data
const CORNER_PATHS = [
    {
        d: "M 0 30 L 0 0 L 30 0",
        strokeWidth: CORNER_STROKE_PRIMARY,
        opacity: CORNER_OPACITY_PRIMARY,
    },
    {
        d: "M 0 50 L 0 0 L 50 0",
        strokeWidth: CORNER_STROKE_SECONDARY,
        opacity: CORNER_OPACITY_SECONDARY,
    },
];

/**
 * PlanetDetailScene Component
 *
 * Isolated scene showing a single planet with detailed information
 * Features interactive planet rotation, docking sequence, and cyberpunk UI
 *
 * @param {object} planet - Planet object with name, modelPath, scale, orbitColor
 * @param {string} systemId - Star system ID
 * @param {function} onBack - Callback to return to solar system view
 * @param {function} onDockComplete - Callback when docking sequence completes
 */
const PlanetDetailScene = ({ planet, systemId, onBack, onDockComplete }) => {
    // Get section data using both systemId and planet's sectionId
    const planetData = getSectionData(systemId, planet?.sectionId);

    // Tutorial context
    const { isActive: tutorialActive, currentStep: tutorialStep, completeStep: tutorialCompleteStep, nextStep: tutorialNextStep } = useTutorial();

    // Keyboard shortcut for docking sequence (D key)
    const { isActive: isDockTriggered, setIsActive: setDockTriggered } =
        useKeyboardShortcut("d");

    // Keyboard shortcut for cancelling docking (X key)
    const { isActive: isCancelDock, setIsActive: setCancelDock } =
        useKeyboardShortcut("x");

    // Docking state
    const [isDocking, setIsDocking] = useState(false);

    // Handle docking trigger
    useEffect(() => {
        if (isDockTriggered && !isDocking) {
            const timer = setTimeout(() => {
                setIsDocking(true);
                setDockTriggered(false);

                // Tutorial: Clear UI when docking starts so user can watch animation
                if (tutorialActive && tutorialStep === 'PLANET_DOCKING') {
                    tutorialNextStep('DOCKING_IN_PROGRESS');
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isDockTriggered, isDocking, setDockTriggered, tutorialActive, tutorialStep, tutorialNextStep]);

    // Handle docking cancellation
    useEffect(() => {
        if (isCancelDock && isDocking) {
            const timer = setTimeout(() => {
                setIsDocking(false);
                setCancelDock(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isCancelDock, isDocking, setCancelDock]);

    // Handle docking completion
    const handleDockComplete = () => {
        setIsDocking(false);

        // Tutorial: Complete docking and advance to explore content
        if (tutorialActive && tutorialStep === 'DOCKING_IN_PROGRESS') {
            tutorialCompleteStep('DOCKING_IN_PROGRESS', {
                id: 'space-captain',
                icon: '🎯',
                name: "SPACE CAPTAIN",
                description: "Successfully docked at your first planet"
            });
            tutorialNextStep('EXPLORE_CONTENT');
        }

        // Trigger the docking complete callback (which handles navigation)
        if (onDockComplete) {
            onDockComplete(planet);
        }
    };

    if (!planet || !planetData) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <p className="text-cyan-400 font-mono">No planet selected</p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-screen relative overflow-hidden"
            style={{
                backgroundImage:
                    "url(https://res.cloudinary.com/didezuerl/image/upload/v1766048721/Star2_e224oc.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Three.js Canvas */}
            <Canvas
                camera={{
                    position: CAMERA_POSITION,
                    fov: CAMERA_FOV,
                    near: CAMERA_NEAR,
                    far: CAMERA_FAR,
                }}
                gl={{ antialias: true, alpha: true }}
                data-tutorial="planet-3d-view"
            >
                {/* Scene Contents */}
                <PlanetDetailContent
                    planet={planet}
                    planetData={planetData}
                    isDocking={isDocking}
                    onDockComplete={handleDockComplete}
                />
            </Canvas>

            {/* Corner Frame Overlay (HTML) */}
            <CornerFrame />

            {/* Info Panel (HTML Overlay) */}
            <PlanetInfoPanel
                planetData={planetData}
                planetColor={planet.orbitColor}
                onBack={onBack}
            />

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-8 left-8 z-50 group"
            >
                <div
                    className="flex items-center space-x-3 px-4 py-2 bg-black/50 backdrop-blur-sm
                    border border-cyan-500/50 rounded transition-all duration-300
                    hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                    <span className="text-cyan-400 text-xl group-hover:text-cyan-300 transition-colors">
                        ←
                    </span>
                    <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider group-hover:text-cyan-300">
                        Return to System
                    </span>
                </div>
            </button>

            {/* Planet Name Header */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">
                <div className="text-center">
                    <p className="text-cyan-500/70 font-mono text-xs tracking-[0.3em] uppercase mb-1">
                        Analyzing
                    </p>
                    <h1
                        className="text-3xl font-bold text-cyan-400 font-mono tracking-wider"
                        style={{
                            textShadow: `0 0 20px ${planet.orbitColor}, 0 0 40px ${planet.orbitColor}50`,
                        }}
                    >
                        {planet.name.toUpperCase()}
                    </h1>
                    <p className="text-cyan-400/60 font-mono text-sm mt-1">
                        {planet.section}
                    </p>
                </div>
            </div>

            {/* Docking Hint - Sleek & Eye-Catching */}
            {!isDocking && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40 docking-hint">
                    <div className="relative group">
                        {/* Animated gradient background */}
                        <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-1000 animate-pulse"></div>

                        {/* Main card */}
                        <div className="relative bg-linear-to-br from-gray-900 via-black to-gray-900 p-4 rounded-xl border border-cyan-400/50 shadow-2xl">
                            {/* Main action */}
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    {/* Key visual */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 animate-pulse"></div>
                                        <kbd className="relative inline-flex items-center justify-center w-10 h-10 font-bold text-xl text-black bg-linear-to-br from-cyan-300 to-cyan-500 rounded-lg shadow-lg transform hover:scale-110 transition-transform">
                                            D
                                        </kbd>
                                    </div>

                                    {/* Text */}
                                    <div className="text-left">
                                        <p className="text-sm text-cyan-300/70 leading-tight">
                                            Press D to
                                        </p>
                                        <p className="text-lg font-bold text-white leading-tight">
                                            Dock with Planet
                                        </p>
                                        <p className="text-xs text-cyan-300/60 mt-0.5">
                                            and explore content
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/30 to-transparent my-3"></div>

                            {/* Secondary action */}
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span>Press</span>
                                <kbd className="px-2 py-1 font-mono font-bold text-white bg-gray-800 border border-gray-600 rounded shadow-sm">
                                    X
                                </kbd>
                                <span>to cancel</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Docking Status - Sleek Progress Indicator */}
            {isDocking && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="relative">
                        {/* Animated gradient background */}
                        <div className="absolute -inset-1 bg-linear-to-r from-orange-500 via-red-500 to-orange-600 rounded-xl opacity-75 blur animate-pulse"></div>

                        {/* Main card */}
                        <div className="relative bg-linear-to-br from-gray-900 via-black to-gray-900 px-8 py-5 rounded-xl border border-orange-400/50 shadow-2xl">
                            {/* Status message */}
                            <div className="flex items-center justify-center gap-3 mb-3 p-4">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping absolute"></div>
                                    <div className="w-3 h-3 bg-orange-500 rounded-full relative"></div>
                                </div>
                                <p className="text-lg font-bold text-white">
                                    Docking Sequence Active
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-linear-to-r from-orange-400 to-red-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                            </div>

                            {/* Cancel action */}
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 p-4">
                                <span>Press</span>
                                <kbd className="px-2 py-1 font-mono font-bold text-white bg-gray-800 border border-orange-600 rounded shadow-sm">
                                    X
                                </kbd>
                                <span>to abort docking</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * PlanetDetailContent - 3D Scene Contents
 *
 * Handles Three.js rendering of planet, lighting, connecting line, and spacecraft
 *
 * @param {object} planet - Planet data
 * @param {object} planetData - Section data for the planet
 * @param {boolean} isDocking - Whether docking sequence is active
 * @param {function} onDockComplete - Callback when docking completes
 */
const PlanetDetailContent = ({
    planet,
    planetData,
    isDocking,
    onDockComplete,
}) => {
    // Calculate planet scale for spacecraft docking
    const planetScale = useMemo(() => {
        return planet.scale < SMALL_PLANET_THRESHOLD
            ? planet.scale * SMALL_PLANET_MULTIPLIER
            : planet.scale * NORMAL_PLANET_MULTIPLIER;
    }, [planet.scale]);

    return (
        <>
            {/* Scene lighting */}
            <ambientLight intensity={LIGHTS.ambient.intensity} />
            <pointLight
                position={LIGHTS.key.position}
                intensity={LIGHTS.key.intensity}
                color={LIGHTS.key.color}
            />
            <pointLight
                position={LIGHTS.rim.position}
                intensity={LIGHTS.rim.intensity}
                color={LIGHTS.rim.color}
            />

            {/* Planet group - positioned left of center */}
            <group position={PLANET_GROUP_OFFSET}>
                <InteractivePlanet planet={planet} planetData={planetData} />
                <ConnectingLine3D
                    startPoint={LINE_START_POINT}
                    endPoint={LINE_END_POINT}
                    color={LINE_COLOR}
                />
                <DockingSpacecraft
                    isDocking={isDocking}
                    planetScale={planetScale}
                    planetPosition={new THREE.Vector3(...LINE_START_POINT)}
                    onDockComplete={onDockComplete}
                />
            </group>
        </>
    );
};

/**
 * InteractivePlanet - The planet model with user rotation control
 */
const InteractivePlanet = ({ planet, planetData }) => {
    const { scene } = useGLTF(planet.modelPath);
    const planetRef = useRef();
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const rotationVelocity = useRef({ x: 0, y: 0 });
    const { gl } = useThree();

    // Clone the scene to avoid issues with multiple uses
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Handle mouse/touch events for planet rotation
    useEffect(() => {
        const canvas = gl.domElement;

        const handlePointerDown = (e) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
            rotationVelocity.current = { x: 0, y: 0 };
        };

        const handlePointerMove = (e) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - previousMousePosition.current.x;

            // Only allow rotation around Y-axis (vertical axis)
            rotationVelocity.current = {
                x: 0,
                y: deltaX * ROTATION_SENSITIVITY,
            };

            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handlePointerUp = () => {
            isDragging.current = false;
        };

        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerup", handlePointerUp);
        canvas.addEventListener("pointerleave", handlePointerUp);

        return () => {
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerup", handlePointerUp);
            canvas.removeEventListener("pointerleave", handlePointerUp);
        };
    }, [gl]);

    // Animation loop for rotation with momentum
    useFrame(() => {
        if (planetRef.current) {
            // Apply rotation only around Y-axis (vertical axis)
            planetRef.current.rotation.y += rotationVelocity.current.y;

            // Apply friction when not dragging
            if (!isDragging.current) {
                rotationVelocity.current.y *= ROTATION_FRICTION;

                // Idle rotation when velocity is very low
                if (
                    Math.abs(rotationVelocity.current.y) <
                    IDLE_ROTATION_THRESHOLD
                ) {
                    planetRef.current.rotation.y += IDLE_ROTATION_SPEED;
                }
            }
        }
    });

    // Calculate appropriate scale (normalize different planet scales)
    const normalizedScale = useMemo(() => {
        const scaleMultiplier = planetData?.detailScaleMultiplier || 1.0;

        // Normalize to make all planets similar size in detail view
        const baseScale =
            planet.scale < SMALL_PLANET_THRESHOLD
                ? planet.scale * SMALL_PLANET_MULTIPLIER
                : planet.scale * NORMAL_PLANET_MULTIPLIER;

        return baseScale * scaleMultiplier;
    }, [planet.scale, planetData]);

    // Get position offset from planet's detailOffset property [x, y, z]
    // Default to [0, 0, 0] if not specified
    const positionOffset = useMemo(() => {
        return planet?.detailOffset || [0, 0, 0];
    }, [planet]);

    // Get axial tilt from planet data (default: 0) and convert to radians
    const axialTilt = useMemo(() => {
        const tiltDegrees = planetData?.axialTilt || 0;
        return (tiltDegrees * Math.PI) / 180; // Convert degrees to radians
    }, [planetData]);

    return (
        <primitive
            ref={planetRef}
            object={clonedScene}
            scale={normalizedScale}
            position={positionOffset}
            rotation={[0, 0, axialTilt]} // Apply axial tilt on Z-axis
        />
    );
};

/**
 * ConnectingLine3D - 3D line connecting planet to info panel
 */
const ConnectingLine3D = ({ startPoint, endPoint, color = "#00ffff" }) => {
    const lineRef = useRef();

    // Create line geometry
    const points = useMemo(() => {
        return [
            new THREE.Vector3(...startPoint),
            new THREE.Vector3(...endPoint),
        ];
    }, [startPoint, endPoint]);

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [points]);

    return (
        <group>
            {/* Main Line */}
            <line ref={lineRef} geometry={lineGeometry}>
                <lineBasicMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    linewidth={2}
                />
            </line>

            {/* Glow effect on line */}
            <line geometry={lineGeometry}>
                <lineBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    linewidth={4}
                />
            </line>
        </group>
    );
};

/**
 * Corner SVG - Reusable corner decoration
 *
 * @param {string} corner - Corner position ("topLeft" | "topRight" | "bottomLeft" | "bottomRight")
 */
const CornerSVG = ({ corner }) => {
    const paths = {
        topLeft: ["M 0 30 L 0 0 L 30 0", "M 0 50 L 0 0 L 50 0"],
        topRight: ["M 50 0 L 80 0 L 80 30", "M 30 0 L 80 0 L 80 50"],
        bottomLeft: ["M 0 50 L 0 80 L 30 80", "M 0 30 L 0 80 L 50 80"],
        bottomRight: ["M 80 50 L 80 80 L 50 80", "M 80 30 L 80 80 L 30 80"],
    };

    return (
        <svg
            width={CORNER_SIZE}
            height={CORNER_SIZE}
            viewBox={`0 0 ${CORNER_SIZE} ${CORNER_SIZE}`}
        >
            {CORNER_PATHS.map((pathConfig, index) => (
                <path
                    key={index}
                    d={paths[corner][index]}
                    stroke={CORNER_COLOR}
                    strokeWidth={pathConfig.strokeWidth}
                    fill="none"
                    opacity={pathConfig.opacity}
                />
            ))}
        </svg>
    );
};

/**
 * CornerFrame - Cyberpunk corner frame overlay
 */
const CornerFrame = () => {
    const corners = [
        { position: "top-4 left-4", type: "topLeft" },
        { position: "top-4 right-4", type: "topRight" },
        { position: "bottom-4 left-4", type: "bottomLeft" },
        { position: "bottom-4 right-4", type: "bottomRight" },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {corners.map(({ position, type }) => (
                <div key={type} className={`absolute ${position}`}>
                    <CornerSVG corner={type} />
                </div>
            ))}
        </div>
    );
};

export default PlanetDetailScene;
