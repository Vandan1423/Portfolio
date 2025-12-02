import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * HolographicTerminal Component
 *
 * Interactive terminal screen in the cockpit dashboard
 * Features:
 * - Word-by-word typing animation
 * - User input capability
 * - Keyboard and mouse interaction
 * - Futuristic terminal styling
 * - Will support navigation commands later
 */
const HolographicTerminal = ({ position = [0, 0, -2], onCommand }) => {
    const screenRef = useRef();
    const [terminalLines, setTerminalLines] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    // Initial boot sequence messages
    const bootSequence = [
        "INITIALIZING NAVIGATION SYSTEM...",
        "LOADING QUANTUM DRIVE PROTOCOLS...",
        "ESTABLISHING NEURAL LINK...",
        "CALIBRATING WARP COORDINATES...",
        "SYSTEMS ONLINE",
        "",
        "WELCOME, CAPTAIN VANDAN",
        "",
        "Type 'help' for available commands",
        "Type 'launch' to begin your journey",
        "",
    ];

    // Typing animation effect
    useEffect(() => {
        let lineIndex = 0;
        let wordIndex = 0;
        let currentLine = "";

        const typeNextWord = () => {
            if (lineIndex >= bootSequence.length) {
                setIsTyping(false);
                return;
            }

            const line = bootSequence[lineIndex];

            // Handle empty lines
            if (line === "") {
                setTerminalLines((prev) => [...prev, ""]);
                lineIndex++;
                setTimeout(typeNextWord, 100);
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
                setTimeout(typeNextWord, 150); // Delay between words
            } else {
                // Move to next line
                lineIndex++;
                wordIndex = 0;
                currentLine = "";
                setTimeout(typeNextWord, 300); // Delay between lines
            }
        };

        setIsTyping(true);
        const timeout = setTimeout(typeNextWord, 500); // Initial delay

        return () => clearTimeout(timeout);
    }, []);

    // Cursor blink effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Animate screen glow
    useFrame((state) => {
        if (screenRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
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

    // Process commands
    const handleCommand = (cmd) => {
        const command = cmd.toLowerCase().trim();

        // Add user input to terminal
        setTerminalLines((prev) => [...prev, `> ${cmd}`, ""]);

        // Command processing (will expand this later for navigation)
        if (command === "help") {
            setTerminalLines((prev) => [
                ...prev,
                "AVAILABLE COMMANDS:",
                "  launch    - Initiate launch sequence",
                "  navigate  - Open navigation menu",
                "  status    - System status report",
                "  clear     - Clear terminal",
                "  help      - Show this message",
                "",
            ]);
        } else if (command === "launch") {
            setTerminalLines((prev) => [
                ...prev,
                "INITIATING LAUNCH SEQUENCE...",
                "COUNTDOWN: 3... 2... 1...",
                "IGNITION!",
                "",
            ]);
            // Call parent callback for launch
            if (onCommand) {
                setTimeout(() => onCommand("launch"), 2000);
            }
        } else if (command === "navigate") {
            setTerminalLines((prev) => [
                ...prev,
                "NAVIGATION SYSTEM LOADING...",
                "(Navigation menu will appear here)",
                "",
            ]);
            if (onCommand) {
                onCommand("navigate");
            }
        } else if (command === "status") {
            setTerminalLines((prev) => [
                ...prev,
                "SYSTEM STATUS:",
                "  Fuel: 100%",
                "  Shields: ONLINE",
                "  Engines: READY",
                "  Navigation: STANDBY",
                "",
            ]);
        } else if (command === "clear") {
            setTerminalLines([]);
        } else if (command === "") {
            // Empty command, just add blank line
            setTerminalLines((prev) => [...prev]);
        } else {
            setTerminalLines((prev) => [
                ...prev,
                `Command not recognized: ${cmd}`,
                "Type 'help' for available commands",
                "",
            ]);
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
                    width: "600px",
                    height: "360px",
                    pointerEvents: "auto",
                }}
            >
                <div
                    className="terminal-container"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(10, 25, 47, 0.98)",
                        border: "1px solid rgba(0, 255, 136, 0.3)",
                        borderRadius: "4px",
                        padding: "16px",
                        fontFamily: '"Courier New", monospace',
                        fontSize: "14px",
                        color: "#00ff88",
                        overflow: "auto",
                        boxShadow:
                            "0 0 30px rgba(0, 255, 136, 0.2), inset 0 0 20px rgba(0, 255, 136, 0.05)",
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
                                    textShadow:
                                        "0 0 5px rgba(0, 255, 136, 0.8)",
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
                                    onChange={(e) =>
                                        setCurrentInput(e.target.value)
                                    }
                                    onKeyDown={handleKeyPress}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                    style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        outline: "none",
                                        color: "#00ff88",
                                        fontFamily: "inherit",
                                        fontSize: "inherit",
                                        textShadow:
                                            "0 0 5px rgba(0, 255, 136, 0.8)",
                                        caretColor: "transparent",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        left: `${currentInput.length * 8.4}px`,
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
                            <span
                                style={{
                                    opacity: cursorVisible ? 1 : 0,
                                }}
                            >
                                █
                            </span>
                        </div>
                    )}
                </div>
            </Html>

            {/* Screen glow light - subtle */}
            <pointLight
                position={[0, 0, 0.5]}
                color="#00ff88"
                intensity={0.8}
                distance={2}
            />
        </group>
    );
};

export default HolographicTerminal;
