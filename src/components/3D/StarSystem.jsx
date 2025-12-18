import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * StarSystem Component
 *
 * The destination after exiting the wormhole
 * Features:
 * - Dense starfield background
 * - Multiple planets orbiting a central star
 * - Nebula effects
 * - Ambient space atmosphere
 *
 * This is the portfolio exploration area where users can navigate
 * to different sections (planets = portfolio sections)
 *
 * Props:
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

    useFrame((state) => {
        // Pause system rotation when animations are paused
        if (groupRef.current && !animationsPaused) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
        }

        // Keep sun pulsing even when paused
        if (centralStarRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
            centralStarRef.current.intensity = 3 * pulse;
        }
    });

    if (!visible) return null;

    return (
        <group ref={groupRef}>
            {/* Central star (sun) */}
            <Sun position={[0, 0, -10]} />

            {/* Star light source */}
            <pointLight
                ref={centralStarRef}
                position={[0, 0, -10]}
                color="#ffaa00"
                intensity={3}
                distance={100}
                decay={1}
            />

            {/* Orbit Lines */}
            {planets.map((planet) => (
                <OrbitLine
                    key={`orbit-${planet.id}`}
                    radius={planet.orbitRadius}
                    color={planet.orbitColor}
                    sunPosition={[0, 0, -10]}
                    yOffset={planet.yOffset}
                />
            ))}

            {/* Asteroid Belt */}
            <AsteroidBelt
                innerRadius={58}
                outerRadius={67}
                sunPosition={[0, 0, -10]}
            />

            {/* Planets */}
            {planets.map((planet, index) => (
                <Planet
                    key={planet.id}
                    {...planet}
                    index={index}
                    sunPosition={[0, 0, -10]}
                    animationsPaused={animationsPaused}
                />
            ))}

            {/* Oort Cloud - Outer shell of icy particles */}
            <OortCloud
                innerRadius={150}
                outerRadius={200}
                sunPosition={[0, 0, -10]}
            />

            {/* Ambient lighting */}
            <ambientLight intensity={0.8} />
            <hemisphereLight
                intensity={0.8}
                color="#ffffff"
                groundColor="#000033"
            />
        </group>
    );
};

/**
 * Generate asteroid data outside component
 */
const generateAsteroidData = (count, innerRadius, outerRadius) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius =
            innerRadius + Math.random() * (outerRadius - innerRadius);
        const yVariation = (Math.random() - 0.5) * 2;
        const size = 0.1 + Math.random() * 0.3;
        const rotationSpeed = (Math.random() - 0.5) * 0.02;
        const orbitSpeed = 0.05 + Math.random() * 0.05;

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
 */
