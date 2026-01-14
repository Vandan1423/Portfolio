import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Cube map texture paths - LOCAL (order: +X, -X, +Y, -Y, +Z, -Z)
const CUBE_MAP_IMAGES = [
    '/images/SpaceCubeMap/Star1.jpeg', // Positive X (right)
    '/images/SpaceCubeMap/Star2.jpeg', // Negative X (left)
    '/images/SpaceCubeMap/Star3.jpeg', // Positive Y (top)
    '/images/SpaceCubeMap/Star4.jpeg', // Negative Y (bottom)
    '/images/SpaceCubeMap/Star5.jpeg', // Positive Z (front)
    '/images/SpaceCubeMap/Star6.jpeg', // Negative Z (back)
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

    // Load cube map texture with PARALLEL loading for speed
    useEffect(() => {
        console.log('🌌 Loading cube map textures in parallel...');

        // Load all 6 textures in parallel using Promise.all
        const textureLoader = new THREE.TextureLoader();
        const loadPromises = CUBE_MAP_IMAGES.map((url) =>
            new Promise((resolve, reject) => {
                textureLoader.load(
                    url,
                    (texture) => {
                        texture.colorSpace = THREE.SRGBColorSpace;
                        resolve(texture);
                    },
                    undefined,
                    reject
                );
            })
        );

        Promise.all(loadPromises)
            .then((textures) => {
                // Manually construct CubeTexture from loaded textures
                const cubeTexture = new THREE.CubeTexture(
                    textures.map((t) => t.image)
                );
                cubeTexture.needsUpdate = true;
                cubeTexture.colorSpace = THREE.SRGBColorSpace;
                
                setCubeTexture(cubeTexture);
                console.log('✅ All 6 cube map textures loaded in parallel!');
            })
            .catch((error) => {
                console.error('❌ Error loading cube map textures:', error);
            });

        return () => {
            if (cubeTexture) {
                cubeTexture.dispose();
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
