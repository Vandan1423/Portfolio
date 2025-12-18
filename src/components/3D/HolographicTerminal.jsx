import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

// Terminal styling constants
const TERMINAL_COLOR = "#00ff88";
const TERMINAL_BG = "rgba(10, 25, 47, 0.98)";
const TERMINAL_BORDER = "rgba(0, 255, 136, 0.3)";
const TERMINAL_SHADOW_GLOW = "0 0 30px rgba(0, 255, 136, 0.2), inset 0 0 20px rgba(0, 255, 136, 0.05)";
const TEXT_SHADOW = "0 0 5px rgba(0, 255, 136, 0.8)";

// Terminal dimensions
const TERMINAL_WIDTH = "600px";
const TERMINAL_HEIGHT = "360px";
const TERMINAL_FONT_SIZE = "14px";

// Animation timing constants
const TYPING_WORD_DELAY = 150;
const TYPING_LINE_DELAY = 300;
const TYPING_EMPTY_LINE_DELAY = 100;
const TYPING_INITIAL_DELAY = 500;
const CURSOR_BLINK_INTERVAL = 500;
const COUNTDOWN_INTERVAL = 1000;
const LAUNCH_DELAY = 500;

// Screen glow animation
const GLOW_PULSE_SPEED = 2;
const GLOW_PULSE_INTENSITY_MIN = 0.9;
const GLOW_PULSE_AMPLITUDE = 0.1;

// Cursor positioning (character width approximation)
const CURSOR_CHAR_WIDTH = 8.4;

// Initial boot sequence messages
const BOOT_SEQUENCE = [
    "INITIALIZING NAVIGATION SYSTEM...",
    "LOADING QUANTUM DRIVE PROTOCOLS...",
    "ESTABLISHING NEURAL LINK...",
    "CALIBRATING WARP COORDINATES...",
    "SYSTEMS ONLINE",
    "",
    "WELCOME, CAPTAIN",
    "",
    "Type 'clear' to clear the screen",
    "Type 'status' for getting status of the spacecraft",
    "Type 'launch' to begin your journey",
    "",
];

/**
 * HolographicTerminal Component
 *
 * Interactive terminal screen in the cockpit dashboard
 * Features word-by-word typing animation, user input, and command processing
 *
 * @param {array} position - 3D position [x, y, z]
 * @param {function} onCommand - Callback for processing commands
 */
