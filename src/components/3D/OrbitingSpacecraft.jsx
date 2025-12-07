import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SpacecraftModel from "./SpacecraftModel";

/**
 * OrbitingSpacecraft Component
 *
 * Displays a small spacecraft that can orbit around the planet
 * - Idle: Positioned at top-left corner (visible position)
 * - Orbiting: Circles planet 2 times, then triggers navigation
 *
 * Props:
 * @param {boolean} isOrbiting - Whether spacecraft is currently orbiting
 * @param {number} planetScale - Scale of the planet for orbit calculations
 * @param {function} onOrbitComplete - Callback when 2 orbits complete
 */
const OrbitingSpacecraft = ({ isOrbiting, planetScale, onOrbitComplete }) => {
    const spacecraftRef = useRef();
    const [orbitProgress, setOrbitProgress] = useState(0);
    const animationState = useRef({
        elapsedTime: 0,
        orbitCount: 0,
    });

    // Orbit configuration
    const orbitRadius = planetScale * 1.5; // Smaller orbit (closer to planet)
    const orbitHeight = 0; // Same height as planet center
    const orbitDuration = 6; // 6 seconds per orbit
    const totalOrbits = 2;
    const orbitTilt = Math.PI / 5; // 30-degree tilt (adjust as needed)

    // Reset when orbit starts/stops
    useEffect(() => {
        if (isOrbiting) {
            animationState.current.elapsedTime = 0;
            animationState.current.orbitCount = 0;
            setOrbitProgress(0);
            console.log("🛸 Starting orbit sequence...");
        } else {
            // Reset to idle position
            if (spacecraftRef.current && !isOrbiting) {
                const idlePos = getIdlePosition();
                spacecraftRef.current.position.copy(idlePos);
                spacecraftRef.current.rotation.set(0, Math.PI / 4, 0);
            }
        }
    }, [isOrbiting]);

    // Get idle position (top-left corner, visible)
    const getIdlePosition = () => {
        return new THREE.Vector3(
            -planetScale * 3.5, // Left
            planetScale * 2.5, // Top
            planetScale * 1.5 // Forward (visible)
        );
    };

    // Get orbit position at given progress (0-1 for 2 complete orbits)
    const getOrbitPosition = (progress) => {
        const angle = progress * totalOrbits * Math.PI * 2;
        
        // Base circular orbit (in XZ plane)
        const x = Math.cos(angle) * orbitRadius;
        const y = orbitHeight;
        const z = Math.sin(angle) * orbitRadius;
        
        // Apply tilt rotation around X-axis
        const tiltedY = y * Math.cos(orbitTilt) - z * Math.sin(orbitTilt);
        const tiltedZ = y * Math.sin(orbitTilt) + z * Math.cos(orbitTilt);
        
        return new THREE.Vector3(x, tiltedY, tiltedZ);
    };

    // Get tangent vector (direction of travel) for smooth orientation
    const getOrbitTangent = (progress) => {
        const epsilon = 0.001;
        const p1 = getOrbitPosition(Math.max(0, progress - epsilon));
        const p2 = getOrbitPosition(Math.min(1, progress + epsilon));
        return p2.clone().sub(p1).normalize();
    };

    // Animation loop
    useFrame((state, delta) => {
        if (!spacecraftRef.current) return;

        if (isOrbiting) {
            animationState.current.elapsedTime += delta;
            const totalDuration = orbitDuration * totalOrbits;
            const progress = Math.min(
                animationState.current.elapsedTime / totalDuration,
                1
            );

            setOrbitProgress(progress);

            // Calculate current position
            const currentPos = getOrbitPosition(progress);
            spacecraftRef.current.position.copy(currentPos);

            // Get direction of travel for smooth orientation
            const tangent = getOrbitTangent(progress);
            const lookAtPoint = currentPos.clone().add(tangent);

            // Smooth rotation using quaternion slerp
            const targetQuaternion = new THREE.Quaternion();
            const tempMatrix = new THREE.Matrix4();
            
            // lookAt with correct up vector to prevent upside-down orientation
            tempMatrix.lookAt(
                currentPos,
                lookAtPoint,
                new THREE.Vector3(0, 1, 0) // Up vector
            );
            targetQuaternion.setFromRotationMatrix(tempMatrix);
            
            // Smoothly interpolate to target rotation
            spacecraftRef.current.quaternion.slerp(targetQuaternion, 0.1);

            // Add slight banking effect (tilt toward center)
            const bankAngle =
                Math.sin(progress * totalOrbits * Math.PI * 4) * 0.15;
            spacecraftRef.current.rotation.z += bankAngle * delta * 2;

            // Check if orbits complete
            if (progress >= 1 && onOrbitComplete) {
                console.log("✅ Orbit sequence complete!");
                onOrbitComplete();
            }
        } else {
            // Idle state - gentle floating animation
            const time = state.clock.elapsedTime;
            if (spacecraftRef.current.position.y) {
                const idlePos = getIdlePosition();
                const floatOffset = Math.sin(time * 0.5) * 0.1;
                spacecraftRef.current.position.y = idlePos.y + floatOffset;
                spacecraftRef.current.rotation.y =
                    Math.PI / 4 + Math.sin(time * 0.3) * 0.1;
            }
        }
    });

    return (
        <group ref={spacecraftRef}>
            {/* Spacecraft model - bigger size */}
            <SpacecraftModel scale={planetScale * 0.1} />

            {/* Spacecraft lights */}
            <pointLight
                position={[0, 0.3, 0]}
                intensity={1.5}
                distance={planetScale * 0.4}
                color="#00ffff"
            />
            <pointLight
                position={[0, -0.2, 0]}
                intensity={2}
                distance={planetScale * 0.3}
                color="#ff6600"
            />
        </group>
    );
};

export default OrbitingSpacecraft;
