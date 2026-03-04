/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Vector3, Euler } from 'three';

const GameModeContext = createContext(undefined);

/**
 * Game Mode Provider
 *
 * Manages the interactive game states for space exploration:
 * - orbit: Traditional OrbitControls view (default)
 * - piloting: WASD spaceship piloting with chase camera
 * - landing: Automated landing sequence
 * - walking: On-planet character exploration
 */
export function GameModeProvider({ children }) {
    // Control mode: 'orbit' | 'piloting' | 'landing' | 'walking'
    const [controlMode, setControlMode] = useState('orbit');

    // Ship state
    const shipPositionRef = useRef(new Vector3(120, 80, 140));
    const shipVelocityRef = useRef(new Vector3(0, 0, 0));
    const shipRotationRef = useRef(new Euler(0, Math.PI, 0)); // Facing toward origin
    const [shipPosition, setShipPosition] = useState(() => new Vector3(120, 80, 140));
    const [shipVelocity, setShipVelocity] = useState(() => new Vector3(0, 0, 0));
    const [shipRotation, setShipRotation] = useState(() => new Euler(0, Math.PI, 0));

    // Character state (for walking mode)
    const [characterPosition, setCharacterPosition] = useState(() => new Vector3(0, 0, 0));
    const [characterRotation, setCharacterRotation] = useState(0);

    // Landing state
    const [nearestPlanet, setNearestPlanet] = useState(null);
    const [landedPlanet, setLandedPlanet] = useState(null);
    const [canLand, setCanLand] = useState(false);
    const [landingPhase, setLandingPhase] = useState(null); // 'approaching' | 'descending' | 'touched_down'

    // Thrust state for visual effects
    const [thrustLevel, setThrustLevel] = useState(0);
    const [isBoosting, setIsBoosting] = useState(false);

    // Shared world-position map: planets write here, collision detection reads
    const planetWorldPositionsRef = useRef(new Map());

    // Switch to piloting mode
    const enterPilotingMode = useCallback(() => {
        if (controlMode === 'orbit') {
            setControlMode('piloting');
        }
    }, [controlMode]);

    // Switch to orbit mode
    const enterOrbitMode = useCallback(() => {
        if (controlMode === 'piloting') {
            setControlMode('orbit');
            // Reset ship velocity when switching to orbit
            shipVelocityRef.current.set(0, 0, 0);
            setShipVelocity(new Vector3(0, 0, 0));
            setThrustLevel(0);
            setIsBoosting(false);
        }
    }, [controlMode]);

    // Initiate landing on a planet
    const initiateLanding = useCallback((planet) => {
        if (controlMode === 'piloting' && canLand && planet) {
            setControlMode('landing');
            setLandingPhase('approaching');
            setLandedPlanet(planet);
        }
    }, [controlMode, canLand]);

    // Complete landing and switch to walking mode
    const completeLanding = useCallback(() => {
        setControlMode('walking');
        setLandingPhase('touched_down');
        // Set character to starting position on planet surface
        setCharacterPosition(new Vector3(0, 0, 5));
        setCharacterRotation(0);
    }, []);

    // Return to ship from walking mode
    const returnToShip = useCallback(() => {
        if (controlMode === 'walking' && landedPlanet) {
            // Trigger takeoff sequence
            setControlMode('landing');
            setLandingPhase('taking_off');
        }
    }, [controlMode, landedPlanet]);

    // Complete takeoff and return to piloting
    const completeTakeoff = useCallback(() => {
        setControlMode('piloting');
        setLandingPhase(null);
        setLandedPlanet(null);
    }, []);

    // Update ship physics (called from useSpaceshipPhysics hook)
    const updateShipState = useCallback((position, velocity, rotation) => {
        shipPositionRef.current.copy(position);
        shipVelocityRef.current.copy(velocity);
        shipRotationRef.current.copy(rotation);
        setShipPosition(position.clone());
        setShipVelocity(velocity.clone());
        setShipRotation(rotation.clone());
    }, []);

    // Update collision detection results
    const updateCollisionState = useCallback((nearest, canLandNow, distance) => {
        setNearestPlanet(nearest);
        setCanLand(canLandNow);
    }, []);

    const value = {
        // Control mode
        controlMode,
        setControlMode,

        // Ship state
        shipPosition,
        shipVelocity,
        shipRotation,
        shipPositionRef,
        shipVelocityRef,
        shipRotationRef,
        updateShipState,

        // Character state
        characterPosition,
        setCharacterPosition,
        characterRotation,
        setCharacterRotation,

        // Landing state
        nearestPlanet,
        landedPlanet,
        canLand,
        landingPhase,
        setLandingPhase,

        // Thrust state
        thrustLevel,
        setThrustLevel,
        isBoosting,
        setIsBoosting,

        // Shared planet positions
        planetWorldPositionsRef,

        // Mode switching functions
        enterPilotingMode,
        enterOrbitMode,
        initiateLanding,
        completeLanding,
        returnToShip,
        completeTakeoff,
        updateCollisionState,
    };

    return (
        <GameModeContext.Provider value={value}>
            {children}
        </GameModeContext.Provider>
    );
}

export function useGameMode() {
    const context = useContext(GameModeContext);
    if (context === undefined) {
        throw new Error('useGameMode must be used within a GameModeProvider');
    }
    return context;
}
