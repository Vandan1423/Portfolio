import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SpacecraftModel from "./SpacecraftModel";

// Docking animation configuration
const DOCK_DURATION = 7; // seconds
const ALIGNMENT_START_PROGRESS = 0.6;
const BOUNCE_START_PROGRESS = 0.8;
const ROTATION_LERP_SPEED = 0.1;
const BOUNCE_INTENSITY = 0.05;

// Idle position multipliers (relative to planet scale)
const IDLE_POSITION_X = -3.5;
const IDLE_POSITION_Y = 2.5;
const IDLE_POSITION_Z = 1.5;
const IDLE_ROTATION_Y = Math.PI / 4;

// Idle animation settings
const IDLE_FLOAT_SPEED = 0.5;
const IDLE_FLOAT_AMPLITUDE = 0.1;
const IDLE_ROTATION_SPEED = 0.3;
const IDLE_ROTATION_AMPLITUDE = 0.1;

// Docking point spherical coordinates (for visibility)
const DOCKING_THETA = Math.PI / 4; // 45° horizontal
const DOCKING_PHI = Math.PI / 6;   // 30° vertical from top

// Bezier curve configuration
const CONTROL_POINT_1_ELEVATION = 1.5; // Arc height multiplier
const CONTROL_POINT_2_LERP = 0.75;

// Spacecraft scale and lighting
const SPACECRAFT_SCALE_MULTIPLIER = 0.1;
const LIGHT_TOP_DISTANCE = 0.4;
const LIGHT_BOTTOM_DISTANCE = 0.3;

// Spacecraft lights configuration
const SPACECRAFT_LIGHTS = [
    { position: [0, 0.3, 0], intensity: 1.5, distanceMultiplier: LIGHT_TOP_DISTANCE, color: "#00ffff" },
    { position: [0, -0.2, 0], intensity: 2, distanceMultiplier: LIGHT_BOTTOM_DISTANCE, color: "#ff6600" },
];

// Pure helper functions (outside component to avoid recreation on each render)

// Get idle position (top-left corner, visible)
const getIdlePosition = (planetScale) => {
    return new THREE.Vector3(
        planetScale * IDLE_POSITION_X,
        planetScale * IDLE_POSITION_Y,
        planetScale * IDLE_POSITION_Z
    );
};

// Calculate docking point on planet surface using spherical coordinates
const getDockingPoint = (center, radius) => {
    return new THREE.Vector3(
        center.x + radius * Math.sin(DOCKING_PHI) * Math.cos(DOCKING_THETA),
        center.y + radius * Math.cos(DOCKING_PHI),
        center.z + radius * Math.sin(DOCKING_PHI) * Math.sin(DOCKING_THETA)
    );
};

