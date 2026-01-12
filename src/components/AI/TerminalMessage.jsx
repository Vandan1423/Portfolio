/**
 * Terminal Message Component
 *
 * Displays individual messages in the terminal with different styles
 * for system messages, user commands, responses, and errors.
 */

import { useState, useEffect } from 'react';
import styles from './ARIATerminal.module.css';

export default function TerminalMessage({ message, withTypewriter = false }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!withTypewriter);

  useEffect(() => {
    if (!withTypewriter) {
      setDisplayedText(message.text);
      setIsComplete(true);
      return;
    }

    // Typewriter effect
    let currentIndex = 0;
    const text = message.text;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 30); // 30ms per character

    return () => clearInterval(interval);
  }, [message.text, withTypewriter]);

  const getMessageClass = () => {
    switch (message.type) {
      case 'system':
        return styles.systemMessage;
      case 'command':
        return styles.commandMessage;
      case 'error':
        return styles.errorMessage;
      case 'response':
      default:
        return styles.responseMessage;
    }
  };

  // Highlight commands in brackets with cyan color
  const formatText = (text) => {
    // Replace [CMD]text[/CMD] with styled spans
    const parts = text.split(/(\[CMD\].*?\[\/CMD\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('[CMD]')) {
        const commandText = part.replace(/\[CMD\]|\[\/CMD\]/g, '');
        return (
          <span key={index} className={styles.highlightedCommand}>
            {commandText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`${styles.terminalMessage} ${getMessageClass()}`}>
      <div className={styles.messageText}>
        {formatText(displayedText)}
        {!isComplete && <span className={styles.typingCursor}>█</span>}
      </div>
    </div>
  );
}
