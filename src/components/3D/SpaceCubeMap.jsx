import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Cube map texture paths from Cloudinary (order: +X, -X, +Y, -Y, +Z, -Z)
const CUBE_MAP_IMAGES = [
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048720/Star1_k9qpl9.png', // Positive X (right)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048721/Star2_e224oc.png', // Negative X (left)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048724/Star3_ptf4ey.png', // Positive Y (top)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048725/Star4_nj5osv.png', // Negative Y (bottom)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048715/Star5_rd4aab.png', // Positive Z (front)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048729/Star6_zqxvin.png', // Negative Z (back)
];

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

        console.log('🌌 Loading cube map for cockpit background...');

        const texture = loader.load(
            CUBE_MAP_IMAGES,
            (loadedTexture) => {
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                setCubeTexture(loadedTexture);
                console.log('✅ Cube map loaded and ready');
            },
            (progress) => {
                // Progress callback
                console.log(`📦 Cube map loading: ${progress.loaded}/${progress.total}`);
            },
            (error) => {
                console.error('❌ Error loading cube map:', error);
            }
        );

        return () => {
            if (texture) {
                texture.dispose();
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