// Easing function for smooth deceleration
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * DockingSpacecraft Component
 *
 * Displays spacecraft with idle floating animation and smooth docking sequence
 *
 * Animation Phases:
 * 1. Initial (0-20%): Calculate docking point and start approach
 * 2. Approach (20-60%): Follow Bezier curve toward planet surface
 * 3. Alignment (60-80%): Rotate to face docking point (nose-down)
 * 4. Final Dock (80-100%): Decelerate and touch planet surface
 *
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
        controlPoint1: null,
        controlPoint2: null,
    });

    // Reusable objects to avoid garbage collection in useFrame (performance optimization)
    const reusableObjects = useRef({
        bezierPosition: new THREE.Vector3(),
        targetQuaternion: new THREE.Quaternion(),
        tempMatrix: new THREE.Matrix4(),
        upVector: new THREE.Vector3(0, 1, 0),
    });

    const planetRadius = planetScale;
    const spacecraftScale = planetScale * SPACECRAFT_SCALE_MULTIPLIER;

    // Reset when docking starts/stops
    useEffect(() => {
        if (isDocking) {
            animationState.current.elapsedTime = 0;
            animationState.current.dockingPoint = getDockingPoint(planetPosition, planetRadius);

            if (spacecraftRef.current) {
                animationState.current.startPosition = spacecraftRef.current.position.clone();

                // Calculate Bezier curve control points for natural arc approach
                const startPos = animationState.current.startPosition;
                const dockPoint = animationState.current.dockingPoint;
                const midPoint = new THREE.Vector3().lerpVectors(startPos, dockPoint, 0.5);

                // Control point 1: Elevated arc (for smooth entry)
                animationState.current.controlPoint1 = new THREE.Vector3(
                    midPoint.x,
                    midPoint.y + planetScale * CONTROL_POINT_1_ELEVATION,
                    midPoint.z
                );

                // Control point 2: Near planet (for final approach)
                animationState.current.controlPoint2 = new THREE.Vector3().lerpVectors(
                    midPoint,
                    dockPoint,
                    CONTROL_POINT_2_LERP
                );
            }

            console.log("🚀 Starting docking sequence...");
        } else {
            // Reset to idle position
            if (spacecraftRef.current) {
                const idlePos = getIdlePosition(planetScale);
                spacecraftRef.current.position.copy(idlePos);
                spacecraftRef.current.rotation.set(0, IDLE_ROTATION_Y, 0);
            }
        }
    }, [isDocking, planetPosition, planetRadius, planetScale]);

    // Calculate position along Bezier curve using reusable vector
    const getBezierPosition = (t) => {
        const { startPosition, controlPoint1, controlPoint2, dockingPoint } = animationState.current;

        if (!startPosition || !dockingPoint) {
            return getIdlePosition(planetScale);
        }

        // Cubic Bezier formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
        const t1 = 1 - t;
        const t1_2 = t1 * t1;
        const t1_3 = t1_2 * t1;
        const t_2 = t * t;
        const t_3 = t_2 * t;

        const pos = reusableObjects.current.bezierPosition;
        pos.set(0, 0, 0);
        pos.addScaledVector(startPosition, t1_3);
        pos.addScaledVector(controlPoint1, 3 * t1_2 * t);
        pos.addScaledVector(controlPoint2, 3 * t1 * t_2);
        pos.addScaledVector(dockingPoint, t_3);

        return pos;
    };

    // Animation loop
    useFrame((state, delta) => {
        if (!spacecraftRef.current) return;

        if (isDocking) {
            animationState.current.elapsedTime += delta;
            const rawProgress = Math.min(animationState.current.elapsedTime / DOCK_DURATION, 1);
            const progress = easeOutCubic(rawProgress);

            // Update position along Bezier curve
            const currentPos = getBezierPosition(progress);
            spacecraftRef.current.position.copy(currentPos);

            // Alignment phase: Rotate spacecraft to face docking point
            if (progress > ALIGNMENT_START_PROGRESS && animationState.current.dockingPoint) {
                const { targetQuaternion, tempMatrix, upVector } = reusableObjects.current;

                tempMatrix.lookAt(currentPos, animationState.current.dockingPoint, upVector);
                targetQuaternion.setFromRotationMatrix(tempMatrix);
                spacecraftRef.current.quaternion.slerp(targetQuaternion, ROTATION_LERP_SPEED);
            }

            // Final dock phase: Add subtle bounce effect
            if (progress > BOUNCE_START_PROGRESS) {
                const bounceProgress = (progress - BOUNCE_START_PROGRESS) / (1 - BOUNCE_START_PROGRESS);
                const bounceScale = spacecraftScale * (1 + Math.sin(bounceProgress * Math.PI) * BOUNCE_INTENSITY);
                spacecraftRef.current.scale.setScalar(bounceScale);
            }

            // Check if docking complete
            if (progress >= 1 && onDockComplete) {
                console.log("✅ Docking sequence complete!");
                onDockComplete();
            }
        } else {
            // Idle state: Gentle floating animation
            const time = state.clock.elapsedTime;
            const idlePos = getIdlePosition(planetScale);
            const floatOffset = Math.sin(time * IDLE_FLOAT_SPEED) * IDLE_FLOAT_AMPLITUDE;

            spacecraftRef.current.position.y = idlePos.y + floatOffset;
            spacecraftRef.current.rotation.y = IDLE_ROTATION_Y + Math.sin(time * IDLE_ROTATION_SPEED) * IDLE_ROTATION_AMPLITUDE;
            spacecraftRef.current.scale.setScalar(spacecraftScale);
        }
    });

    return (
        <group ref={spacecraftRef}>
            <SpacecraftModel scale={spacecraftScale} />

            {/* Spacecraft lighting system */}
            {SPACECRAFT_LIGHTS.map((light, index) => (
                <pointLight
                    key={index}
                    position={light.position}
                    intensity={light.intensity}
                    distance={planetScale * light.distanceMultiplier}
                    color={light.color}
                />
            ))}
        </group>
    );
};

export default DockingSpacecraft;
