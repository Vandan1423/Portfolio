import { useMemo, useState } from 'react';
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
    spotlight: {
      target: "[data-tutorial='local-sector']",
      arrow: "left",
      allowInteraction: true
    },
    position: "top-right"
  },
  NAV_PLANET_LIST: {
    message: "Great! Here are all the planets. Each represents a different section. Now click the **back button** at the bottom to return to the main menu.",
    objective: "Click the back button",
    action: "click-back",
    progress: 52,
    spotlight: {
      target: "[data-tutorial='back-button']",
      arrow: "down",
      allowInteraction: true
    },
    position: "top-right"
  },
  NAV_TACTICAL_MAP: {
    message: "Now try **TACTICAL MAP (A2)**. It's the same planets, but visualized as a map. Click A2.",
    objective: "View Tactical Map (A2)",
    action: "click-menu",
    progress: 60,
    spotlight: {
      target: "[data-tutorial='tactical-map']",
      arrow: "left",
      allowInteraction: true
    },
    position: "top-right"
  },
  NAV_MAP_VIEW: {
    message: "Nice! This is the tactical view. Now go back again to see the final option.",
    objective: "Click back button",
    action: "click-back",
    progress: 65,
    spotlight: {
      target: "[data-tutorial='back-button']",
      arrow: "down",
      allowInteraction: true
    },
    position: "top-right"
  },
  NAV_WARP_DRIVE: {
    message: "Excellent! One more: **WARP DRIVE (A3)**. This lets you jump between different star systems. Each system is a different page - Projects, Experience, Contact, etc. Click A3.",
    objective: "View Warp Drive (A3)",
    action: "click-menu",
    progress: 72,
    spotlight: {
      target: "[data-tutorial='warp-drive']",
      arrow: "left",
      allowInteraction: true
    },
    position: "top-right"
  },
  NAV_SYSTEM_LIST: {
    message: "Perfect! These are all the star systems. **ALPHA CENTAURI** is About Me, **SIRIUS** is Projects, **VEGA** is Experience, and so on. You can click any system to travel there. For now, go back to continue the tutorial.",
    objective: "Click back to main menu",
    action: "click-back",
    progress: 78,
    spotlight: {
      target: "[data-tutorial='back-button']",
      arrow: "down",
      allowInteraction: true
    },
    position: "top-right"
  },
  PLANET_SELECTION: {
    message: "Now let's visit a planet. Go back to the main menu (click back or press ESC), then select any planet from LOCAL SECTOR. I recommend starting with the first one.",
    objective: "Select a planet to visit",
    action: "select-planet",
    progress: 82,
    spotlight: null,
    position: "top-right"
  },
  PLANET_DOCKING: {
    message: "You're approaching the planet! Notice the spacecraft on the left? Press **D** to initiate docking. Once docked, we'll complete your training.",
    objective: "Press 'D' to dock",
    action: "press-d",
    progress: 90,
    spotlight: {
      target: ".docking-hint",
      arrow: "up",
      allowInteraction: false
    },
    position: "top-right"
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

const TutorialOverlay = () => {
  const { isActive, currentStep, newAchievement } = useTutorial();
  const [targetBounds, setTargetBounds] = useState(null);

  // Get current step configuration
  const stepConfig = useMemo(() => {
    return TUTORIAL_STEPS[currentStep] || null;
  }, [currentStep]);

  // Handle bounds calculation from spotlight
  const handleBoundsCalculated = (bounds) => {
    setTargetBounds(bounds);
  };

  // Don't render if tutorial is not active
  if (!isActive || !stepConfig) {
    return null;
  }

  return (
    <>
      {/* Spotlight overlay (if step requires it) */}
      {stepConfig.spotlight && (
        <TutorialSpotlight
          targetElement={stepConfig.spotlight.target}
          arrow={stepConfig.spotlight.arrow}
          allowInteraction={stepConfig.spotlight.allowInteraction}
          onBoundsCalculated={handleBoundsCalculated}
        />
      )}

      {/* Mission briefing panel */}
      <MissionBriefing
        message={stepConfig.message}
        objective={stepConfig.objective}
        progress={stepConfig.progress}
        action={stepConfig.action}
        position={stepConfig.position}
        compact={stepConfig.compact}
        celebration={stepConfig.celebration}
        targetBounds={stepConfig.spotlight ? targetBounds : null}
      />

      {/* Achievement notification (if any) */}
      {newAchievement && (
        <AchievementNotification achievement={newAchievement} />
      )}
    </>
  );
};

export default TutorialOverlay;
