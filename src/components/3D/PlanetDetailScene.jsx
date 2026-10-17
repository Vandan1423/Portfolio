import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import {Vector3, BufferGeometry} from "three";
import { getSectionData } from "../../data/planetPanels";
import PlanetInfoPanel from "../UI/PlanetInfoPanel";
import useKeyboardShortcut from "../../hooks/useKeyboardShortcut";
import DockingSpacecraft from "./DockingSpacecraft";
import { theme } from "../../styles/theme";
import styles from "./PlanetDetailScene.module.css";

// Camera configuration
const CAMERA_POSITION = [0, 0, 15];
const CAMERA_FOV = 50;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

// Lighting configuration
const LIGHTS = {
    ambient: { intensity: 2 },
    key: { position: [10, 5, 10], intensity: 1.5, color: "#ffffff" },
    rim: { position: [-10, 0, -5], intensity: 0.8, color: theme.text },
};

// Planet positioning
const PLANET_GROUP_OFFSET = [-4, 0, 0];
const LINE_START_POINT = [0, 0, 0];
const LINE_END_POINT = [8, 0, 0];
const LINE_COLOR = theme.accent;

// Planet rotation settings
const ROTATION_SENSITIVITY = 0.005;
const ROTATION_FRICTION = 0.95;
const IDLE_ROTATION_SPEED = 0.002;
const IDLE_ROTATION_THRESHOLD = 0.0001;

// Planet scale normalization
const SMALL_PLANET_MULTIPLIER = 200; // For planets with scale < 1
const NORMAL_PLANET_MULTIPLIER = 1.2;
const SMALL_PLANET_THRESHOLD = 1;

/**
 * PlanetDetailScene Component
 *
 * Isolated scene showing a single planet with detailed information
 * Features interactive planet rotation and the docking sequence
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

        // Trigger the docking complete callback (which handles navigation)
        if (onDockComplete) {
            onDockComplete(planet);
        }
    };

    if (!planet || !planetData) {
        return (
            <div className={styles.empty}>
                <p>No planet selected</p>
            </div>
        );
    }

    return (
        <div className={styles.scene}>
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

            {/* Info Panel (HTML Overlay) */}
            <PlanetInfoPanel planetData={planetData} onBack={onBack} />

            {/* Back Button */}
            <button onClick={onBack} className={styles.backButton}>
                ← Back to the system
            </button>

            {/* Planet Name Header */}
            <div className={styles.planetHeader}>
                <h1 className={styles.planetName}>{planet.name}</h1>
                {planet.section && <p className={styles.planetSection}>{planet.section}</p>}
            </div>

            {/* Docking hint, then docking status */}
            <div className={styles.dockBar}>
                {isDocking ? (
                    <>
                        <span className={styles.dockStatus}>Docking…</span>
                        <span className={styles.dockMeta}>
                            <kbd className={styles.key}>X</kbd> to cancel
                        </span>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className={styles.dockButton}
                            onClick={() => setIsDocking(true)}
                        >
                            <kbd className={styles.key}>D</kbd> Dock and open this section
                        </button>
                        <span className={styles.dockMeta}>
                            <kbd className={styles.key}>Esc</kbd> to go back
                        </span>
                    </>
                )}
            </div>
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
                    planetPosition={new Vector3(...LINE_START_POINT)}
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
const ConnectingLine3D = ({ startPoint, endPoint, color = theme.accent }) => {
    const lineRef = useRef();

    // Create line geometry
    const points = useMemo(() => {
        return [
            new Vector3(...startPoint),
            new Vector3(...endPoint),
        ];
    }, [startPoint, endPoint]);

    const lineGeometry = useMemo(() => {
        const geometry = new BufferGeometry().setFromPoints(points);
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

export default PlanetDetailScene;
