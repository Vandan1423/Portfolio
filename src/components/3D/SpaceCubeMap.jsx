import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * SpaceCubeMap Component
 *
 * Creates a realistic space background using a cube map texture.
 * The cube map consists of 6 images that wrap around the entire scene
 * creating an immersive 360-degree space environment.
 *
 * Key features:
 * - Uses CubeTextureLoader to load 6 images (px, nx, py, ny, pz, nz)
 * - Renders as massive sphere mesh (not scene.background to avoid React hooks error)
 * - Rotates based on spacecraft velocity for relativistic effects
 * - Supports dynamic rotation speed for launch sequence
 *
 * Relativistic Physics:
 * - Background rotates faster as spacecraft accelerates
 * - Simulates time dilation and space warping effects
 * - Creates immersive sense of speed during wormhole approach
 *
 * @param {number} velocityFactor - Speed of spacecraft (0-1), drives rotation speed
 * @param {boolean} enableRelativistic - Enable velocity-based rotation (default: true)
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
        // Create cube texture loader
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/images/');

        // Load the 6 cube map faces
        // Order: [+X, -X, +Y, -Y, +Z, -Z]
        // Right, Left, Top, Bottom, Front, Back
        const texture = loader.load(
            [
                'Star1.png', // Positive X (right)
                'Star2.png', // Negative X (left)
                'Star3.png', // Positive Y (top)
                'Star4.png', // Negative Y (bottom)
                'Star5.png', // Positive Z (front)
                'Star6.png', // Negative Z (back)
            ],
            // onLoad callback
            (loadedTexture) => {
                console.log('✨ Space cube map loaded successfully!');
                // Set encoding for proper color display
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                // Store in state so it triggers re-render
                setCubeTexture(loadedTexture);
            },
            // onProgress callback
            undefined,
            // onError callback
            (error) => {
                console.error('❌ Error loading cube map:', error);
            }
        );

        // Cleanup on unmount
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

        // Calculate rotation speed based on velocity
        // At max velocity, background spins faster (time dilation effect)
        const baseRotation = 0.0002;
        const relativisticRotation = velocityFactor * 0.01; // Up to 0.01 rad/frame at max speed
        const totalRotation = baseRotation + relativisticRotation;

        // Apply rotation on multiple axes for more dynamic effect
        rotationRef.current.y += totalRotation; // Primary rotation (yaw)
        rotationRef.current.x += totalRotation * 0.3; // Slight pitch
        rotationRef.current.z += totalRotation * 0.2; // Slight roll

        // Apply to mesh
        meshRef.current.rotation.x = rotationRef.current.x;
        meshRef.current.rotation.y = rotationRef.current.y;
        meshRef.current.rotation.z = rotationRef.current.z;
    });

    // Don't render until texture is loaded
    if (!cubeTexture) return null;

    return (
        <>
            {/* Render cube map as giant inverted sphere around the scene */}
            <mesh ref={meshRef} scale={[-1, 1, 1]}>
                {/* Scale x = -1 inverts the sphere so texture shows on inside */}
                <sphereGeometry args={[400, 60, 40]} />
                <meshBasicMaterial
                    envMap={cubeTexture} // Use envMap instead of map for CubeTexture
                    side={THREE.BackSide} // Render inside of sphere
                    depthWrite={false} // Don't write to depth buffer (always renders behind)
                />
            </mesh>
        </>
    );
};

export default SpaceCubeMap;
