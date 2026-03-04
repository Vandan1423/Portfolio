import { Suspense } from 'react';
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
 * - Spaceship controls and physics
 * - Collision detection
 * - Chase camera
 * - Landing sequence
 *
 * This component must be rendered inside a Canvas.
 */
const PilotingController = ({ planets }) => {
    const { controlMode, landingPhase } = useGameMode();

    // Only active during piloting mode
    const isPiloting = controlMode === 'piloting';
    const isLanding = controlMode === 'landing';

    // Spaceship controls (WASD + modifiers)
    const controls = useSpaceshipControls(isPiloting);

    // Physics simulation
    useSpaceshipPhysics(controls, isPiloting);

    // Collision detection with planets
    useCollisionDetection(planets, isPiloting);

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
