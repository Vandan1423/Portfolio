/**
 * ARIA Terminal Component
 *
 * Main terminal interface for navigation and AI assistance.
 * Features:
 * - Command execution (systems, planets, goto, visit, etc.)
 * - Natural language AI chat
 * - Command history (↑↓ arrows)
 * - CRT terminal aesthetics
 */

import { useState, useEffect, useRef } from 'react';
import { useAI } from '../../context/AIContext';
import { useStarSystem } from '../../context/StarSystemContext';
import { useNavigation } from '../../context/NavigationContext';
import TerminalMessage from './TerminalMessage';
import { processInput } from '../../services/AIService';
import { STAR_SYSTEMS } from '../../data/starSystemsData';
import styles from './ARIATerminal.module.css';

export default function ARIATerminal() {
  const {
    isTerminalOpen,
    closeTerminal,
    messageHistory,
    addCommandMessage,
    addResponseMessage,
    clearMessages,
    currentLocation,
    addToNavigationHistory,
    isTyping,
    setIsTyping
  } = useAI();

  const { currentSystemId, setTravelDestination, setTravelPhase } = useStarSystem();
  const { onNavigate } = useNavigation();

  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageHistory]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isTerminalOpen) return;

      // ESC to close
      if (e.key === 'Escape') {
        closeTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen, closeTerminal]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }

    // Enter - execute command
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const executeCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase();

    // Navigation commands
    if (command === 'systems' || command === 'ls') {
      const systems = Object.values(STAR_SYSTEMS);
      const response = 'Available Star Systems:\n' +
        systems.map((sys, i) =>
          `  ${i + 1}. ${sys.name} (${sys.code})${sys.id === currentSystemId ? ' - CURRENT' : ''} - ${sys.page}`
        ).join('\n');
      addResponseMessage(response);
      return;
    }

    if (command === 'planets') {
      const system = STAR_SYSTEMS[currentSystemId];
      const response = `Planets in ${system.name}:\n` +
        system.planets.map((p, i) =>
          `  ${i + 1}. ${p.name}`
        ).join('\n');
      addResponseMessage(response);
      return;
    }

    if (command.startsWith('goto ')) {
      const systemName = command.substring(5).trim();
      const system = Object.values(STAR_SYSTEMS).find(s =>
        s.name.toLowerCase().includes(systemName) ||
        s.id.includes(systemName) ||
        s.page.toLowerCase().includes(systemName)
      );

      if (system) {
        // Check if already at this system
        if (system.id === currentSystemId) {
          addResponseMessage(`You are already in ${system.name}.`, true);
          return;
        }

        addResponseMessage(`Initiating wormhole jump to ${system.name}...\n[Traveling now]`);
        closeTerminal();

        // Small delay then trigger travel
        setTimeout(() => {
          // Navigate to 3D portfolio page first (if not there)
          if (window.location.pathname !== '/') {
            onNavigate('3d-portfolio');
          }

          // Trigger wormhole travel
          setTravelDestination(system.id);
          setTravelPhase('preparing');
        }, 300);
        return;
      } else {
        addResponseMessage(`System "${systemName}" not found. Type 'systems' to see all.`, true);
        return;
      }
    }

    if (command.startsWith('visit ')) {
      const planetName = command.substring(6).trim();
      const system = STAR_SYSTEMS[currentSystemId];
      const planet = system.planets.find(p =>
        p.name.toLowerCase().includes(planetName) ||
        p.id.includes(planetName)
      );

      if (planet) {
        addResponseMessage(`Navigating to ${planet.name}...`);
        // Navigate to the planet's page
        setTimeout(() => {
          onNavigate(system.page.toLowerCase().replace(' ', '-'), planet.sectionId);
          closeTerminal();
        }, 500);
        return;
      } else {
        addResponseMessage(`Planet "${planetName}" not found in current system. Type 'planets' to see all.`, true);
        return;
      }
    }

    // Info commands
    if (command === 'where' || command === 'pwd') {
      const system = STAR_SYSTEMS[currentSystemId];
      addResponseMessage(`Current location: ${system.name} (${system.code})\nPage: ${system.page}`);
      return;
    }

    if (command === 'history') {
      if (commandHistory.length === 0) {
        addResponseMessage('No command history yet.');
      } else {
        const response = 'Command History:\n' +
          commandHistory.slice(-10).map((cmd, i) => `  ${i + 1}. ${cmd}`).join('\n');
        addResponseMessage(response);
      }
      return;
    }

    // Utility commands
    if (command === 'help') {
      const helpText = `Available commands:
  Navigation:
    systems, planets, goto [system], visit [planet]
    back, home
  Information:
    where, history, about, search
  Utility:
    help, clear, exit, map

You can also ask me anything in natural language!
Examples: "what projects has vandan built?"
          "how do i contact him?"`;
      addResponseMessage(helpText);
      return;
    }

    if (command === 'clear' || command === 'cls') {
      clearMessages();
      return;
    }

    if (command === 'exit' || command === 'quit') {
      closeTerminal();
      return;
    }

    if (command === 'map') {
      addResponseMessage('Opening Neural Link Map...');
      // TODO: Open map when implemented
      return;
    }

    if (command === 'home') {
      addResponseMessage('Returning to Alpha Centauri...');
      setTimeout(() => {
        handleSystemTravel('alpha-centauri');
        closeTerminal();
      }, 500);
      return;
    }

    // If not a recognized command, send to AI
    await handleAIQuery(cmd);
  };

  const handleAIQuery = async (query) => {
    setIsTyping(true);

    try {
      const context = {
        currentSystem: STAR_SYSTEMS[currentSystemId]?.name || 'Unknown',
        currentPlanet: null,
        lastVisited: commandHistory[commandHistory.length - 1] || 'None'
      };

      const result = await processInput(query, context);

      if (result.success) {
        addResponseMessage(result.response);
      } else {
        addResponseMessage(result.response, true);
      }
    } catch (error) {
      addResponseMessage('Communication error. Please try again.', true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isTyping) return;

    const command = input.trim();

    // Add to message history
    addCommandMessage(command);

    // Add to command history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Clear input
    setInput('');

    // Execute command
    await executeCommand(command);
  };

  if (!isTerminalOpen) return null;

  return (
    <div className={styles.terminalOverlay}>
      <div className={styles.terminalWindow}>
        {/* Header */}
        <div className={styles.terminalHeader}>
          <div className={styles.headerTitle}>
            ARIA NAVIGATION TERMINAL v2.5
          </div>
          <button
            className={styles.closeButton}
            onClick={closeTerminal}
            aria-label="Close terminal"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className={styles.terminalMessages}>
          {messageHistory.map((msg, index) => (
            <TerminalMessage
              key={index}
              message={msg}
              withTypewriter={msg.type === 'response' && index === messageHistory.length - 1}
            />
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              ARIA is processing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.terminalInput}>
          <span className={styles.inputPrompt}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
            placeholder="Type 'help' or ask me anything..."
            disabled={isTyping}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Footer hint */}
        <div className={styles.terminalFooter}>
          Press ESC to close • ↑↓ for history
        </div>
      </div>

      {/* Scanline effect */}
      <div className={styles.scanline}></div>
    </div>
  );
}
