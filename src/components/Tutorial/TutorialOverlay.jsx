import { useMemo, useState, useEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import MissionBriefing from './MissionBriefing';
import TutorialSpotlight from './TutorialSpotlight';
import AchievementNotification from './AchievementNotification';

/**
 * TutorialOverlay Component
 *
 * Orchestrates the entire tutorial experience by rendering the appropriate
 * UI components based on the current tutorial step.
 *
 * Features:
 * - Mission briefing panels with Commander ARIA's directives
 * - Spotlight highlighting for UI elements
 * - Achievement notifications
 * - Progress tracking
 */

// Random messages for launch sequence (Easter Egg #3)
const LAUNCH_MESSAGES = [
  "Hold tight! Wormhole transit in progress... Don't worry, the shaking is normal.",
  "Hold tight! Wormhole transit in progress... First jump is always the wildest.",
  "Hold tight! Wormhole transit in progress... Fun fact: we're traveling at 10x light speed."
];

// Tutorial step configurations
const TUTORIAL_STEPS = {
  WAITING_FOR_LAUNCH: null, // Don't show anything during cockpit phase
  COCKPIT_WELCOME: {
    message: "Welcome aboard, Pilot. I'm Commander ARIA, your AI assistant. This ship is your gateway to exploring a unique portfolio experience. Let me show you the ropes.",
    objective: "Familiarize yourself with the cockpit",
    action: "click-next",
    progress: 10,
    spotlight: null,
    position: "bottom-center"
  },
  COCKPIT_TERMINAL: {
    message: "See that terminal below? That's your primary interface. To begin your journey, input the command: **launch**",
    objective: "Type 'launch' in the terminal",
    action: "terminal-launch",
    progress: 20,
    spotlight: {
      target: ".terminal-container",
      arrow: "down",
      allowInteraction: true
    },
    position: "bottom-center"
  },
  LAUNCH_BRIEFING: {
    message: LAUNCH_MESSAGES[Math.floor(Math.random() * LAUNCH_MESSAGES.length)],
    objective: "Experience wormhole travel",
    action: "automatic",
    progress: 30,
    spotlight: null,
    position: "top-right",
    compact: true
  },
  EXPLORATION_ARRIVAL: {
    message: "Welcome to the Alpha Centauri system, Pilot! You've successfully completed your first wormhole jump. You're now in EXPLORATION MODE. Use your mouse to look around - drag to rotate, scroll to zoom. Take a moment to admire the view.",
    objective: "Explore the star system (drag camera or zoom)",
    action: "camera-move",
    progress: 20,
    spotlight: null,
    position: "bottom-center"
  },
  NAVIGATION_PROMPT: {
    message: "Now for the important part. See that **'Press N for Navigation'** hint? That's your tactical dashboard. Go ahead, press **N**.",
    objective: "Press 'N' to open navigation",
    action: "press-n",
    progress: 35,
    spotlight: {
      target: ".navigation-hint",
      arrow: "up",
      allowInteraction: false
    },
    position: "bottom-center"
  },
  NAV_LOCAL_SECTOR: {
    message: "Perfect! This is your NAV DASHBOARD. Let's start with **LOCAL SECTOR (A1)**. This shows all planets in your current system. Each planet represents a section of the portfolio. Click it.",
    objective: "Click LOCAL SECTOR (A1)",
    action: "click-menu",
    progress: 45,
    spotlight: null,
    position: "top-right"
  },
  PLANET_SELECTION: {
    message: "Great! Here are all the planets. Each represents a different section of the portfolio. Let's explore the **first planet** - click on it to visit.",
    objective: "Click on the first planet",
    action: "select-planet",
    progress: 50,
    spotlight: null,
    position: "top-right"
  },
  PLANET_INFO_PANEL: {
    message: "Perfect! You're now approaching the planet. See the panel on the right? It displays all the **information embedded in the planet** - the content of this section. And on the left is the **planet itself** in 3D with a spacecraft ready to dock.",
    objective: "View the planet detail scene",
    action: "automatic",
    progress: 52,
    spotlight: null,
    position: "bottom-center"
  },
  PLANET_DOCKING: {
    message: "Now, to access the full content of this section, you need to **dock** with the planet. Press **D** to initiate docking sequence.",
    objective: "Press 'D' to dock",
    action: "press-d",
    progress: 56,
    spotlight: null,
    position: "bottom-center"
  },
  DOCKING_IN_PROGRESS: null, // Hide tutorial UI during docking animation
  EXPLORE_CONTENT: {
    message: "Great! You've successfully docked. Take a moment to explore this content. When you're ready to continue, use the **back button** at the top left or press **ESC** to return to space.",
    objective: "Explore the content, then go back to space",
    action: "wait-for-back",
    progress: 60,
    spotlight: null,
    position: "bottom-center",
    compact: true
  },
  REOPEN_NAV_FOR_A2: {
    message: "Excellent! Now let's explore the other navigation options. Press **N** to open the navigation dashboard again.",
    objective: "Press 'N' to open navigation",
    action: "press-n",
    progress: 70,
    spotlight: null,
    position: "bottom-center"
  },
  NAV_TACTICAL_MAP: {
    message: "Now try **TACTICAL MAP (A2)**. It shows the same planets, but visualized as a 3D tactical map with their positions in the star system. Click A2.",
    objective: "View Tactical Map (A2)",
    action: "click-menu",
    progress: 75,
    spotlight: null,
    position: "top-right"
  },
  NAV_MAP_VIEW: {
    message: "Nice! This is the tactical overview. You can see the spatial layout of all planets. Now click the **back button** at the bottom to return to the main menu.",
    objective: "Click the back button",
    action: "click-back",
    progress: 78,
    spotlight: null,
    position: "top-right"
  },
  REOPEN_NAV_FOR_A3: {
    message: "Perfect! Now for the final feature: **Inter-System Travel**. Press **N** to open navigation one more time.",
    objective: "Press 'N' to open navigation",
    action: "press-n",
    progress: 85,
    spotlight: null,
    position: "bottom-center"
  },
  NAV_WARP_DRIVE: {
    message: "Perfect! Now for **Inter-System Travel**. Click **WARP DRIVE (A3)** to see all available star systems. Each system represents a different page of the portfolio - Projects, Experience, Contact, etc. This is how you navigate between pages!",
    objective: "Click WARP DRIVE (A3)",
    action: "click-menu",
    progress: 85,
    spotlight: null,
    position: "top-right"
  },
  SELECT_DESTINATION: {
    message: "Perfect! Here are all the star systems. Each system represents a different page. You are currently on the **first star system**. Let's try the **second one** to see inter-system travel in action. Click on it to initiate a wormhole jump.",
    objective: "Click on the second system",
    action: "select-system",
    progress: 91,
    spotlight: null,
    position: "top-right"
  },
  SYSTEM_ARRIVAL: {
    message: "Outstanding! You've successfully traveled to a new star system. **Now it's your turn!** Go ahead and explore any planet you'd like, then dock with it to see the content of this page. Use navigation (Press **N**) whenever you want to explore planets, view the tactical map, or travel to other star systems. You've got this!",
    objective: "Complete your training",
    action: "click-finish",
    progress: 95,
    spotlight: null,
    position: "bottom-center"
  },
  MISSION_COMPLETE: {
    message: [
      "Outstanding work, Captain! You've mastered the basics.",
      "You're now free to explore the entire portfolio at your own pace.",
      "Remember: Press **?** anytime to replay this tutorial or view the full guide.",
      "Safe travels!"
    ][Math.floor(Math.random() * 1)] + " " + [
      "You're a natural!",
      "Commander ARIA approves!",
      "Achievement unlocked: Portfolio Pro!"
    ][Math.floor(Math.random() * 3)],
    objective: "Mission accomplished!",
    action: "complete",
    progress: 100,
    spotlight: null,
    position: "center",
    celebration: true
  }
};

const TutorialOverlay = ({ currentPhase, currentPage, isNavigationVisible }) => {
  const { isActive, currentStep, newAchievement, nextStep: tutorialNextStep } = useTutorial();
  const [targetBounds, setTargetBounds] = useState(null);
  const [shouldAutoMinimize, setShouldAutoMinimize] = useState(false);
  const [isManuallyMinimized, setIsManuallyMinimized] = useState(false);

  // Get current step configuration
  const stepConfig = useMemo(() => {
    return TUTORIAL_STEPS[currentStep] || null;
  }, [currentStep]);

  // Auto-advance steps with action: "automatic"
  useEffect(() => {
    if (!isActive || !stepConfig) return;

    if (stepConfig.action === 'automatic') {
      // Different delays based on step
      let delay = 3000; // Default 3 seconds

      if (currentStep === 'LAUNCH_BRIEFING') {
        delay = 2000; // Shorter for launch briefing
      } else if (currentStep === 'PLANET_INFO_PANEL') {
        delay = 5000; // Give user 5 seconds to look at planet detail scene
      }

      const timer = setTimeout(() => {
        const nextSteps = {
          'LAUNCH_BRIEFING': 'EXPLORATION_ARRIVAL',
          'PLANET_INFO_PANEL': 'PLANET_DOCKING'
        };

        const nextStep = nextSteps[currentStep];
        if (nextStep) {
          tutorialNextStep(nextStep);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, stepConfig, tutorialNextStep]);

  // Auto-minimize when navigation opens during specific steps
  // (Currently disabled - tutorial shows spotlight for specific items instead)
  useEffect(() => {
    const shouldMinimize = false; // Disabled to show spotlight on first planet/system

    if (shouldMinimize) {
      setShouldAutoMinimize(true);
    }
  }, [isNavigationVisible, currentStep]);

  // Reset auto-minimize when navigation closes
  useEffect(() => {
    if (!isNavigationVisible) {
      setShouldAutoMinimize(false);
    }
  }, [isNavigationVisible]);

  // Handle bounds calculation from spotlight
  const handleBoundsCalculated = (bounds) => {
    setTargetBounds(bounds);
  };

  // Handle manual minimize state change
  const handleMinimizeChange = (minimized) => {
    setIsManuallyMinimized(minimized);
  };

  // Don't render if tutorial is not active
  if (!isActive || !stepConfig) {
    return null;
  }

  // Hide tutorial during cockpit and launching phases (except WAITING_FOR_LAUNCH which is already null)
  const isInCockpitOrLaunching = currentPhase === 'cockpit' || currentPhase === 'launching';
  if (isInCockpitOrLaunching && currentPage === '3d-portfolio') {
    // Still show achievement notifications
    return (
      <>
        {newAchievement && (
          <AchievementNotification achievement={newAchievement} />
        )}
      </>
    );
  }

  return (
    <>
      {/* Spotlight overlay - DISABLED (text-only guidance) */}
      {/* Spotlights removed to allow free interaction - tutorial now guides via text only */}

      {/* Mission briefing panel */}
      <MissionBriefing
        message={stepConfig.message}
        objective={stepConfig.objective}
        progress={stepConfig.progress}
        action={stepConfig.action}
        position={stepConfig.position}
        compact={stepConfig.compact}
        celebration={stepConfig.celebration}
        targetBounds={null}
        autoMinimize={shouldAutoMinimize}
        onMinimizeChange={handleMinimizeChange}
        isNavigationVisible={isNavigationVisible}
        currentPhase={currentPhase}
      />

      {/* Achievement notification (if any) */}
      {newAchievement && (
        <AchievementNotification achievement={newAchievement} />
      )}
    </>
  );
};

export default TutorialOverlay;
