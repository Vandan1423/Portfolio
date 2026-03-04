import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameMode } from '../../context/GameModeContext';

/**
 * Character configuration
 */
const CHARACTER_CONFIG = {
    // Capsule dimensions
    radius: 0.4,
    height: 1.2,

    // Movement
    walkSpeed: 5,
    runSpeed: 10,
    turnSpeed: 8,

    // Animation
    bobAmplitude: 0.05,
    bobSpeed: 8,
    glowColor: '#00ffff',
    glowIntensity: 1.5,
};

/**
 * WalkingCharacter Component
 *
 * Simple glowing astronaut capsule for planet surface exploration:
 * - Capsule geometry with emissive glow
 * - Floating bob animation
 * - Smooth movement and rotation
 * - Cast shadow on ground
 */
const WalkingCharacter = ({ controls }) => {
    const {
        characterPosition,
        setCharacterPosition,
        characterRotation,
        setCharacterRotation,
        landedPlanet,
    } = useGameMode();

    const groupRef = useRef();
    const meshRef = useRef();
    const velocityRef = useRef(new Vector3());
    const bobPhaseRef = useRef(0);

    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) return;

        const { forward, backward, left, right, run } = controls;
        const speed = run ? CHARACTER_CONFIG.runSpeed : CHARACTER_CONFIG.walkSpeed;

        // Movement direction
        let moveX = 0;
        let moveZ = 0;

        if (forward) moveZ -= 1;
        if (backward) moveZ += 1;
        if (left) moveX -= 1;
        if (right) moveX += 1;

        // Normalize diagonal movement
        const moveLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (moveLength > 0) {
            moveX /= moveLength;
            moveZ /= moveLength;

            // Apply movement based on character rotation
            const cos = Math.cos(characterRotation);
            const sin = Math.sin(characterRotation);
            const worldX = moveX * cos - moveZ * sin;
            const worldZ = moveX * sin + moveZ * cos;

            // Update position
            const newPos = characterPosition.clone();
            newPos.x += worldX * speed * delta;
            newPos.z += worldZ * speed * delta;

            // Boundary check (keep character on surface area)
            const maxDistance = 50;
            if (newPos.length() < maxDistance) {
                setCharacterPosition(newPos);
            }

            // Face direction of movement
            const targetRotation = Math.atan2(worldX, -worldZ);
            const rotDiff = targetRotation - characterRotation;
            // Handle wrap-around
            const normalizedDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff));
            setCharacterRotation(characterRotation + normalizedDiff * CHARACTER_CONFIG.turnSpeed * delta);

            // Bob animation when moving
            bobPhaseRef.current += delta * CHARACTER_CONFIG.bobSpeed * (run ? 1.5 : 1);
        }

        // Update group position and rotation
        groupRef.current.position.set(
            characterPosition.x,
            characterPosition.y + Math.sin(bobPhaseRef.current) * CHARACTER_CONFIG.bobAmplitude,
            characterPosition.z
        );
        groupRef.current.rotation.y = characterRotation;

        // Subtle floating animation even when standing still
        const idleBob = Math.sin(state.clock.elapsedTime * 2) * 0.02;
        meshRef.current.position.y = CHARACTER_CONFIG.height / 2 + idleBob;
    });

    // Character color based on landed planet theme
    const characterColor = landedPlanet?.color || CHARACTER_CONFIG.glowColor;

    return (
        <group ref={groupRef}>
            {/* Character capsule */}
            <mesh ref={meshRef} castShadow>
                <capsuleGeometry args={[CHARACTER_CONFIG.radius, CHARACTER_CONFIG.height, 8, 16]} />
                <meshStandardMaterial
                    color={characterColor}
                    emissive={characterColor}
                    emissiveIntensity={CHARACTER_CONFIG.glowIntensity}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>

            {/* Visor/helmet indicator */}
            <mesh position={[0, CHARACTER_CONFIG.height, 0.2]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Character glow light */}
            <pointLight
                color={characterColor}
                intensity={2}
                distance={5}
                position={[0, CHARACTER_CONFIG.height / 2, 0]}
            />

            {/* Ground indicator */}
            <mesh
                position={[0, 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <circleGeometry args={[0.6, 32]} />
                <meshBasicMaterial
                    color={characterColor}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
};

export default WalkingCharacter;
