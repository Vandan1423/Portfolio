import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SpacecraftModel from "./SpacecraftModel";

/**
 * DockingSpacecraft Component
 *
 * Displays a small spacecraft that can dock with the planet
 * - Idle: Positioned at top-left corner (visible position)
 * - Docking: Approaches planet surface, aligns, and docks, then triggers navigation
 *
 * Animation Phases:
 * 1. Initial (0-20%): Calculate docking point and start approach
 * 2. Approach (20-60%): Follow Bezier curve toward planet surface
 * 3. Alignment (60-80%): Rotate to face docking point (nose-down)
 * 4. Final Dock (80-100%): Decelerate and touch planet surface
 *
 * Props:
 * @param {boolean} isDocking - Whether spacecraft is currently docking
 * @param {number} planetScale - Scale of the planet for docking calculations
 * @param {THREE.Vector3} planetPosition - Center position of the planet
 * @param {function} onDockComplete - Callback when docking sequence completes
 */
const DockingSpacecraft = ({ isDocking, planetScale, planetPosition = new THREE.Vector3(0, 0, 0), onDockComplete }) => {
    const spacecraftRef = useRef();
    const animationState = useRef({
        elapsedTime: 0,
        startPosition: null,
        dockingPoint: null,
        controlPoint1: null, // For Bezier curve
        controlPoint2: null, // For Bezier curve
    });

    // Docking configuration
    const dockDuration = 7; // 7 seconds total
    const planetRadius = planetScale;

    // Reset when docking starts/stops
    useEffect(() => {
        if (isDocking) {
            animationState.current.elapsedTime = 0;

            // Calculate docking point on planet surface
            const dockingPoint = getDockingPoint(planetPosition, planetRadius);
            animationState.current.dockingPoint = dockingPoint;

            // Store starting position
            if (spacecraftRef.current) {
                animationState.current.startPosition = spacecraftRef.current.position.clone();

                // Calculate Bezier curve control points for natural arc approach
                const startPos = animationState.current.startPosition;
                const midPoint = new THREE.Vector3().lerpVectors(startPos, dockingPoint, 0.5);

                // Control point 1: Elevated arc (for smooth entry)
                animationState.current.controlPoint1 = new THREE.Vector3(
                    midPoint.x,
                    midPoint.y + planetScale * 1.5, // Arc upward
                    midPoint.z
                );

                // Control point 2: Near planet (for final approach)
                animationState.current.controlPoint2 = new THREE.Vector3().lerpVectors(
                    midPoint,
                    dockingPoint,
                    0.75
                );
            }

            console.log("🚀 Starting docking sequence...");
        } else {
            // Reset to idle position
            if (spacecraftRef.current && !isDocking) {
                const idlePos = getIdlePosition();
                spacecraftRef.current.position.copy(idlePos);
                spacecraftRef.current.rotation.set(0, Math.PI / 4, 0);
            }
        }
    }, [isDocking, planetPosition, planetRadius]);

    // Get idle position (top-left corner, visible)
    const getIdlePosition = () => {
        return new THREE.Vector3(
            -planetScale * 3.5, // Left
            planetScale * 2.5, // Top
            planetScale * 1.5 // Forward (visible)
        );
    };

    // Calculate docking point on planet surface using spherical coordinates
    const getDockingPoint = (center, radius) => {
        // Fixed docking angle (top-front quadrant for visibility)
        const theta = Math.PI / 4; // 45° horizontal angle
        const phi = Math.PI / 6;   // 30° vertical angle from top

        return new THREE.Vector3(
            center.x + radius * Math.sin(phi) * Math.cos(theta),
            center.y + radius * Math.cos(phi),
            center.z + radius * Math.sin(phi) * Math.sin(theta)
        );
    };

    // Calculate position along Bezier curve
    const getBezierPosition = (t) => {
        const { startPosition, controlPoint1, controlPoint2, dockingPoint } = animationState.current;

        if (!startPosition || !dockingPoint) {
            return getIdlePosition();
        }

        // Cubic Bezier formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
        const t1 = 1 - t;
        const t1_2 = t1 * t1;
        const t1_3 = t1_2 * t1;
        const t_2 = t * t;
        const t_3 = t_2 * t;

        const pos = new THREE.Vector3();
        pos.addScaledVector(startPosition, t1_3);
        pos.addScaledVector(controlPoint1, 3 * t1_2 * t);
        pos.addScaledVector(controlPoint2, 3 * t1 * t_2);
        pos.addScaledVector(dockingPoint, t_3);

        return pos;
    };

    // Easing function for deceleration (cubic-bezier)
    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    // Animation loop
    useFrame((state, delta) => {
        if (!spacecraftRef.current) return;

        if (isDocking) {
            animationState.current.elapsedTime += delta;
            const rawProgress = Math.min(
                animationState.current.elapsedTime / dockDuration,
                1
            );

            // Apply easing to progress for smooth deceleration
            const progress = easeOutCubic(rawProgress);

            // Calculate current position along Bezier curve
            const currentPos = getBezierPosition(progress);
            spacecraftRef.current.position.copy(currentPos);

            // Phase 3 & 4: Alignment (60-100%)
            // Rotate spacecraft to face docking point
            if (progress > 0.6 && animationState.current.dockingPoint) {
                const targetQuaternion = new THREE.Quaternion();
                const tempMatrix = new THREE.Matrix4();

                // Look at docking point with proper orientation
                tempMatrix.lookAt(
                    currentPos,
                    animationState.current.dockingPoint,
                    new THREE.Vector3(0, 1, 0) // Up vector
                );
                targetQuaternion.setFromRotationMatrix(tempMatrix);

                // Smoothly interpolate to target rotation (CRITICAL: 0.1 factor for smooth rotation)
                spacecraftRef.current.quaternion.slerp(targetQuaternion, 0.1);
            }

            // Phase 4: Final dock (80-100%)
            // Add slight scale bounce effect on touchdown
            if (progress > 0.8) {
                const bounceProgress = (progress - 0.8) / 0.2; // Normalize to 0-1
                const scale = planetScale * 0.1;

                // Subtle bounce: 1.0 → 1.05 → 1.0
                const bounceScale = scale * (1 + Math.sin(bounceProgress * Math.PI) * 0.05);
                spacecraftRef.current.scale.set(bounceScale, bounceScale, bounceScale);
            }

            // Check if docking complete
            if (progress >= 1 && onDockComplete) {
                console.log("✅ Docking sequence complete!");
                onDockComplete();
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
            // Reset scale to normal
            const normalScale = planetScale * 0.1;
            spacecraftRef.current.scale.set(normalScale, normalScale, normalScale);
        }
    });

    return (
        <group ref={spacecraftRef}>
            {/* Spacecraft model */}
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

export default DockingSpacecraft;
