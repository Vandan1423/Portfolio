import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useSpaceshipControls Hook
 *
 * Provides continuous key tracking for spaceship piloting.
 * Unlike toggle-based shortcuts, this tracks held keys in real-time
 * for smooth movement controls.
 *
 * Controls:
 * - W/Up Arrow: Thrust forward
 * - S/Down Arrow: Thrust backward
 * - A/Left Arrow: Strafe/turn left
 * - D/Right Arrow: Strafe/turn right
 * - Shift: Boost (2x speed)
 * - Space: Brake
 * - Q: Roll left
 * - E: Roll right
 *
 * @param {boolean} enabled - Whether controls are active
 * @returns {Object} Current control state
 */
export function useSpaceshipControls(enabled = true) {
    const keysPressed = useRef(new Set());
    const [controls, setControls] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        rollLeft: false,
        rollRight: false,
        boost: false,
        brake: false,
    });

    const updateControls = useCallback(() => {
        const keys = keysPressed.current;
        setControls({
            forward: keys.has('w') || keys.has('arrowup'),
            backward: keys.has('s') || keys.has('arrowdown'),
            left: keys.has('a') || keys.has('arrowleft'),
            right: keys.has('d') || keys.has('arrowright'),
            up: keys.has('r'),
            down: keys.has('f'),
            rollLeft: keys.has('q'),
            rollRight: keys.has('e'),
            boost: keys.has('shift'),
            brake: keys.has(' '),
        });
    }, []);

    useEffect(() => {
        if (!enabled) {
            // Clear all controls when disabled
            keysPressed.current.clear();
            setControls({
                forward: false,
                backward: false,
                left: false,
                right: false,
                up: false,
                down: false,
                rollLeft: false,
                rollRight: false,
                boost: false,
                brake: false,
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

            // Prevent default for game controls to avoid scrolling etc.
            if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'q', 'e', 'r', 'f'].includes(key)) {
                event.preventDefault();
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

        // Handle losing focus (release all keys)
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

    return controls;
}

export default useSpaceshipControls;
