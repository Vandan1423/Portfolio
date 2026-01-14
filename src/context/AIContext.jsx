/**
 * AI Context
 *
 * Global state management for Sagittarius terminal and Neural Link map.
 * Handles terminal visibility, message history, navigation history,
 * and current location tracking.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigation } from './NavigationContext';
import { useStarSystem } from './StarSystemContext';

const AIContext = createContext(null);

export function AIProvider({ children }) {
  // Terminal state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null); // For "yes" navigation

  // Get current location from existing contexts
  const { currentPage } = useNavigation();
  const { currentSystemId, selectedPlanet } = useStarSystem();

  // Message management (defined first so it can be used by openTerminal)
  const addMessage = useCallback((message) => {
    setMessageHistory(prev => [...prev, message]);
  }, []);

  const addSystemMessage = useCallback((text) => {
    addMessage({
      type: 'system',
      text,
      timestamp: Date.now()
    });
  }, [addMessage]);

  // Terminal controls
  const openTerminal = useCallback((customMessage = null) => {
    setIsMapOpen(false); // Close map when terminal opens
    setIsTerminalOpen(true);

    // If custom message provided, show that instead of default welcome
    if (customMessage) {
      addSystemMessage(customMessage);
    } else if (messageHistory.length === 0) {
      // Add welcome message if first time opening and no custom message
      addSystemMessage("SAGITTARIUS NAVIGATION TERMINAL v1.0\nCommander, I'm here to help you navigate.\n\nType 'help' for available commands or ask me\nanything about this portfolio!");
    }
  }, [messageHistory.length, addSystemMessage]);

  const closeTerminal = useCallback(() => {
    setIsTerminalOpen(false);
  }, []);

  // Map controls
  const openMap = useCallback(() => {
    setIsMapOpen(true);
    closeTerminal(); // Close terminal when map opens
  }, [closeTerminal]);

  const closeMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const addCommandMessage = useCallback((text) => {
    addMessage({
      type: 'command',
      text: `> ${text}`,
      timestamp: Date.now()
    });
  }, [addMessage]);

  const addResponseMessage = useCallback((text, isError = false) => {
    addMessage({
      type: isError ? 'error' : 'response',
      text,
      timestamp: Date.now()
    });
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessageHistory([]);
  }, []);

  // Navigation tracking
  const addToNavigationHistory = useCallback((location) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev, {
        ...location,
        timestamp: Date.now()
      }];
      // Keep only last 10 locations
      return newHistory.slice(-10);
    });
  }, []);

  const getCurrentLocation = useCallback(() => {
    return {
      page: currentPage,
      system: currentSystemId,
      planet: selectedPlanet?.id || null
    };
  }, [currentPage, currentSystemId, selectedPlanet]);

  const value = {
    // Terminal state
    isTerminalOpen,
    isMapOpen,
    messageHistory,
    navigationHistory,
    isTyping,
    setIsTyping,
    pendingNavigation,
    setPendingNavigation,

    // Terminal controls
    openTerminal,
    closeTerminal,
    openMap,
    closeMap,

    // Message management
    addMessage,
    addSystemMessage,
    addCommandMessage,
    addResponseMessage,
    clearMessages,

    // Navigation
    addToNavigationHistory,
    getCurrentLocation,
    currentLocation: getCurrentLocation()
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
}

export default AIContext;
