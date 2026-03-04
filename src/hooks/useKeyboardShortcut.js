import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for keyboard shortcut handling
 * Listens for specific key presses and provides toggle functionality
 * Uses refs for stable event listener to reduce INP
 *
 * @param {string} targetKey - The key to listen for (e.g., 'n', 'Escape')
 * @returns {Object} - { isActive, toggle, setIsActive }
 */
export const useKeyboardShortcut = (targetKey = "n") => {
    const [isActive, setIsActive] = useState(false);
    const isActiveRef = useRef(false);

    // Keep ref in sync with state
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    const toggle = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ignore if user is typing in an input field
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            // Check for the target key (case-insensitive)
            if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                event.preventDefault(); // Prevent default browser behavior
                toggle();
            }

            // ESC key always closes (sets to false)
            if (event.key === "Escape" && isActiveRef.current) {
                event.preventDefault();
                setIsActive(false);
            }
        };

        // Add event listener
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [targetKey, toggle]); // Removed isActive from deps - using ref instead

    return { isActive, toggle, setIsActive };
};

/**
 * Custom hook to manage camera perspectives
 * Handles transitions between first-person (cockpit) and third-person (exploration) views
 */
export const useCameraController = () => {
    const [cameraMode, setCameraMode] = useState("first-person"); // 'first-person' or 'third-person'
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Camera positions for different modes
    const cameraPositions = {
        "first-person-cockpit": { position: [0, 0, 0], target: [0, 0, -5] },
        "third-person-exploration": { position: [0, 5, 10], target: [0, 0, 0] },
        "navigation-view": { position: [0, 0, 0], target: [0, 0, -2] },
    };

    const switchCamera = useCallback((newMode) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCameraMode(newMode);
            setIsTransitioning(false);
        }, 1000); // 1 second transition
    }, []);

    return {
        cameraMode,
        isTransitioning,
        switchCamera,
        cameraPositions,
    };
};

// Default export for useKeyboardShortcut (most commonly used)
export default useKeyboardShortcut;
