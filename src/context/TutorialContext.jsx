/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const TutorialContext = createContext(undefined);

const STORAGE_KEY = 'portfolio-tutorial-seen';

// First-visit tips, shown one at a time in the 3D view by TutorialHint.
// `where` is the view a tip belongs to; it waits until the visitor is there.
const TUTORIAL_STEPS = [
    {
        id: 'navigation-hint',
        message: 'Press N to open the map and jump between star systems and planets.',
        where: 'orbit',
    },
    {
        id: 'piloting-hint',
        message: 'Press P to fly the ship yourself. W and S thrust, the mouse steers.',
        where: 'orbit',
    },
    {
        id: 'landing-hint',
        message: 'Fly close to a planet and press L to land on it.',
        where: 'piloting',
    },
];

const readSeen = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
};

const markSeen = () => {
    try {
        localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
        // Storage blocked: the tips just show again next visit
    }
};

export function TutorialProvider({ children }) {
    const [tutorialStep, setTutorialStep] = useState(0);
    const [showTutorial, setShowTutorial] = useState(() => !readSeen());

    const currentTutorialMessage = showTutorial ? TUTORIAL_STEPS[tutorialStep] : null;

    const nextStep = useCallback(() => {
        if (tutorialStep < TUTORIAL_STEPS.length - 1) {
            setTutorialStep((prev) => prev + 1);
        } else {
            setShowTutorial(false);
            markSeen();
        }
    }, [tutorialStep]);

    const skipTutorial = useCallback(() => {
        setShowTutorial(false);
        markSeen();
    }, []);

    // Moves on only if the given tip is the one showing, so a key press
    // that matches a later tip cannot skip ahead
    const completeTip = useCallback((id) => {
        if (showTutorial && TUTORIAL_STEPS[tutorialStep]?.id === id) nextStep();
    }, [showTutorial, tutorialStep, nextStep]);

    const value = useMemo(() => ({
        tutorialStep,
        showTutorial,
        currentTutorialMessage,
        nextStep,
        skipTutorial,
        completeTip,
    }), [tutorialStep, showTutorial, currentTutorialMessage, nextStep, skipTutorial, completeTip]);

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
