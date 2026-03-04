import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Mouse sensitivity configuration
 */
const MOUSE_CONFIG = {
    sensitivity: 0.002, // Radians per pixel of mouse movement
    smoothing: 0.5,     // 0 = no smoothing, 1 = heavy smoothing
};

/**
 * useSpaceshipControls Hook
 *
 * Provides continuous key tracking + mouse look for spaceship piloting.
 * Uses pointer lock for immersive FPS-style camera control.
 *
 * Controls:
 * - Mouse: Yaw (horizontal) and Pitch (vertical)
 * - W/Up Arrow: Thrust forward
 * - S/Down Arrow: Thrust backward
 * - A/Left Arrow: Strafe left
 * - D/Right Arrow: Strafe right
 * - Shift: Boost (2x speed)
 * - Space: Brake
 * - Q: Roll left
 * - E: Roll right
 * - R/F: Pitch up/down (manual override)
 *
 * @param {boolean} enabled - Whether controls are active
 * @returns {Object} Current control state + mouse delta
 */
export function useSpaceshipControls(enabled = true) {
    const keysPressed = useRef(new Set());
    const mouseDeltaRef = useRef({ x: 0, y: 0 });
    const smoothedDeltaRef = useRef({ x: 0, y: 0 });
    const [controls, setControls] = useState({
        forward: false,
        backward: false,
        strafeLeft: false,
        strafeRight: false,
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
            strafeLeft: keys.has('a') || keys.has('arrowleft'),
            strafeRight: keys.has('d') || keys.has('arrowright'),
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
            mouseDeltaRef.current = { x: 0, y: 0 };
            smoothedDeltaRef.current = { x: 0, y: 0 };
            setControls({
                forward: false,
                backward: false,
                strafeLeft: false,
                strafeRight: false,
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

        // Mouse movement handler (works with pointer lock)
        const handleMouseMove = (event) => {
            if (document.pointerLockElement) {
                // Accumulate raw mouse deltas
                mouseDeltaRef.current.x += event.movementX * MOUSE_CONFIG.sensitivity;
                mouseDeltaRef.current.y += event.movementY * MOUSE_CONFIG.sensitivity;
            }
        };

        // Handle losing focus (release all keys)
        const handleBlur = () => {
            keysPressed.current.clear();
            mouseDeltaRef.current = { x: 0, y: 0 };
            updateControls();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('blur', handleBlur);
        };
    }, [enabled, updateControls]);

    /**
     * Consume and reset mouse delta — called once per physics frame.
     * Applies optional smoothing to reduce jitter.
     */
    const consumeMouseDelta = useCallback(() => {
        const raw = mouseDeltaRef.current;
        const smoothed = smoothedDeltaRef.current;
        const s = MOUSE_CONFIG.smoothing;

        // Exponential smoothing: blend previous smoothed value with new raw value
        smoothed.x = smoothed.x * s + raw.x * (1 - s);
        smoothed.y = smoothed.y * s + raw.y * (1 - s);

        // Reset raw accumulator
        mouseDeltaRef.current = { x: 0, y: 0 };

        return { x: smoothed.x, y: smoothed.y };
    }, []);

    return { ...controls, consumeMouseDelta };
}

export default useSpaceshipControls;
