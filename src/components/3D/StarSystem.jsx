import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Sun configuration
const SUN_POSITION = [0, 0, -10];
const SUN_SCALE = 4.0;
const SUN_ROTATION_SPEED = 0.05;
const SUN_COLOR = "#ffaa00";
const SUN_LIGHT_INTENSITY = 3;
const SUN_LIGHT_DISTANCE = 100;
const SUN_LIGHT_DECAY = 1;
const SUN_PULSE_SPEED = 2;
const SUN_PULSE_AMPLITUDE = 0.1;
const SUN_PULSE_BASE = 0.9;

// Asteroid belt configuration - OPTIMIZED for performance
const ASTEROID_INNER_RADIUS = 58;
const ASTEROID_OUTER_RADIUS = 67;
const ASTEROID_COUNT = 500; // Reduced from 2000 to 500 (75% reduction)
const ASTEROID_MIN_SIZE = 0.1;
const ASTEROID_MAX_SIZE_RANGE = 0.3;
const ASTEROID_Y_VARIATION = 2;
const ASTEROID_MIN_ORBIT_SPEED = 0.05;
const ASTEROID_ORBIT_SPEED_RANGE = 0.05;
const ASTEROID_ROTATION_SPEED_RANGE = 0.02;
const ASTEROID_COLOR = "#8b8680";
const ASTEROID_ROUGHNESS = 0.9;
const ASTEROID_METALNESS = 0.1;

// Oort cloud configuration - OPTIMIZED for performance
const OORT_INNER_RADIUS = 150;
const OORT_OUTER_RADIUS = 200;
const OORT_PARTICLE_COUNT = 800; // Reduced from 3000 to 800 (73% reduction)
const OORT_MIN_SIZE = 0.05;
const OORT_MAX_SIZE_RANGE = 0.15;
const OORT_MIN_ORBIT_SPEED = 0.001;
const OORT_ORBIT_SPEED_RANGE = 0.002;
const OORT_ROTATION_SPEED_RANGE = 0.005;
const OORT_COLOR = "#d4f1f9";
const OORT_EMISSIVE = "#89cff0";
const OORT_ROUGHNESS = 0.8;
const OORT_METALNESS = 0.2;
const OORT_EMISSIVE_INTENSITY = 0.2;

// System rotation speed
const SYSTEM_ROTATION_SPEED = 0.01;

// Ambient lighting
const AMBIENT_LIGHT_INTENSITY = 0.8;
const HEMISPHERE_LIGHT_INTENSITY = 0.8;
const HEMISPHERE_LIGHT_COLOR = "#ffffff";
const HEMISPHERE_GROUND_COLOR = "#000033";

// Orbit line configuration
const ORBIT_LINE_SEGMENTS = 128;
const ORBIT_LINE_OPACITY = 0.3;
const ORBIT_LINE_WIDTH = 1;

// Planet rotation speed
const PLANET_ROTATION_SPEED = 0.15;

// Rotation multipliers for varied motion
const ROTATION_Y_MULTIPLIER = 0.7;
const ROTATION_Z_MULTIPLIER = 0.5;

/**
 * StarSystem Component
 *
 * Portfolio exploration area featuring orbiting planets
 * Each planet represents a different portfolio section
 *
 * @param {boolean} visible - Whether the star system is visible
 * @param {array} planets - Array of planet objects
 * @param {boolean} animationsPaused - Whether orbital animations should be paused
 */
