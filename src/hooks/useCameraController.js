import { useState, useCallback } from "react";

/**
 * Custom hook to manage camera perspectives
 * Handles transitions between first-person (cockpit) and third-person (exploration) views
 */
export const useCameraController = () => {
    const [cameraMode, setCameraMode] = useState("first-person"); // 'first-person' or 'third-person'
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Camera positions for different modes
    const cameraPositions = {
        "first-person-cockpit": { position: [0, 0, 0], target: [0, 0, -5] }, // Inside cockpit looking forward
        "third-person-exploration": { position: [0, 5, 10], target: [0, 0, 0] }, // Behind spacecraft
        "navigation-view": { position: [0, 0, 0], target: [0, 0, -2] }, // Cockpit with dashboard focus
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