import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { getSectionData } from "../../data/sectionData";
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
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isDockTriggered, isDocking, setDockTriggered]);

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

            {/* Docking Hint */}
            {!isDocking && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg border border-cyan-400/30">
                        <p className="text-cyan-400 text-sm text-center">
                            Press{" "}
                            <span className="font-bold text-white">D</span> to
                            dock with planet • Press{" "}
                            <span className="font-bold text-white">X</span> to
                            cancel
                        </p>
                    </div>
                </div>
            )}

            {/* Docking Status */}
            {isDocking && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-orange-500/20 backdrop-blur-md px-6 py-3 rounded-lg border border-orange-500/50">
                        <p className="text-orange-400 text-sm text-center font-bold">
                            🚀 Docking sequence initiated... Press{" "}
                            <span className="font-bold text-white">X</span> to
                            cancel
                        </p>
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