const StarSystem = ({
    visible = true,
    planets = [],
    animationsPaused = false,
}) => {
    const groupRef = useRef();
    const centralStarRef = useRef();

    // Models are preloaded during initial loading screen via useAssetPreloader
    // No need for lazy loading here - models are ready when component mounts

    useFrame((state) => {
        // Pause system rotation when animations are paused
        if (groupRef.current && !animationsPaused) {
            groupRef.current.rotation.y = state.clock.elapsedTime * SYSTEM_ROTATION_SPEED;
        }

        // Keep sun pulsing even when paused
        if (centralStarRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * SUN_PULSE_SPEED) * SUN_PULSE_AMPLITUDE + SUN_PULSE_BASE;
            centralStarRef.current.intensity = SUN_LIGHT_INTENSITY * pulse;
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef}>
            <Sun position={SUN_POSITION} />

            <pointLight
                ref={centralStarRef}
                position={SUN_POSITION}
                color={SUN_COLOR}
                intensity={SUN_LIGHT_INTENSITY}
                distance={SUN_LIGHT_DISTANCE}
                decay={SUN_LIGHT_DECAY}
            />

            {/* Orbit lines */}
            {planets.map((planet) => (
                <OrbitLine
                    key={`orbit-${planet.id}`}
                    radius={planet.orbitRadius}
                    color={planet.orbitColor}
                    sunPosition={SUN_POSITION}
                    yOffset={planet.yOffset}
                />
            ))}

            <AsteroidBelt
                innerRadius={ASTEROID_INNER_RADIUS}
                outerRadius={ASTEROID_OUTER_RADIUS}
                sunPosition={SUN_POSITION}
            />

            {/* Planets */}
            {planets.map((planet, index) => (
                <Planet
                    key={planet.id}
                    {...planet}
                    index={index}
                    sunPosition={SUN_POSITION}
                    animationsPaused={animationsPaused}
                />
            ))}

            <OortCloud
                innerRadius={OORT_INNER_RADIUS}
                outerRadius={OORT_OUTER_RADIUS}
                sunPosition={SUN_POSITION}
            />

            <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
            <hemisphereLight
                intensity={HEMISPHERE_LIGHT_INTENSITY}
                color={HEMISPHERE_LIGHT_COLOR}
                groundColor={HEMISPHERE_GROUND_COLOR}
            />
        </group>
    );
};

/**
 * Generate asteroid data for belt
 */
const generateAsteroidData = (count, innerRadius, outerRadius) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const yVariation = (Math.random() - 0.5) * ASTEROID_Y_VARIATION;
        const size = ASTEROID_MIN_SIZE + Math.random() * ASTEROID_MAX_SIZE_RANGE;
        const rotationSpeed = (Math.random() - 0.5) * ASTEROID_ROTATION_SPEED_RANGE;
        const orbitSpeed = ASTEROID_MIN_ORBIT_SPEED + Math.random() * ASTEROID_ORBIT_SPEED_RANGE;

        data.push({
            angle,
            radius,
            yVariation,
            size,
            rotationSpeed,
            orbitSpeed,
            initialRotation: [
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
            ],
        });
    }
    return data;
};

/**
 * AsteroidBelt Component
 *
 * Renders instanced asteroids orbiting between Mars and Jupiter
 */
const AsteroidBelt = ({ innerRadius, outerRadius, sunPosition }) => {
    const instancedMeshRef = useRef();

    const asteroidData = useMemo(
        () => generateAsteroidData(ASTEROID_COUNT, innerRadius, outerRadius),
        [innerRadius, outerRadius]
    );

    useFrame((state) => {
        if (instancedMeshRef.current) {
            const dummy = new THREE.Object3D();

            asteroidData.forEach((asteroid, i) => {
                const currentAngle = asteroid.angle + state.clock.elapsedTime * asteroid.orbitSpeed;
                const x = sunPosition[0] + Math.cos(currentAngle) * asteroid.radius;
                const z = sunPosition[2] + Math.sin(currentAngle) * asteroid.radius;
                const y = sunPosition[1] + asteroid.yVariation;

                dummy.position.set(x, y, z);

                dummy.rotation.set(
                    asteroid.initialRotation[0] + state.clock.elapsedTime * asteroid.rotationSpeed,
                    asteroid.initialRotation[1] + state.clock.elapsedTime * asteroid.rotationSpeed * ROTATION_Y_MULTIPLIER,
                    asteroid.initialRotation[2] + state.clock.elapsedTime * asteroid.rotationSpeed * ROTATION_Z_MULTIPLIER
                );

                dummy.scale.setScalar(asteroid.size);

                dummy.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
            });

            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, ASTEROID_COUNT]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color={ASTEROID_COLOR}
                roughness={ASTEROID_ROUGHNESS}
                metalness={ASTEROID_METALNESS}
            />
        </instancedMesh>
    );
};

/**
 * Generate Oort Cloud particle data using spherical distribution
 */
const generateOortCloudData = (count, innerRadius, outerRadius) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);

        const x = radius * Math.sin(phi) * Math.cos(angle);
        const y = radius * Math.sin(phi) * Math.sin(angle);
        const z = radius * Math.cos(phi);

        const size = OORT_MIN_SIZE + Math.random() * OORT_MAX_SIZE_RANGE;
        const rotationSpeed = (Math.random() - 0.5) * OORT_ROTATION_SPEED_RANGE;
        const orbitSpeed = OORT_MIN_ORBIT_SPEED + Math.random() * OORT_ORBIT_SPEED_RANGE;

        data.push({
            x,
            y,
            z,
            size,
            rotationSpeed,
            orbitSpeed,
            angle,
            phi,
            radius,
            initialRotation: [
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
            ],
        });
    }
    return data;
};

