import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useWalkingControls Hook
 *
 * Provides continuous key tracking for character walking on planet surface.
 *
 * Controls:
 * - W/Up Arrow: Walk forward
 * - S/Down Arrow: Walk backward
 * - A/Left Arrow: Strafe left
 * - D/Right Arrow: Strafe right
 * - E: Interact with content station
 * - B: Return to ship
 * - Shift: Run
 *
 * @param {boolean} enabled - Whether controls are active
 * @returns {Object} Current control state and interaction triggers
 */
export function useWalkingControls(enabled = true) {
    const keysPressed = useRef(new Set());
    const [controls, setControls] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false,
    });

    // Interaction triggers (one-shot events)
    const [interactPressed, setInteractPressed] = useState(false);
    const [returnToShipPressed, setReturnToShipPressed] = useState(false);

    const updateControls = useCallback(() => {
        const keys = keysPressed.current;
        setControls({
            forward: keys.has('w') || keys.has('arrowup'),
            backward: keys.has('s') || keys.has('arrowdown'),
            left: keys.has('a') || keys.has('arrowleft'),
            right: keys.has('d') || keys.has('arrowright'),
            run: keys.has('shift'),
        });
    }, []);

    // Reset interaction triggers after they've been read
    useEffect(() => {
        if (interactPressed) {
            const timer = setTimeout(() => setInteractPressed(false), 100);
            return () => clearTimeout(timer);
        }
    }, [interactPressed]);

    useEffect(() => {
        if (returnToShipPressed) {
            const timer = setTimeout(() => setReturnToShipPressed(false), 100);
            return () => clearTimeout(timer);
        }
    }, [returnToShipPressed]);

    useEffect(() => {
        if (!enabled) {
            keysPressed.current.clear();
            setControls({
                forward: false,
                backward: false,
                left: false,
                right: false,
                run: false,
            });
            return;
        }

        const handleKeyDown = (event) => {
            // Ignore if user is typing in an input field
            if (
                event.target.tagName === 'INPUT' ||
                event.target.tagName === 'TEXTAREA'
            ) {
                return;
            }

            const key = event.key.toLowerCase();

            // Prevent default for game controls
            if (['w', 'a', 's', 'd', 'e', 'b', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                event.preventDefault();
            }

            // One-shot interactions
            if (key === 'e' && !keysPressed.current.has('e')) {
                setInteractPressed(true);
            }
            if (key === 'b' && !keysPressed.current.has('b')) {
                setReturnToShipPressed(true);
            }

            if (!keysPressed.current.has(key)) {
                keysPressed.current.add(key);
                updateControls();
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            if (keysPressed.current.has(key)) {
                keysPressed.current.delete(key);
                updateControls();
            }
        };

        const handleBlur = () => {
            keysPressed.current.clear();
            updateControls();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [enabled, updateControls]);

    return {
        ...controls,
        interactPressed,
        returnToShipPressed,
    };
}

export default useWalkingControls;
