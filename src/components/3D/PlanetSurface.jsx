import { Suspense, useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars, Environment } from '@react-three/drei';
import { Vector3 } from 'three';
import { useGameMode } from '../../context/GameModeContext';
import { useNavigation } from '../../context/NavigationContext';
import { useStarSystem } from '../../context/StarSystemContext';
import WalkingCharacter from './WalkingCharacter';
import WalkingCamera from './WalkingCamera';
import ContentStation from './ContentStation';
import useWalkingControls from '../../hooks/useWalkingControls';
import { getSectionData } from '../../data/sectionData';
import styles from './PlanetSurface.module.css';

/**
 * Surface theme configurations
 */
const SURFACE_THEMES = {
    // Alpha Centauri (About) - Rocky Mars-like
    'alpha-centauri': {
        groundColor: '#8B4513',
        atmosphereColor: '#ff6b35',
        skyColor: '#1a0a00',
        ambientIntensity: 0.4,
        fogColor: '#331a00',
        fogDensity: 0.02,
    },
    // Sirius (Projects) - Tech platform
    sirius: {
        groundColor: '#1a1a2e',
        atmosphereColor: '#3b82f6',
        skyColor: '#0a0a1a',
        ambientIntensity: 0.5,
        fogColor: '#0a1628',
        fogDensity: 0.015,
    },
    // Vega (Experience) - Crystal caves
    vega: {
        groundColor: '#2a0040',
        atmosphereColor: '#8b5cf6',
        skyColor: '#0d001a',
        ambientIntensity: 0.3,
        fogColor: '#1a0033',
        fogDensity: 0.025,
    },
    // Betelgeuse (Contact) - Desert dunes
    betelgeuse: {
        groundColor: '#c2a366',
        atmosphereColor: '#f97316',
        skyColor: '#1a1000',
        ambientIntensity: 0.6,
        fogColor: '#332200',
        fogDensity: 0.01,
    },
    // Polaris (Journey) - Ice world
    polaris: {
        groundColor: '#e0f7fa',
        atmosphereColor: '#6366f1',
        skyColor: '#0a0a1f',
        ambientIntensity: 0.7,
        fogColor: '#1a1a3a',
        fogDensity: 0.02,
    },
    // Rigel (Technologies) - Circuit board
    rigel: {
        groundColor: '#0d1117',
        atmosphereColor: '#14b8a6',
        skyColor: '#000a0a',
        ambientIntensity: 0.4,
        fogColor: '#001a1a',
        fogDensity: 0.015,
    },
};

/**
 * Ground Component
 * Renders the planet surface terrain
 */
const Ground = ({ color, gridColor }) => {
    return (
        <group>
            {/* Main ground plane */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[200, 200, 50, 50]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.9}
                />
            </mesh>

            {/* Grid overlay for tech effect */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, 0]}
            >
                <planeGeometry args={[200, 200]} />
                <meshBasicMaterial
                    color={gridColor}
                    transparent
                    opacity={0.1}
                    wireframe
                />
            </mesh>
        </group>
    );
};

/**
 * ParkedShip Component
 * Shows the player's ship parked on the surface
 */
const ParkedShip = ({ position }) => {
    return (
        <group position={position}>
            {/* Simple ship representation */}
            <mesh position={[0, 1, 0]}>
                <coneGeometry args={[1, 3, 8]} />
                <meshStandardMaterial
                    color="#2a2a3a"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Landing lights */}
            <pointLight
                position={[0, 0.5, 0]}
                color="#00ffff"
                intensity={2}
                distance={5}
            />

            {/* Ground marker */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.02, 0]}
            >
                <circleGeometry args={[3, 32]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
};

/**
 * Decorations Component
 * Adds themed decorative elements to the surface
 */
