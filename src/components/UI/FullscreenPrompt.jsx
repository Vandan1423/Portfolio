import { useState } from "react";
import "./FullscreenPrompt.css";

/**
 * FullscreenPrompt Component
 *
 * Beautiful modal that prompts users to enter fullscreen mode for the best experience.
 * Features:
 * - Space-themed design with blur effects
 * - Animated entrance
 * - Fullscreen API integration
 * - Option to skip/dismiss
 */
const FullscreenPrompt = ({ onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    /**
     * Requests fullscreen mode using the Fullscreen API
     * Handles different browser prefixes for compatibility
     */
    const enterFullscreen = () => {
        const elem = document.documentElement;

        // Handle animation before entering fullscreen
        setIsExiting(true);

        setTimeout(() => {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                // Safari
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                // IE11
                elem.msRequestFullscreen();
            }

            onDismiss();
        }, 300);
    };

    /**
     * Dismisses the prompt without entering fullscreen
     */
    const skipFullscreen = () => {
        setIsExiting(true);
        setTimeout(() => {
            onDismiss();
        }, 300);
    };

    return (
        <div className={`fullscreen-prompt-overlay ${isExiting ? "exiting" : ""}`}>
            <div className={`fullscreen-prompt-container ${isExiting ? "exiting" : ""}`}>
                {/* Animated stars background */}
                <div className="stars-decoration">
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                </div>

                {/* Main content */}
                <div className="prompt-content">
                    {/* Icon */}
                    <div className="prompt-icon">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="prompt-title">
                        Welcome to the Journey
                    </h1>

                    {/* Message */}
                    <p className="prompt-message">
                        This experience is best enjoyed in{" "}
                        <span className="highlight">fullscreen mode</span>.
                    </p>
                    <p className="prompt-submessage">
                        Embark on an immersive voyage through space and explore the cosmos in its full glory.
                    </p>

                    {/* Buttons */}
                    <div className="prompt-buttons">
                        <button
                            onClick={enterFullscreen}
                            className="btn-fullscreen"
                            aria-label="Enter fullscreen mode"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            </svg>
                            Launch in Fullscreen
                        </button>
                        <button
                            onClick={skipFullscreen}
                            className="btn-skip"
                            aria-label="Continue without fullscreen"
                        >
                            Continue Without Fullscreen
                        </button>
                    </div>

                    {/* Footer hint */}
                    <p className="prompt-hint">
                        You can exit fullscreen anytime by pressing{" "}
                        <kbd>ESC</kbd>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FullscreenPrompt;
