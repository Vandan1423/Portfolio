import { motion } from "framer-motion";
/**
 * SystemMap Component
 *
 * Visual 2D representation of the star system
 * Shows sun in center with planets at relative orbital distances
 *
 * Features:
 * - Central sun
 * - Planets positioned at scaled orbital distances
 * - Clickable planet nodes (opens planet detail view)
 * - Planet labels and section names
 * - Highlighted selected planet
 *
 * Props:
 * @param {array} planets - Array of planet data with orbitRadius
 * @param {object} selectedPlanet - Currently selected planet
 * @param {function} onPlanetClick - Callback when planet is clicked
 */
const SystemMap = ({ planets = [], selectedPlanet, onPlanetClick }) => {
    // Scale factor to fit planets in the display area (350x350px)
    const scale = 2.5;
    const centerX = 175;
    const centerY = 175;

    const handlePlanetClick = (planet) => {
        console.log("SystemMap: Clicking planet", planet.name);
        if (onPlanetClick) {
            onPlanetClick(planet);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {/* Map Container */}
            <div className="relative w-[350px] h-[350px] mx-auto bg-[rgba(0,20,40,0.5)] border-2 border-cyan-400/30 rounded-lg overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern
                                id="grid"
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 20 0 L 0 0 0 20"
                                    fill="none"
                                    stroke="rgba(0,255,255,0.2)"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Central Sun */}
                <div
                    className="absolute w-6 h-6 rounded-full bg-[#ffaa00] shadow-[0_0_20px_rgba(255,170,0,0.8)]"
                    style={{
                        left: `${centerX - 12}px`,
                        top: `${centerY - 12}px`,
                    }}
                >
                    <div className="absolute inset-0 rounded-full bg-[#ffaa00] animate-pulse opacity-50"></div>
                </div>

                {/* Orbit Rings */}
                {planets.map((planet, index) => {
                    const radius = planet.orbitRadius / scale;
                    return (
                        <svg
                            key={`orbit-${index}`}
                            className="absolute inset-0 pointer-events-none"
                            style={{ overflow: "visible" }}
                        >
                            <circle
                                cx={centerX}
                                cy={centerY}
                                r={radius}
                                fill="none"
                                stroke={planet.orbitColor || "#00ffff"}
                                strokeWidth="1"
                                strokeOpacity="0.3"
                                strokeDasharray="4 4"
                            />
                        </svg>
                    );
                })}

                {/* Planets */}
                {planets.map((planet, index) => {
                    const radius = planet.orbitRadius / scale;
                    // Position planets at different angles for visual spacing
                    const angle = index * (Math.PI / 2.5);
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    const isSelected =
                        selectedPlanet && selectedPlanet.name === planet.name;

                    return (
                        <motion.div
                            key={planet.name}
                            className="absolute cursor-pointer group"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                transform: "translate(-50%, -50%)",
                            }}
                            onClick={() => handlePlanetClick(planet)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Planet Node */}
                            <div
                                className={`w-4 h-4 rounded-full transition-all ${
                                    isSelected
                                        ? "shadow-[0_0_15px_rgba(0,255,255,0.8)]"
                                        : "group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                                }`}
                                style={{
                                    backgroundColor: isSelected
                                        ? planet.orbitColor
                                        : `${planet.orbitColor}80`,
                                    border: `2px solid ${planet.orbitColor}`,
                                }}
                            >
                                {isSelected && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            borderColor: planet.orbitColor,
                                        }}
                                        animate={{
                                            boxShadow: [
                                                `0 0 0 0 ${planet.orbitColor}80`,
                                                `0 0 0 8px ${planet.orbitColor}00`,
                                            ],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                        }}
                                    ></motion.div>
                                )}
                            </div>

                            {/* Planet Label */}
                            <div
                                className={`absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                                ${
                                    isSelected
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }
                                transition-opacity bg-black/90 px-2 py-1 rounded border`}
                                style={{
                                    borderColor: `${planet.orbitColor}50`,
                                }}
                            >
                                <p
                                    className="text-xs font-mono font-bold"
                                    style={{ color: planet.orbitColor }}
                                >
                                    {planet.name}
                                </p>
                                <p className="text-cyan-400/60 text-[10px] font-mono">
                                    {planet.section}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50"></div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded">
                <p className="text-cyan-400 font-mono text-xs font-bold mb-2">
                    SYSTEM LEGEND
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {planets.map((planet) => (
                        <div
                            key={planet.name}
                            className="flex items-center space-x-2 text-[10px] font-mono cursor-pointer hover:bg-cyan-500/10 p-1 rounded transition-colors"
                            onClick={() => handlePlanetClick(planet)}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: planet.orbitColor,
                                    boxShadow: `0 0 5px ${planet.orbitColor}80`,
                                }}
                            ></div>
                            <span className="text-cyan-400/70 truncate">
                                {planet.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-3 text-center">
                <p className="text-cyan-400/50 font-mono text-xs">
                    Click on a planet to analyze
                </p>
            </div>
        </motion.div>
    );
};

export default SystemMap;