const Decorations = ({ systemId, color }) => {
    // Generate random positions for decorations
    const decorations = useMemo(() => {
        const items = [];
        const count = 15;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 20 + Math.random() * 30;
            items.push({
                position: [
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius,
                ],
                scale: 0.5 + Math.random() * 1.5,
                rotation: Math.random() * Math.PI * 2,
            });
        }

        return items;
    }, []);

    return (
        <group>
            {decorations.map((dec, i) => (
                <mesh
                    key={i}
                    position={dec.position}
                    rotation={[0, dec.rotation, 0]}
                >
                    {/* Different shapes based on system theme */}
                    {systemId === 'rigel' ? (
                        <boxGeometry args={[dec.scale, dec.scale * 2, dec.scale]} />
                    ) : systemId === 'polaris' ? (
                        <octahedronGeometry args={[dec.scale]} />
                    ) : (
                        <coneGeometry args={[dec.scale * 0.5, dec.scale * 2, 6]} />
                    )}
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
};

/**
 * SurfaceScene Component
 * The 3D scene content for planet surface
 */
const SurfaceScene = ({ systemId, planet, onStationInteract, walkingControls }) => {
    const theme = SURFACE_THEMES[systemId] || SURFACE_THEMES.sirius;

    // Generate content stations based on planet's parent system
    const stations = useMemo(() => {
        // Create stations in a circle around the spawn point
        const stationConfigs = [
            { offset: [12, 0, 0], label: 'Details' },
            { offset: [-8, 0, 10], label: 'Info' },
            { offset: [0, 0, -12], label: 'View' },
        ];

        return stationConfigs.map((config, i) => ({
            id: `station-${i}`,
            position: config.offset,
            label: planet?.name || config.label,
            color: planet?.color || theme.atmosphereColor,
        }));
    }, [planet, theme.atmosphereColor]);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={theme.ambientIntensity} color={theme.atmosphereColor} />
            <directionalLight
                position={[50, 50, 25]}
                intensity={1}
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <pointLight
                position={[0, 20, 0]}
                intensity={0.5}
                color={theme.atmosphereColor}
            />

            {/* Sky and atmosphere */}
            <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={4}
                fade
            />
            <fog attach="fog" args={[theme.fogColor, 30, 100]} />

            {/* Ground */}
            <Ground color={theme.groundColor} gridColor={theme.atmosphereColor} />

            {/* Decorations */}
            <Decorations systemId={systemId} color={theme.atmosphereColor} />

            {/* Parked ship */}
            <ParkedShip position={[5, 0, 8]} />

            {/* Content stations */}
            {stations.map((station) => (
                <ContentStation
                    key={station.id}
                    position={station.position}
                    label={station.label}
                    color={station.color}
                    sectionId={planet?.sectionId}
                    onInteract={() => onStationInteract(station)}
                />
            ))}

            {/* Walking character */}
            <WalkingCharacter controls={walkingControls} />

            {/* Camera controller */}
            <WalkingCamera />
        </>
    );
};

/**
 * SurfaceHUD Component
 * UI overlay for planet surface exploration
 */
const SurfaceHUD = ({ planet, systemName, onReturnToShip }) => {
    return (
        <div className={styles.hud}>
            {/* Location info */}
            <div className={styles.locationPanel}>
                <div className={styles.systemName}>{systemName}</div>
                <div className={styles.planetName}>{planet?.name || 'Unknown Surface'}</div>
            </div>

            {/* Controls hint */}
            <div className={styles.controlsPanel}>
                <div className={styles.controlsHint}>
                    <span className={styles.key}>W A S D</span>
                    <span>Move</span>
                </div>
                <div className={styles.controlsHint}>
                    <span className={styles.key}>SHIFT</span>
                    <span>Run</span>
                </div>
                <div className={styles.controlsHint}>
                    <span className={styles.key}>E</span>
                    <span>Interact</span>
                </div>
                <div className={styles.controlsHint}>
                    <span className={styles.keyHighlight}>B</span>
                    <span>Return to Ship</span>
                </div>
            </div>
        </div>
    );
};

/**
 * PlanetSurface Component
 *
 * Main component for on-planet exploration:
 * - Renders themed 3D environment
 * - Handles character movement
 * - Displays content stations
 * - Manages return to ship
 */
const PlanetSurface = () => {
    const { landedPlanet, returnToShip, controlMode } = useGameMode();
    const { currentSystem } = useStarSystem();
    const { onNavigate } = useNavigation();

    const walkingControls = useWalkingControls(controlMode === 'walking');

    // Handle return to ship
    useEffect(() => {
        if (walkingControls.returnToShipPressed && controlMode === 'walking') {
            returnToShip();
        }
    }, [walkingControls.returnToShipPressed, controlMode, returnToShip]);

    // Handle station interaction
    const handleStationInteract = (station) => {
        if (walkingControls.interactPressed && landedPlanet) {
            // Navigate to the content page
            const pageSlug = currentSystem?.page.toLowerCase().replace(/\s+/g, '-');
            if (pageSlug) {
                onNavigate(pageSlug, landedPlanet.sectionId);
            }
        }
    };

    // Check for interaction presses
    useEffect(() => {
        if (walkingControls.interactPressed && landedPlanet && currentSystem) {
            const pageSlug = currentSystem.page.toLowerCase().replace(/\s+/g, '-');
            onNavigate(pageSlug, landedPlanet.sectionId);
        }
    }, [walkingControls.interactPressed, landedPlanet, currentSystem, onNavigate]);

    if (controlMode !== 'walking' || !landedPlanet) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Canvas
                shadows
                camera={{
                    position: [0, 4, 8],
                    fov: 70,
                    near: 0.1,
                    far: 500,
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
            >
                <Suspense fallback={null}>
                    <SurfaceScene
                        systemId={currentSystem?.id}
                        planet={landedPlanet}
                        onStationInteract={handleStationInteract}
                        walkingControls={walkingControls}
                    />
                </Suspense>
            </Canvas>

            <SurfaceHUD
                planet={landedPlanet}
                systemName={currentSystem?.name}
                onReturnToShip={returnToShip}
            />
        </div>
    );
};

export default PlanetSurface;
