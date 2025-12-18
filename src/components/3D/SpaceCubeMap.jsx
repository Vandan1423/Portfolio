import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Cube map texture paths (order: +X, -X, +Y, -Y, +Z, -Z)
const CUBE_MAP_IMAGES = [
    'Star1.png', // Positive X (right)
    'Star2.png', // Negative X (left)
    'Star3.png', // Positive Y (top)
    'Star4.png', // Negative Y (bottom)
    'Star5.png', // Positive Z (front)
    'Star6.png', // Negative Z (back)
];

const CUBE_MAP_PATH = '/images/';

// Background sphere geometry
const SPHERE_RADIUS = 400;
const SPHERE_WIDTH_SEGMENTS = 60;
const SPHERE_HEIGHT_SEGMENTS = 40;
const SPHERE_SCALE_X = -1; // Invert to show texture on inside

// Rotation speeds (radians per frame)
const BASE_ROTATION_SPEED = 0.0002;
const MAX_RELATIVISTIC_ROTATION = 0.01;
const PITCH_MULTIPLIER = 0.3;
const ROLL_MULTIPLIER = 0.2;

/**
 * SpaceCubeMap Component
 *
 * Creates realistic space background with velocity-based rotation
 * Simulates relativistic effects during spacecraft acceleration
 *
 * @param {number} velocityFactor - Spacecraft speed (0-1), drives rotation speed
 * @param {boolean} enableRelativistic - Enable velocity-based rotation
 */
const SpaceCubeMap = ({
    velocityFactor = 0,
    enableRelativistic = true
}) => {
    const { scene } = useThree();
    const [cubeTexture, setCubeTexture] = useState(null);
    const meshRef = useRef(null);
    const rotationRef = useRef({ x: 0, y: 0, z: 0 });

    // Load cube map texture
    useEffect(() => {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath(CUBE_MAP_PATH);

        const texture = loader.load(
            CUBE_MAP_IMAGES,
            (loadedTexture) => {
                console.log('✨ Space cube map loaded successfully!');
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                setCubeTexture(loadedTexture);
            },
            undefined,
            (error) => {
                console.error('❌ Error loading cube map:', error);
            }
        );

        return () => {
            if (texture) {
                texture.dispose();
                console.log('🧹 Cube map cleaned up');
            }
        };
    }, [scene]);

    // Animate background rotation based on velocity (relativistic effect)
    useFrame(() => {
        if (!meshRef.current || !enableRelativistic) return;

        // Calculate rotation speed based on velocity (time dilation effect)
        const relativisticRotation = velocityFactor * MAX_RELATIVISTIC_ROTATION;
        const totalRotation = BASE_ROTATION_SPEED + relativisticRotation;

        // Apply rotation on multiple axes for dynamic effect
        rotationRef.current.y += totalRotation; // Primary rotation (yaw)
        rotationRef.current.x += totalRotation * PITCH_MULTIPLIER;
        rotationRef.current.z += totalRotation * ROLL_MULTIPLIER;

        // Apply to mesh
        meshRef.current.rotation.x = rotationRef.current.x;
        meshRef.current.rotation.y = rotationRef.current.y;
        meshRef.current.rotation.z = rotationRef.current.z;
    });

    if (!cubeTexture) return null;

    return (
        <mesh ref={meshRef} scale={[SPHERE_SCALE_X, 1, 1]}>
            <sphereGeometry args={[SPHERE_RADIUS, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS]} />
            <meshBasicMaterial
                envMap={cubeTexture}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
};

export default SpaceCubeMap;
