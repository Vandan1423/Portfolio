/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const TutorialContext = createContext(undefined);

export function TutorialProvider({ children }) {
    // Check if user has seen tutorial before (using localStorage)
    const isFirstVisit = useMemo(() => {
        return localStorage.getItem('portfolio-tutorial-seen') !== 'true';
    }, []);

    const [tutorialStep, setTutorialStep] = useState(0);
    const [showTutorial, setShowTutorial] = useState(isFirstVisit);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [userHasInteracted, setUserHasInteracted] = useState(false);
    const [hasEnteredExploration, setHasEnteredExploration] = useState(false);

    // Tutorial steps configuration
    const tutorialSteps = [
        {
            id: 'navigation-hint',
            message: "Press 'N' anytime to open the navigation menu and explore different star systems and planets!",
            trigger: 'after-interaction', // Shows after user interaction
            duration: 0, // Stays until dismissed
        },
        {
            id: 'dock-hint',
            message: "Press 'D' to dock and explore this planet's content!",
            trigger: 'planet-detail', // Shows when on planet detail scene
            duration: 0, // Stays until manually dismissed
        },
        {
            id: 'piloting-hint',
            message: "Press 'P' to pilot your ship! Use WASD to fly through space.",
            trigger: 'exploration', // Shows during exploration phase
            duration: 0,
        },
        {
            id: 'landing-hint',
            message: "Approach a planet and press 'L' to land and explore on foot!",
            trigger: 'piloting', // Shows when near a planet
            duration: 0,
        },
        {
            id: 'walking-hint',
            message: "Use WASD to walk around. Press 'E' near stations to interact. Press 'B' to return to your ship!",
            trigger: 'walking', // Shows when on planet surface
            duration: 0,
        },
    ];

    // Welcome message (shows on every visit)
    const welcomeMessage = isFirstVisit 
        ? "Hey there! I'm Sagittarius, your AI guide! Welcome to this space portfolio. Explore the system using the controls! 🚀"
        : "Welcome back to my portfolio! If you need any help, just ask me!";

    const currentTutorialMessage = showTutorial ? tutorialSteps[tutorialStep] : null;

    const nextStep = useCallback(() => {
        if (tutorialStep < tutorialSteps.length - 1) {
            setTutorialStep(prev => prev + 1);
        } else {
            // Tutorial complete
            setShowTutorial(false);
            localStorage.setItem('portfolio-tutorial-seen', 'true');
        }
    }, [tutorialStep, tutorialSteps.length]);

    const skipTutorial = useCallback(() => {
        setShowTutorial(false);
        localStorage.setItem('portfolio-tutorial-seen', 'true');
    }, []);

    const dismissWelcomeMessage = useCallback(() => {
        setShowWelcomeMessage(false);
    }, []);

    const dismissCurrentTutorial = useCallback(() => {
        if (showTutorial && tutorialStep < tutorialSteps.length) {
            nextStep();
        }
    }, [showTutorial, tutorialStep, tutorialSteps.length, nextStep]);

    // Auto-dismiss welcome message after 10 seconds and show tutorial if first visit
    useEffect(() => {
        if (!showWelcomeMessage) return;

        const timer = setTimeout(() => {
            setShowWelcomeMessage(false);
            // If first visit, the tutorial will automatically show after welcome message
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [showWelcomeMessage]);

    const notifyUserInteraction = useCallback(() => {
        if (!userHasInteracted) {
            setUserHasInteracted(true);
        }
    }, [userHasInteracted]);

    const notifyExplorationEntered = useCallback(() => {
        if (!hasEnteredExploration) {
            setHasEnteredExploration(true);
            setShowWelcomeMessage(true);
        }
    }, [hasEnteredExploration]);

    const resetTutorial = useCallback(() => {
        setTutorialStep(0);
        setShowTutorial(true);
        setShowWelcomeMessage(false);
        setUserHasInteracted(false);
        setHasEnteredExploration(false);
        localStorage.removeItem('portfolio-tutorial-seen');
    }, []);

    // Show navigation hint after welcome message is dismissed (only on first visit)
    // Remove the user interaction requirement - show immediately after welcome
    useEffect(() => {
        if (showTutorial && !showWelcomeMessage && tutorialStep === 0) {
            // Welcome message was dismissed and we're on first visit
            // Navigation hint (step 0) should now be visible automatically
            // No action needed as currentTutorialMessage will be step 0
        }
    }, [showWelcomeMessage, showTutorial, tutorialStep]);

    const value = {
        tutorialStep,
        showTutorial,
        notifyExplorationEntered,
        isFirstVisit,
        showWelcomeMessage,
        welcomeMessage,
        currentTutorialMessage,
        nextStep,
        skipTutorial,
        dismissWelcomeMessage,
        dismissCurrentTutorial,
        notifyUserInteraction,
        resetTutorial,
        setTutorialStep,
    };

    return (
        <TutorialContext.Provider value={value}>
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
}
