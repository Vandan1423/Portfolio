import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stars } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { getPlanetData } from "../../data/planetData";
import PlanetInfoPanel from "../UI/PlanetInfoPanel";
import useKeyboardShortcut from "../../hooks/useKeyboardShortcut";
import OrbitingSpacecraft from "./OrbitingSpacecraft";

/**
 * PlanetDetailScene Component
 *
 * Isolated scene showing a single planet with detailed information
 * Features:
 * - Single planet rendered in center-left of scene
 * - User can rotate the planet (only the planet, not the scene)
 * - Glowing ring around planet
 * - 3D connecting line from planet to info panel
 * - Cyberpunk themed info panel
 *
 * Props:
 * @param {object} planet - Planet object with name, modelPath, scale, orbitColor
 * @param {function} onBack - Callback to return to solar system view
 * @param {function} onOrbitComplete - Callback when orbit sequence completes
 */
const PlanetDetailScene = ({ planet, onBack, onOrbitComplete }) => {
    const planetData = getPlanetData(planet?.name);

    // Keyboard shortcut for orbit sequence (O key)
    const { isActive: isOrbitTriggered, setIsActive: setOrbitTriggered } =
        useKeyboardShortcut("o");

    // Keyboard shortcut for cancelling orbit (X key)
    const { isActive: isCancelOrbit, setIsActive: setCancelOrbit } =
        useKeyboardShortcut("x");

    // Orbit state
    const [isOrbiting, setIsOrbiting] = useState(false);

    // Handle orbit trigger
    useEffect(() => {
        if (isOrbitTriggered && !isOrbiting) {
            console.log("🛸 Orbit sequence triggered!");
            const timer = setTimeout(() => {
                setIsOrbiting(true);
                setOrbitTriggered(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOrbitTriggered, isOrbiting, setOrbitTriggered]);

    // Handle orbit cancellation
    useEffect(() => {
        if (isCancelOrbit && isOrbiting) {
            console.log("❌ Orbit cancelled");
            const timer = setTimeout(() => {
                setIsOrbiting(false);
                setCancelOrbit(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isCancelOrbit, isOrbiting, setCancelOrbit]);

    // Handle orbit completion
    const handleOrbitComplete = () => {
        setIsOrbiting(false);
        if (onOrbitComplete) {
            onOrbitComplete(planet);
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
                backgroundImage: "url(/images/Star2.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Three.js Canvas */}
            <Canvas
                camera={{
                    position: [0, 0, 15],
                    fov: 50,
                    near: 0.1,
                    far: 1000,
                }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Scene Contents */}
                <PlanetDetailContent
                    planet={planet}
                    planetData={planetData}
                    isOrbiting={isOrbiting}
                    onOrbitComplete={handleOrbitComplete}
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

            {/* Orbit Hint */}
            {!isOrbiting && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg border border-cyan-400/30">
                        <p className="text-cyan-400 text-sm text-center">
                            Press <span className="font-bold text-white">O</span> to
                            orbit planet • Press{" "}
                            <span className="font-bold text-white">X</span> to cancel
                        </p>
                    </div>
                </div>
            )}

            {/* Orbiting Status */}
            {isOrbiting && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-orange-500/20 backdrop-blur-md px-6 py-3 rounded-lg border border-orange-500/50">
                        <p className="text-orange-400 text-sm text-center font-bold">
                            🛸 Orbiting... Press{" "}
                            <span className="font-bold text-white">X</span> to cancel
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * PlanetDetailContent - 3D Scene Contents
 * Handles the Three.js rendering of planet, glow, line, etc.
 */
const PlanetDetailContent = ({ planet, planetData, isOrbiting, onOrbitComplete }) => {
    // Calculate planet scale for spacecraft orbit
    const planetScale = useMemo(() => {
        return planet.scale < 1 ? planet.scale * 200 : planet.scale * 1.2;
    }, [planet.scale]);

    return (
        <>
            {/* Ambient Lighting */}
            <ambientLight intensity={2} />

            {/* Key Light - from front-right */}
            <pointLight
                position={[10, 5, 10]}
                intensity={1.5}
                color="#ffffff"
            />

            {/* Rim Light - cyan accent */}
            <pointLight
                position={[-10, 0, -5]}
                intensity={0.8}
                color="#00ffff"
            />

            {/* Planet Group - positioned left of center */}
            <group position={[-4, 0, 0]}>
                {/* Interactive Planet */}
                <InteractivePlanet planet={planet} planetData={planetData} />

                {/* Connecting Line to Info Panel */}
                <ConnectingLine3D
                    startPoint={[0, 0, 0]}
                    endPoint={[8, 0, 0]}
                    color="#00ffff"
                />

                {/* Orbiting Spacecraft */}
                <OrbitingSpacecraft
                    isOrbiting={isOrbiting}
                    planetScale={planetScale}
                    onOrbitComplete={onOrbitComplete}
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
                x: 0, // Disable X-axis rotation
                y: deltaX * 0.005,
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
                rotationVelocity.current.y *= 0.95;

                // Idle rotation when velocity is very low
                if (Math.abs(rotationVelocity.current.y) < 0.0001) {
                    planetRef.current.rotation.y += 0.002;
                }
            }
        }
    });

    // Calculate appropriate scale (normalize different planet scales)
    const normalizedScale = useMemo(() => {
        // Get custom scale multiplier from planet data (default: 1.0)
        const scaleMultiplier = planetData?.detailScaleMultiplier || 1.0;

        // Saturn has a very small scale (0.015), others are 2-5
        // Normalize to make all planets similar size in detail view
        let baseScale;
        if (planet.scale < 1) {
            baseScale = planet.scale * 200; // Saturn: 0.015 * 200 = 3
        } else {
            baseScale = planet.scale * 1.2;
        }

        // Apply custom scale multiplier
        return baseScale * scaleMultiplier;
    }, [planet.scale, planetData]);

    // Get vertical offset from planet data (default: 0)
    const verticalOffset = useMemo(() => {
        return planetData?.verticalOffset || 0;
    }, [planetData]);

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
            position={[0, verticalOffset, 0]}
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
 * CornerFrame - Cyberpunk corner frame overlay
 */
const CornerFrame = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {/* Top Left Corner */}
            <div className="absolute top-4 left-4">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <path
                        d="M 0 30 L 0 0 L 30 0"
                        stroke="#00ffff"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M 0 50 L 0 0 L 50 0"
                        stroke="#00ffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-4 right-4">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <path
                        d="M 50 0 L 80 0 L 80 30"
                        stroke="#00ffff"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M 30 0 L 80 0 L 80 50"
                        stroke="#00ffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-4 left-4">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <path
                        d="M 0 50 L 0 80 L 30 80"
                        stroke="#00ffff"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M 0 30 L 0 80 L 50 80"
                        stroke="#00ffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-4 right-4">
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <path
                        d="M 80 50 L 80 80 L 50 80"
                        stroke="#00ffff"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M 80 30 L 80 80 L 30 80"
                        stroke="#00ffff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.3"
                    />
                </svg>
            </div>
        </div>
    );
};

export default PlanetDetailScene;