const HolographicTerminal = ({ position = [0, 0, -2], onCommand }) => {
    const screenRef = useRef();
    const [terminalLines, setTerminalLines] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    // Typing animation effect for boot sequence
    useEffect(() => {
        let lineIndex = 0;
        let wordIndex = 0;
        let currentLine = "";

        const typeNextWord = () => {
            if (lineIndex >= BOOT_SEQUENCE.length) {
                setIsTyping(false);
                return;
            }

            const line = BOOT_SEQUENCE[lineIndex];

            // Handle empty lines
            if (line === "") {
                setTerminalLines((prev) => [...prev, ""]);
                lineIndex++;
                setTimeout(typeNextWord, TYPING_EMPTY_LINE_DELAY);
                return;
            }

            const words = line.split(" ");

            if (wordIndex < words.length) {
                currentLine += (wordIndex > 0 ? " " : "") + words[wordIndex];
                setTerminalLines((prev) => {
                    const newLines = [...prev];
                    newLines[lineIndex] = currentLine;
                    return newLines;
                });
                wordIndex++;
                setTimeout(typeNextWord, TYPING_WORD_DELAY);
            } else {
                // Move to next line
                lineIndex++;
                wordIndex = 0;
                currentLine = "";
                setTimeout(typeNextWord, TYPING_LINE_DELAY);
            }
        };

        setIsTyping(true);
        const timeout = setTimeout(typeNextWord, TYPING_INITIAL_DELAY);

        return () => clearTimeout(timeout);
    }, []);

    // Cursor blink effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, CURSOR_BLINK_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Animate screen glow pulse
    useFrame((state) => {
        if (screenRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * GLOW_PULSE_SPEED) * GLOW_PULSE_AMPLITUDE + GLOW_PULSE_INTENSITY_MIN;
            screenRef.current.material.emissiveIntensity = pulse;
        }
    });

    // Handle user input
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleCommand(currentInput);
            setCurrentInput("");
        } else if (e.key === "Backspace") {
            setCurrentInput((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1) {
            setCurrentInput((prev) => prev + e.key);
        }
    };

    // Add lines to terminal output
    const addTerminalLines = (...lines) => {
        setTerminalLines((prev) => [...prev, ...lines]);
    };

    // Process commands
    const handleCommand = (cmd) => {
        const command = cmd.toLowerCase().trim();

        // Add user input to terminal
        addTerminalLines(`> ${cmd}`, "");

        // Handle empty command
        if (command === "") return;

        // Command processing
        switch (command) {
            case "launch": {
                addTerminalLines("INITIATING LAUNCH SEQUENCE...", "");

                // Play countdown audio
                const audio = new Audio("/sound/Countdown.mp3");
                audio.play().catch((err) => console.log("Audio play failed:", err));

                // Animated countdown
                let countdown = 3;
                const countdownInterval = setInterval(() => {
                    if (countdown > 0) {
                        setTerminalLines((prev) => {
                            const newLines = [...prev];
                            newLines[newLines.length - 1] = `COUNTDOWN: ${countdown}...`;
                            return newLines;
                        });
                        countdown--;
                    } else {
                        setTerminalLines((prev) => {
                            const newLines = [...prev];
                            newLines[newLines.length - 1] = "COUNTDOWN: GO!";
                            return newLines;
                        });
                        clearInterval(countdownInterval);

                        // Call parent callback for launch
                        if (onCommand) {
                            setTimeout(() => onCommand("launch"), LAUNCH_DELAY);
                        }
                    }
                }, COUNTDOWN_INTERVAL);
                break;
            }

            case "status":
                addTerminalLines(
                    "SYSTEM STATUS:",
                    "  Fuel: 100%",
                    "  Shields: ONLINE",
                    "  Engines: READY",
                    "  Navigation: STANDBY",
                    ""
                );
                break;

            case "clear":
                setTerminalLines([]);
                break;

            default:
                addTerminalLines(`Command not recognized: ${cmd}`, "");
        }
    };

    return (
        <group position={position}>
            {/* Terminal interface (HTML overlay) */}
            <Html
                transform
                distanceFactor={1}
                position={[0, 0, 0.01]}
                style={{
                    width: TERMINAL_WIDTH,
                    height: TERMINAL_HEIGHT,
                    pointerEvents: "auto",
                }}
            >
                <div
                    className="terminal-container"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: TERMINAL_BG,
                        border: `1px solid ${TERMINAL_BORDER}`,
                        borderRadius: "4px",
                        padding: "16px",
                        fontFamily: '"Courier New", monospace',
                        fontSize: TERMINAL_FONT_SIZE,
                        color: TERMINAL_COLOR,
                        overflow: "auto",
                        boxShadow: TERMINAL_SHADOW_GLOW,
                        cursor: "text",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("terminal-input")?.focus();
                    }}
                >
                    {/* Terminal output */}
                    <div style={{ marginBottom: "8px" }}>
                        {terminalLines.map((line, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: "4px",
                                    textShadow: TEXT_SHADOW,
                                }}
                            >
                                {line}
                            </div>
                        ))}
                    </div>

                    {/* Input line */}
                    {!isTyping && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ marginRight: "8px" }}>{">"}</span>
                            <div style={{ position: "relative", flex: 1 }}>
                                <input
                                    id="terminal-input"
                                    type="text"
                                    value={currentInput}
                                    onChange={(e) => setCurrentInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                    style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        outline: "none",
                                        color: TERMINAL_COLOR,
                                        fontFamily: "inherit",
                                        fontSize: "inherit",
                                        textShadow: TEXT_SHADOW,
                                        caretColor: "transparent",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        left: `${currentInput.length * CURSOR_CHAR_WIDTH}px`,
                                        top: "0",
                                        opacity: cursorVisible ? 1 : 0,
                                        pointerEvents: "none",
                                    }}
                                >
                                    █
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ marginRight: "8px" }}>{">"}</span>
                            <span style={{ opacity: cursorVisible ? 1 : 0 }}>█</span>
                        </div>
                    )}
                </div>
            </Html>

            {/* Screen glow light */}
            <pointLight
                position={[0, 0, 0.5]}
                color={TERMINAL_COLOR}
                intensity={0.8}
                distance={2}
            />
        </group>
    );
};

export default HolographicTerminal;
