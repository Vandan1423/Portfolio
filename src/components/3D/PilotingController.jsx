import { Suspense, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGameMode } from '../../context/GameModeContext';
import useSpaceshipControls from '../../hooks/useSpaceshipControls';
import useSpaceshipPhysics from '../../hooks/useSpaceshipPhysics';
import useCollisionDetection from '../../hooks/useCollisionDetection';
import PilotableSpaceship from './PilotableSpaceship';
import ChaseCamera from './ChaseCamera';
import LandingSequence from './LandingSequence';

/**
 * PilotingController Component
 *
 * Manages all piloting-related 3D elements:
 * - Pointer lock for immersive mouse control
 * - Spaceship controls and physics
 * - Collision detection
 * - Chase camera
 * - Landing sequence
 *
 * This component must be rendered inside a Canvas.
 */
const PilotingController = ({ planets }) => {
    const { controlMode, enterOrbitMode, landingPhase } = useGameMode();
    const { gl } = useThree();
    const pointerLockRequestedRef = useRef(false);

    // Only active during piloting mode
    const isPiloting = controlMode === 'piloting';
    const isLanding = controlMode === 'landing';

    // Spaceship controls (Mouse + WASD + modifiers)
    const controls = useSpaceshipControls(isPiloting);

    // Physics simulation
    useSpaceshipPhysics(controls, isPiloting);

    // Collision detection with planets
    useCollisionDetection(planets, isPiloting);

    // ===== POINTER LOCK LIFECYCLE =====
    useEffect(() => {
        if (!isPiloting) {
            // Release pointer lock when exiting piloting
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            pointerLockRequestedRef.current = false;
            return;
        }

        const canvas = gl.domElement;

        // Request pointer lock when entering piloting mode
        const requestLock = () => {
            if (!document.pointerLockElement && !pointerLockRequestedRef.current) {
                pointerLockRequestedRef.current = true;
                canvas.requestPointerLock().catch(() => {
                    // Pointer lock request failed (e.g. user gesture required)
                    // Try again on next click
                    pointerLockRequestedRef.current = false;
                });
            }
        };

        // Attempt immediately (works if triggered by user gesture like pressing 'P')
        requestLock();

        // Fallback: request on click if initial request failed
        const handleClick = () => {
            if (isPiloting && !document.pointerLockElement) {
                requestLock();
            }
        };

        // Handle pointer lock change (e.g. user presses Escape)
        const handlePointerLockChange = () => {
            if (!document.pointerLockElement && isPiloting) {
                // Pointer lock was released while in piloting mode
                // Exit to orbit mode gracefully
                pointerLockRequestedRef.current = false;
                enterOrbitMode();
            }
        };

        canvas.addEventListener('click', handleClick);
        document.addEventListener('pointerlockchange', handlePointerLockChange);

        return () => {
            canvas.removeEventListener('click', handleClick);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            // Release pointer lock on cleanup
            if (document.pointerLockElement === canvas) {
                document.exitPointerLock();
            }
        };
    }, [isPiloting, gl, enterOrbitMode]);

    return (
        <>
            {/* Pilotable spaceship (visible during piloting) */}
            {isPiloting && (
                <Suspense fallback={null}>
                    <PilotableSpaceship />
                </Suspense>
            )}

            {/* Chase camera (controls main camera during piloting) */}
            {isPiloting && (
                <Suspense fallback={null}>
                    <ChaseCamera />
                </Suspense>
            )}

            {/* Landing sequence (visible during landing phase) */}
            {isLanding && (
                <Suspense fallback={null}>
                    <LandingSequence />
                </Suspense>
            )}
        </>
    );
};

export default PilotingController;
