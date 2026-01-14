/**
 * Sagittarius Terminal Component
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
import { resolveNavigationTarget } from '../../services/CommandParser';
import { STAR_SYSTEMS } from '../../data/starSystemsData';
import styles from './SagittariusTerminal.module.css';

export default function SagittariusTerminal() {
  const {
    isTerminalOpen,
    closeTerminal,
    messageHistory,
    addCommandMessage,
    addResponseMessage,
    clearMessages,
    isTyping,
    setIsTyping,
    pendingNavigation,
    setPendingNavigation
  } = useAI();

  const { currentSystemId, setTravelDestination, setTravelPhase } = useStarSystem();
  const { onNavigate } = useNavigation();

  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom helper function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll to bottom when new messages arrive or typing state changes
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, isTyping]);

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
      const target = command.substring(5).trim();
      
      // Try intelligent resolution first
      const resolved = resolveNavigationTarget(target);
      let system = null;
      
      if (resolved) {
        system = STAR_SYSTEMS[resolved.systemId];
      } else {
        // Fallback to original logic
        system = Object.values(STAR_SYSTEMS).find(s =>
          s.name.toLowerCase().includes(target.toLowerCase()) ||
          s.id.includes(target.toLowerCase()) ||
          s.page.toLowerCase().includes(target.toLowerCase())
        );
      }

      if (system) {
        // Check if already at this system
        if (system.id === currentSystemId) {
          addResponseMessage(`You are already in ${system.name}.`, true);
          return;
        }

        addResponseMessage(`Initiating wormhole jump to ${system.name}...\n[Traveling now]`);

        // Small delay then trigger travel
        setTimeout(() => {
          // Navigate to home/3D portfolio page first (if not there)
          if (window.location.pathname !== '/') {
            onNavigate('home');
            
            // Wait for navigation to complete before initiating travel
            setTimeout(() => {
              setTravelDestination(system.id);
              setTravelPhase('preparing');
            }, 300);
          } else {
            // Already on homepage, initiate travel immediately
            setTravelDestination(system.id);
            setTravelPhase('preparing');
          }
          
          // Close terminal after initiating travel
          setTimeout(() => {
            closeTerminal();
          }, 100);
        }, 300);
        return;
      } else {
        addResponseMessage(`System "${target}" not found. Type 'systems' to see all.`, true);
        return;
      }
    }

    if (command.startsWith('visit ')) {
      const target = command.substring(6).trim();
      
      // Use intelligent resolution first
      const resolved = resolveNavigationTarget(target);
      
      if (resolved && resolved.type === 'planet') {
        // Navigate to specific planet (possibly in another system)
        const system = STAR_SYSTEMS[resolved.systemId];
        const planet = system.planets.find(p => p.id === resolved.planetId);
        
        if (planet) {
          addResponseMessage(`Navigating to ${planet.name} in ${system.name}...`);
          setTimeout(() => {
            onNavigate(system.page.toLowerCase().replace(/ /g, '-'), planet.sectionId);
            
            setTimeout(() => {
              closeTerminal();
            }, 100);
          }, 500);
          return;
        }
      } else if (resolved && resolved.type === 'system') {
        // Navigate to system main page
        const system = STAR_SYSTEMS[resolved.systemId];
        addResponseMessage(`Navigating to ${system.name} system (${system.page})...`);
        setTimeout(() => {
          onNavigate(system.page.toLowerCase().replace(/ /g, '-'));
          
          setTimeout(() => {
            closeTerminal();
          }, 100);
        }, 500);
        return;
      }
      
      // Fallback: Check current system's planets
      const system = STAR_SYSTEMS[currentSystemId];
      const planet = system.planets.find(p =>
        p.name.toLowerCase().includes(target.toLowerCase()) ||
        p.id.includes(target.toLowerCase())
      );

      if (planet) {
        addResponseMessage(`Navigating to ${planet.name}...`);
        setTimeout(() => {
          onNavigate(system.page.toLowerCase().replace(/ /g, '-'), planet.sectionId);
          
          setTimeout(() => {
            closeTerminal();
          }, 100);
        }, 500);
        return;
      } else {
        addResponseMessage(`Planet or system "${target}" not found. Type 'planets' or 'systems' to see all.`, true);
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
      addResponseMessage('Returning to Alpha Centauri (Home)...');
      
      setTimeout(() => {
        // Check if we're on the 3D portfolio page
        if (window.location.pathname === '/') {
          // On 3D page - use wormhole travel if not already at alpha-centauri
          if (currentSystemId !== 'alpha-centauri') {
            setTravelDestination('alpha-centauri');
            setTravelPhase('preparing');
          }
        } else {
          // On a different page - navigate directly to About Me page
          onNavigate('about-me');
        }
        
        setTimeout(() => {
          closeTerminal();
        }, 100);
      }, 300);
      return;
    }

    // If not a recognized command, send to AI
    await handleAIQuery(cmd);
  };

  const handleAIQuery = async (query) => {
    setIsTyping(true);

    try {
      const context = {
        currentSystem: currentSystemId,
        currentPlanet: null,
        pendingNavigation: pendingNavigation
      };

      const result = await processInput(query, context);

      if (result.success) {
        // Handle navigation results
        if (result.navigation) {
          const nav = result.navigation;
          
          // Store as pending if it has a suggestion
          if (result.pendingNavigation) {
            setPendingNavigation(nav);
          }
          
          addResponseMessage(result.response);
          
          // Execute navigation if confirmed (yes response) or direct navigation
          if (result.isPendingConfirmation || result.isDirectNavigation) {
            setPendingNavigation(null); // Clear pending
            executeNavigation(nav);
          }
        } else {
          addResponseMessage(result.response);
        }
      } else {
        addResponseMessage(result.response, result.isError);
      }
    } catch (error) {
      console.error('AI Query Error:', error);
      addResponseMessage('Communication error. Please try again.', true);
    } finally {
      setIsTyping(false);
    }
  };
  
  /**
   * Execute navigation based on type
   */
  const executeNavigation = (navigation) => {
    if (!navigation || !navigation.command) {
      return;
    }
    
    // Shorter delay before executing navigation
    setTimeout(() => {
      switch (navigation.type) {
        case 'STAR_SYSTEM':
          // Inter-system wormhole travel
          if (navigation.needsWormhole) {
            // Ensure we're on homepage/3D page first
            if (window.location.pathname !== '/') {
              onNavigate('home');
              
              // Wait for navigation to complete before initiating travel
              setTimeout(() => {
                setTravelDestination(navigation.systemId);
                setTravelPhase('preparing');
              }, 300);
            } else {
              // Already on homepage, initiate travel immediately
              setTravelDestination(navigation.systemId);
              setTravelPhase('preparing');
            }
            
            // Then close terminal after initiating travel
            setTimeout(() => {
              closeTerminal();
            }, 100);
          } else {
            addResponseMessage(`Already in ${navigation.systemName} system!`);
          }
          break;
          
        case 'PLANET_SAME_SYSTEM': {
          // Direct planet navigation in same system
          const system = STAR_SYSTEMS[navigation.systemId];
          onNavigate(system.page.toLowerCase().replace(/ /g, '-'), navigation.planetId);
          
          setTimeout(() => {
            closeTerminal();
          }, 100);
          break;
        }
          
        case 'PLANET_OTHER_SYSTEM':
          // Inter-system travel then planet detail
          // First ensure we're on homepage/3D page
          if (window.location.pathname !== '/') {
            onNavigate('home');
            
            // Wait for navigation before initiating travel
            setTimeout(() => {
              setTravelDestination(navigation.systemId);
              setTravelPhase('preparing');
              sessionStorage.setItem('targetPlanet', navigation.planetId);
            }, 300);
          } else {
            // Already on homepage
            setTravelDestination(navigation.systemId);
            setTravelPhase('preparing');
            sessionStorage.setItem('targetPlanet', navigation.planetId);
          }
          
          setTimeout(() => {
            closeTerminal();
          }, 100);
          break;
          
        case 'STATIC_PAGE':
          // Direct page navigation
          onNavigate(navigation.page);
          
          setTimeout(() => {
            closeTerminal();
          }, 100);
          break;
          
        default:
          addResponseMessage('Navigation type not recognized.', true);
      }
    }, 500); // Reduced delay for user to read the message
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
            SAGITTARIUS NAVIGATION TERMINAL v1.0
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
        <div className={styles.terminalMessages} ref={messagesContainerRef}>
          {messageHistory.map((msg, index) => (
            <TerminalMessage
              key={index}
              message={msg}
              withTypewriter={false}
            />
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <span className={styles.typingText}>Sagittarius is processing</span>
              <span className={styles.loadingDots}>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
              </span>
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
