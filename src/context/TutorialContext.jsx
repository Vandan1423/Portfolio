import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'pilots-license',
    icon: '🚀',
    name: "PILOT'S LICENSE",
    description: "Successfully completed your first wormhole jump",
    step: 'EXPLORATION_ARRIVAL'
  },
  {
    id: 'navigator',
    icon: '🧭',
    name: "NAVIGATOR",
    description: "Accessed tactical navigation",
    step: 'NAVIGATION_PROMPT'
  },
  {
    id: 'warp-capable',
    icon: '⚡',
    name: "WARP CAPABLE",
    description: "Mastered inter-system navigation",
    step: 'NAV_WARP_DRIVE'
  },
  {
    id: 'space-captain',
    icon: '🎯',
    name: "SPACE CAPTAIN",
    description: "Successfully docked at your first planet",
    step: 'PLANET_DOCKING'
  },
  {
    id: 'mission-complete',
    icon: '🏆',
    name: "MISSION COMPLETE",
    description: "Completed pilot training program",
    step: 'MISSION_COMPLETE'
  },
  // Easter Egg Achievements (hidden)
  {
    id: 'speed-runner',
    icon: '⏱️',
    name: "SPEED RUNNER",
    description: "Completed tutorial in under 3 minutes",
    hidden: true
  },
  {
    id: 'keen-reader',
    icon: '📖',
    name: "KEEN READER",
    description: "Found Commander ARIA's hidden message",
    hidden: true
  }
];

// Step progress mapping
const STEP_PROGRESS = {
  'WAITING_FOR_LAUNCH': 0,
  'EXPLORATION_ARRIVAL': 20,
  'NAVIGATION_PROMPT': 35,
  'NAV_LOCAL_SECTOR': 45,
  'NAV_PLANET_LIST': 52,
  'NAV_TACTICAL_MAP': 60,
  'NAV_MAP_VIEW': 65,
  'NAV_WARP_DRIVE': 72,
  'NAV_SYSTEM_LIST': 78,
  'PLANET_SELECTION': 82,
  'PLANET_DOCKING': 90,
  'MISSION_COMPLETE': 100
};