/**
 * OortCloud Component
 *
 * Renders outer shell of icy particles surrounding the star system
 */
const OortCloud = ({ innerRadius, outerRadius, sunPosition }) => {
    const instancedMeshRef = useRef();

    const cloudData = useMemo(
        () => generateOortCloudData(OORT_PARTICLE_COUNT, innerRadius, outerRadius),
        [innerRadius, outerRadius]
    );

    useFrame((state) => {
        if (instancedMeshRef.current) {
            const dummy = new THREE.Object3D();

            cloudData.forEach((particle, i) => {
                const currentAngle = particle.angle + state.clock.elapsedTime * particle.orbitSpeed;
                const currentPhi = particle.phi + state.clock.elapsedTime * particle.orbitSpeed * 0.5;

                const x = sunPosition[0] + particle.radius * Math.sin(currentPhi) * Math.cos(currentAngle);
                const y = sunPosition[1] + particle.radius * Math.sin(currentPhi) * Math.sin(currentAngle);
                const z = sunPosition[2] + particle.radius * Math.cos(currentPhi);

                dummy.position.set(x, y, z);

                dummy.rotation.set(
                    particle.initialRotation[0] + state.clock.elapsedTime * particle.rotationSpeed,
                    particle.initialRotation[1] + state.clock.elapsedTime * particle.rotationSpeed * ROTATION_Y_MULTIPLIER,
                    particle.initialRotation[2] + state.clock.elapsedTime * particle.rotationSpeed * ROTATION_Z_MULTIPLIER
                );

                dummy.scale.setScalar(particle.size);

                dummy.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
            });

            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, OORT_PARTICLE_COUNT]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color={OORT_COLOR}
                roughness={OORT_ROUGHNESS}
                metalness={OORT_METALNESS}
                emissive={OORT_EMISSIVE}
                emissiveIntensity={OORT_EMISSIVE_INTENSITY}
            />
        </instancedMesh>
    );
};

/**
 * Sun Component
 */
const Sun = ({ position }) => {
    const { scene } = useGLTF("/models/Sun.glb");
    const sunRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            sunRef.current.rotation.y = state.clock.elapsedTime * SUN_ROTATION_SPEED;
        }
    });

    return (
        <primitive
            ref={sunRef}
            object={scene.clone()}
            position={position}
            scale={SUN_SCALE}
        />
    );
};

/**
 * OrbitLine Component
 *
 * Renders circular orbit path for planets
 */
const OrbitLine = ({ radius, color, sunPosition, yOffset = 0 }) => {
    const orbitRef = useRef();

    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= ORBIT_LINE_SEGMENTS; i++) {
            const angle = (i / ORBIT_LINE_SEGMENTS) * Math.PI * 2;
            pts.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    yOffset,
                    Math.sin(angle) * radius
                )
            );
        }
        return pts;
    }, [radius, yOffset]);

    return (
        <line ref={orbitRef} position={sunPosition}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color={color}
                transparent
                opacity={ORBIT_LINE_OPACITY}
                linewidth={ORBIT_LINE_WIDTH}
            />
        </line>
    );
};

/**
 * Planet Component
 *
 * Renders individual planet with rotation and orbital motion
 */
const Planet = ({
    scale,
    modelPath,
    orbitRadius,
    orbitSpeed,
    index,
    sunPosition,
    yOffset = 0,
    animationsPaused = false,
}) => {
    const { scene } = useGLTF(modelPath);
    const planetRef = useRef();

    // Stagger starting positions
    const initialAngle = useMemo(() => index * (Math.PI / 2), [index]);

    useFrame((state) => {
        if (planetRef.current && !animationsPaused) {
            // Planet rotation on its axis
            planetRef.current.rotation.y = state.clock.elapsedTime * PLANET_ROTATION_SPEED;

            // Orbital motion around the sun
            const angle = state.clock.elapsedTime * orbitSpeed + initialAngle;
            const x = sunPosition[0] + Math.cos(angle) * orbitRadius;
            const z = sunPosition[2] + Math.sin(angle) * orbitRadius;
            const y = sunPosition[1] + yOffset;

            planetRef.current.position.set(x, y, z);
        }
    });

    return <primitive ref={planetRef} object={scene.clone()} scale={scale} />;
};

// Removed static preloads - models now load dynamically when component mounts
// This significantly improves initial page load time

export default StarSystem;