const AsteroidBelt = ({ innerRadius, outerRadius, sunPosition }) => {
    const asteroidCount = 2000;
    const instancedMeshRef = useRef();

    const asteroidData = useMemo(
        () => generateAsteroidData(asteroidCount, innerRadius, outerRadius),
        [innerRadius, outerRadius]
    );

    useFrame((state) => {
        if (instancedMeshRef.current) {
            const dummy = new THREE.Object3D();

            asteroidData.forEach((asteroid, i) => {
                const currentAngle =
                    asteroid.angle +
                    state.clock.elapsedTime * asteroid.orbitSpeed;
                const x =
                    sunPosition[0] + Math.cos(currentAngle) * asteroid.radius;
                const z =
                    sunPosition[2] + Math.sin(currentAngle) * asteroid.radius;
                const y = sunPosition[1] + asteroid.yVariation;

                dummy.position.set(x, y, z);

                dummy.rotation.set(
                    asteroid.initialRotation[0] +
                        state.clock.elapsedTime * asteroid.rotationSpeed,
                    asteroid.initialRotation[1] +
                        state.clock.elapsedTime * asteroid.rotationSpeed * 0.7,
                    asteroid.initialRotation[2] +
                        state.clock.elapsedTime * asteroid.rotationSpeed * 0.5
                );

                dummy.scale.set(asteroid.size, asteroid.size, asteroid.size);

                dummy.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
            });

            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh
            ref={instancedMeshRef}
            args={[null, null, asteroidCount]}
        >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#8b8680"
                roughness={0.9}
                metalness={0.1}
            />
        </instancedMesh>
    );
};

/**
 * Generate Oort Cloud particle data
 */
const generateOortCloudData = (count, innerRadius, outerRadius) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius =
            innerRadius + Math.random() * (outerRadius - innerRadius);

        const x = radius * Math.sin(phi) * Math.cos(angle);
        const y = radius * Math.sin(phi) * Math.sin(angle);
        const z = radius * Math.cos(phi);

        const size = 0.05 + Math.random() * 0.15;
        const rotationSpeed = (Math.random() - 0.5) * 0.005;
        const orbitSpeed = 0.001 + Math.random() * 0.002;

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
 */
const OortCloud = ({ innerRadius, outerRadius, sunPosition }) => {
    const particleCount = 3000;
    const instancedMeshRef = useRef();

    const cloudData = useMemo(
        () => generateOortCloudData(particleCount, innerRadius, outerRadius),
        [innerRadius, outerRadius]
    );

    useFrame((state) => {
        if (instancedMeshRef.current) {
            const dummy = new THREE.Object3D();

            cloudData.forEach((particle, i) => {
                const currentAngle =
                    particle.angle +
                    state.clock.elapsedTime * particle.orbitSpeed;
                const currentPhi =
                    particle.phi +
                    state.clock.elapsedTime * particle.orbitSpeed * 0.5;

                const x =
                    sunPosition[0] +
                    particle.radius *
                        Math.sin(currentPhi) *
                        Math.cos(currentAngle);
                const y =
                    sunPosition[1] +
                    particle.radius *
                        Math.sin(currentPhi) *
                        Math.sin(currentAngle);
                const z =
                    sunPosition[2] + particle.radius * Math.cos(currentPhi);

                dummy.position.set(x, y, z);

                dummy.rotation.set(
                    particle.initialRotation[0] +
                        state.clock.elapsedTime * particle.rotationSpeed,
                    particle.initialRotation[1] +
                        state.clock.elapsedTime * particle.rotationSpeed * 0.7,
                    particle.initialRotation[2] +
                        state.clock.elapsedTime * particle.rotationSpeed * 0.5
                );

                dummy.scale.set(particle.size, particle.size, particle.size);

                dummy.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
            });

            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh
            ref={instancedMeshRef}
            args={[null, null, particleCount]}
        >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#d4f1f9"
                roughness={0.8}
                metalness={0.2}
                emissive="#89cff0"
                emissiveIntensity={0.2}
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
            sunRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <primitive
            ref={sunRef}
            object={scene.clone()}
            position={position}
            scale={4.0}
        />
    );
};

/**
 * OrbitLine Component
 */
const OrbitLine = ({ radius, color, sunPosition, yOffset = 0 }) => {
    const orbitRef = useRef();

    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
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
                    array={
                        new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))
                    }
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color={color}
                transparent
                opacity={0.3}
                linewidth={1}
            />
        </line>
    );
};

/**
 * Planet Component - Clean version
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

    // Calculate initial angle based on index for staggered starting positions
    const initialAngle = useMemo(() => index * (Math.PI / 2), [index]);

    useFrame((state) => {
        if (planetRef.current) {
            // Only animate if not paused
            if (!animationsPaused) {
                // Planet rotation on its axis
                planetRef.current.rotation.y = state.clock.elapsedTime * 0.15;

                // Orbital motion around the sun
                const angle =
                    state.clock.elapsedTime * orbitSpeed + initialAngle;
                const x = sunPosition[0] + Math.cos(angle) * orbitRadius;
                const z = sunPosition[2] + Math.sin(angle) * orbitRadius;
                const y = sunPosition[1] + yOffset;

                planetRef.current.position.set(x, y, z);
            }
        }
    });

    return <primitive ref={planetRef} object={scene.clone()} scale={scale} />;
};

// Preload all planet models
useGLTF.preload("/models/Sun.glb");
useGLTF.preload("/models/Pluto.glb");
useGLTF.preload("/models/Earth.glb");
useGLTF.preload("/models/Planet1.glb");
useGLTF.preload("/models/Planet2.glb");
useGLTF.preload("/models/Saturn.glb");

export default StarSystem;
