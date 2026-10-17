/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Vector3, Euler } from 'three';
import { SUN_POSITION } from '../constants/scene';

const GameModeContext = createContext(undefined);

// Yaw about world up, then pitch about the ship's own right axis, then roll.
// three.js defaults to 'XYZ', which pitches about the world X axis and turns
// pitch into roll once the ship has yawed away from -Z.
const SHIP_EULER_ORDER = 'YXZ';
const SHIP_SPAWN_POSITION = new Vector3(120, 80, 140);

// The rotation that points the ship's nose (local -Z) from one position at another
function rotationFacing(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    return new Euler(Math.atan2(dy, Math.hypot(dx, dz)), Math.atan2(-dx, -dz), 0, SHIP_EULER_ORDER);
}

const SHIP_SPAWN_ROTATION = rotationFacing(SHIP_SPAWN_POSITION, new Vector3(...SUN_POSITION));

/**
 * Game Mode Provider
 *
 * Manages the interactive game states for space exploration:
 * - orbit: Traditional OrbitControls view (default)
 * - piloting: WASD spaceship piloting with chase camera
 */
export function GameModeProvider({ children }) {
    // Control mode: 'orbit' | 'piloting'
    const [controlMode, setControlMode] = useState('orbit');

    // Sun world position, written by StarSystem every frame
    const sunWorldPositionRef = useRef(new Vector3(...SUN_POSITION));

    // Ship state (starts facing the sun)
    const shipPositionRef = useRef(SHIP_SPAWN_POSITION.clone());
    const shipVelocityRef = useRef(new Vector3(0, 0, 0));
    const shipRotationRef = useRef(SHIP_SPAWN_ROTATION.clone());
    const [shipPosition, setShipPosition] = useState(() => SHIP_SPAWN_POSITION.clone());
    const [shipVelocity, setShipVelocity] = useState(() => new Vector3(0, 0, 0));
    const [shipRotation, setShipRotation] = useState(() => SHIP_SPAWN_ROTATION.clone());

    // Landing state: L opens the nearest planet's detail view when in range
    const [nearestPlanet, setNearestPlanet] = useState(null);
    const [canLand, setCanLand] = useState(false);

    // Thrust state for visual effects
    const [thrustLevel, setThrustLevel] = useState(0);
    const [isBoosting, setIsBoosting] = useState(false);

    // Shared world-position map: planets write here, collision detection reads
    const planetWorldPositionsRef = useRef(new Map());

    // Switch to piloting mode, with the ship at rest and facing the sun
    const enterPilotingMode = useCallback(() => {
        if (controlMode === 'orbit') {
            shipRotationRef.current.copy(rotationFacing(shipPositionRef.current, sunWorldPositionRef.current));
            shipVelocityRef.current.set(0, 0, 0);
            setShipRotation(shipRotationRef.current.clone());
            setShipVelocity(new Vector3(0, 0, 0));
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

        // Landing state
        nearestPlanet,
        canLand,

        // Thrust state
        thrustLevel,
        setThrustLevel,
        isBoosting,
        setIsBoosting,

        // Shared planet and sun positions
        planetWorldPositionsRef,
        sunWorldPositionRef,

        // Mode switching functions
        enterPilotingMode,
        enterOrbitMode,
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