const LOCALSTORAGE_KEY = 'portfolio-tutorial-state';
const TUTORIAL_VERSION = '1.0';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  // Tutorial state
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState('COCKPIT_WELCOME');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);

  // Achievement system
  const [achievements, setAchievements] = useState(() =>
    ACHIEVEMENTS.map(ach => ({ ...ach, unlocked: false, timestamp: null }))
  );
  const [newAchievement, setNewAchievement] = useState(null);

  // Easter eggs
  const [discoveredEasterEggs, setDiscoveredEasterEggs] = useState([]);

  // Tutorial timing (for speed runner achievement)
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Load tutorial state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCALSTORAGE_KEY);

      if (savedState) {
        const parsed = JSON.parse(savedState);

        // Version check - reset if version mismatch
        if (parsed.version !== TUTORIAL_VERSION) {
          console.log('Tutorial version mismatch, resetting...');
          localStorage.removeItem(LOCALSTORAGE_KEY);
          setCompleted(false);
          return;
        }

        // Load saved state
        setCompleted(parsed.completed || false);

        if (parsed.completed) {
          // Tutorial already completed
          if (parsed.achievements) {
            setAchievements(prev =>
              prev.map(ach => {
                const savedAch = parsed.achievements.find(s => s.id === ach.id);
                return savedAch ? { ...ach, unlocked: true, timestamp: savedAch.unlockedAt } : ach;
              })
            );
          }
        } else if (parsed.currentStep) {
          // Tutorial in progress - restore state
          setIsActive(true);
          setCurrentStep(parsed.currentStep);
          setCompletedSteps(parsed.completedSteps || []);
          setProgress(parsed.progress || 0);
          setStartTime(parsed.startedAt);
        }
      } else {
        // First visit - auto-start tutorial
        setTimeout(() => {
          startTutorial();
        }, 1000); // Small delay to let page load
      }
    } catch (error) {
      console.error('Error loading tutorial state:', error);
    }
  }, []);

  // Save tutorial state to localStorage whenever it changes
  const saveTutorialState = useCallback((state) => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({
        ...state,
        version: TUTORIAL_VERSION
      }));
    } catch (error) {
      console.error('Error saving tutorial state:', error);
    }
  }, []);

  // Start tutorial (auto or manual)
  const startTutorial = useCallback(() => {
    setIsActive(false); // Don't activate until after launch
    setCurrentStep('WAITING_FOR_LAUNCH');
    setProgress(0);
    setCompletedSteps([]);
    setStartTime(Date.now());
    setCompleted(false);

    // Reset achievements
    setAchievements(prev =>
      prev.map(ach => ({ ...ach, unlocked: false, timestamp: null }))
    );
    setDiscoveredEasterEggs([]);

    saveTutorialState({
      completed: false,
      startedAt: Date.now(),
      completedAt: null,
      currentStep: 'WAITING_FOR_LAUNCH',
      completedSteps: [],
      progress: 0,
      achievements: [],
      easterEggs: []
    });
  }, [saveTutorialState]);

  // Advance to next step
  const nextStep = useCallback((stepId) => {
    setCurrentStep(stepId);
    const newProgress = STEP_PROGRESS[stepId] || progress;
    setProgress(newProgress);

    // Activate tutorial when transitioning from WAITING_FOR_LAUNCH
    if (stepId === 'EXPLORATION_ARRIVAL') {
      setIsActive(true);
    }

    // Save state
    saveTutorialState({
      completed: false,
      startedAt: startTime,
      completedAt: null,
      currentStep: stepId,
      completedSteps,
      progress: newProgress,
      achievements: achievements.filter(a => a.unlocked).map(a => ({
        id: a.id,
        unlockedAt: a.timestamp
      })),
      easterEggs: discoveredEasterEggs
    });
  }, [progress, startTime, completedSteps, achievements, discoveredEasterEggs, saveTutorialState]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);

    if (achievement && !achievement.unlocked) {
      const timestamp = Date.now();

      setAchievements(prev =>
        prev.map(ach =>
          ach.id === achievementId
            ? { ...ach, unlocked: true, timestamp }
            : ach
        )
      );

      // Show notification
      setNewAchievement({ ...achievement, timestamp });

      // Auto-dismiss notification after 4 seconds
      setTimeout(() => {
        setNewAchievement(null);
      }, 4000);
    }
  }, [achievements]);

  // Complete step with optional achievement
  const completeStep = useCallback((stepId, achievementData) => {
    setCompletedSteps(prev => [...prev, stepId]);

    if (achievementData && achievementData.id) {
      unlockAchievement(achievementData.id);
    }
  }, [unlockAchievement]);

  // Finish tutorial entirely
  const completeTutorial = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Unlock final achievement
    unlockAchievement('mission-complete');

    // Check for speed runner achievement (under 3 minutes = 180000ms)
    if (duration < 180000) {
      unlockAchievement('speed-runner');
    }

    // Small delay to let final achievement show, then complete
    setTimeout(() => {
      setIsActive(false);
      setProgress(100);
      setCompleted(true);

      saveTutorialState({
        completed: true,
        startedAt: startTime,
        completedAt: endTime,
        currentStep: 'MISSION_COMPLETE',
        completedSteps,
        progress: 100,
        achievements: achievements.filter(a => a.unlocked).map(a => ({
          id: a.id,
          unlockedAt: a.timestamp
        })),
        easterEggs: discoveredEasterEggs
      });
    }, 500);
  }, [startTime, completedSteps, achievements, discoveredEasterEggs, saveTutorialState, unlockAchievement]);

  // Skip tutorial (with confirmation)
  const skipTutorial = useCallback(() => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip the tutorial? You can always replay it from the help menu."
    );

    if (confirmSkip) {
      setIsActive(false);
      setCompleted(true);

      saveTutorialState({
        completed: true,
        startedAt: startTime,
        completedAt: Date.now(),
        currentStep: 'SKIPPED',
        completedSteps,
        progress: 0,
        achievements: [],
        easterEggs: []
      });
    }
  }, [startTime, completedSteps, saveTutorialState]);

  // Replay tutorial
  const replayTutorial = useCallback(() => {
    startTutorial();
  }, [startTutorial]);

  // Acknowledge achievement (dismiss notification)
  const acknowledgeAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  // Discover easter egg
  const discoverEasterEgg = useCallback((eggId) => {
    if (!discoveredEasterEggs.includes(eggId)) {
      setDiscoveredEasterEggs(prev => [...prev, eggId]);

      // Check if this easter egg has an associated achievement
      if (eggId === 'aria-secret') {
        unlockAchievement('keen-reader');
      }
    }
  }, [discoveredEasterEggs, unlockAchievement]);

  // Emergency skip with Shift+ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isActive && e.key === 'Escape' && e.shiftKey) {
        skipTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, skipTutorial]);

  const value = {
    // State
    isActive,
    currentStep,
    completedSteps,
    progress,
    achievements,
    newAchievement,
    discoveredEasterEggs,
    completed,
    startTime,

    // Methods
    startTutorial,
    nextStep,
    completeStep,
    completeTutorial,
    skipTutorial,
    replayTutorial,
    acknowledgeAchievement,
    discoverEasterEgg,
    unlockAchievement
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

export default TutorialContext;
