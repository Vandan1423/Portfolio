import { motion } from "framer-motion";

/**
 * PlanetList Component
 *
 * Displays all planets in the current star system with cyberpunk styling
 * Each planet is clickable and opens the planet detail view
 *
 * Props:
 * @param {array} planets - Array of planet objects
 * @param {function} onPlanetClick - Callback when planet is clicked (opens detail view)
 * @param {object} selectedPlanet - Currently selected planet (for visual indication)
 */
const PlanetList = ({ planets = [], onPlanetClick, selectedPlanet }) => {
    const handlePlanetClick = (planet) => {
        console.log("PlanetList: Clicking planet", planet.name);
        if (onPlanetClick) {
            onPlanetClick(planet);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
        >
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-cyan-500/30">
                <h3 className="text-cyan-300 font-mono text-sm uppercase tracking-widest">
                    Available Destinations
                </h3>
                <p className="text-cyan-400/50 font-mono text-xs mt-1">
                    Select a planet to view detailed information
                </p>
            </div>

            {/* Planet List */}
            {planets.map((planet, index) => (
                <motion.button
                    key={planet.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handlePlanetClick(planet)}
                    className="w-full relative group"
                >
                    {/* Angular Container */}
                    <div
                        className="relative overflow-hidden"
                        style={{
                            clipPath:
                                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        }}
                    >
                        {/* Background */}
                        <div
                            className="p-4 border-2 transition-all duration-300"
                            style={{
                                background: `linear-gradient(135deg, rgba(0,40,60,0.3) 0%, rgba(0,15,30,0.1) 100%)`,
                                borderColor:
                                    selectedPlanet?.name === planet.name
                                        ? planet.orbitColor
                                        : "rgba(0,255,255,0.3)",
                                boxShadow:
                                    selectedPlanet?.name === planet.name
                                        ? `0 0 20px ${planet.orbitColor}40`
                                        : "none",
                            }}
                        >
                            {/* Hover Scan Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{
                                    x: "100%",
                                    transition: {
                                        duration: 0.5,
                                        ease: "linear",
                                    },
                                }}
                            ></motion.div>

                            <div className="relative flex items-center space-x-4">
                                {/* Planet Indicator */}
                                <div className="flex-shrink-0">
                                    <div
                                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative"
                                        style={{
                                            borderColor: planet.orbitColor,
                                            background: `radial-gradient(circle, ${planet.orbitColor}20 0%, transparent 70%)`,
                                        }}
                                    >
                                        {/* Pulsing Ring for Selected */}
                                        {selectedPlanet?.name ===
                                            planet.name && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2"
                                                style={{
                                                    borderColor:
                                                        planet.orbitColor,
                                                }}
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [1, 0, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                            ></motion.div>
                                        )}

                                        {/* Planet Icon/Dot */}
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    planet.orbitColor,
                                                boxShadow: `0 0 15px ${planet.orbitColor}`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Planet Info */}
                                <div className="flex-1 text-left">
                                    <h4
                                        className="text-lg font-bold font-mono uppercase tracking-wide text-cyan-300
                                        group-hover:text-cyan-200 transition-colors"
                                        style={{
                                            textShadow:
                                                "0 0 10px rgba(0,255,255,0.5)",
                                        }}
                                    >
                                        {planet.name}
                                    </h4>
                                    <p className="text-xs font-mono text-cyan-400/70 mt-1">
                                        {planet.section}
                                    </p>

                                    {/* Distance/Stats */}
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="text-[10px] font-mono text-cyan-500/60">
                                            ORBIT: {planet.orbitRadius} AU
                                        </span>
                                        <div
                                            className="w-1 h-1 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    planet.orbitColor,
                                            }}
                                        ></div>
                                        <span className="text-[10px] font-mono text-cyan-500/60">
                                            SECTOR{" "}
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow Indicator */}
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-8 h-8 border-2 border-cyan-400/50 flex items-center justify-center
                                        transform rotate-45 group-hover:border-cyan-300 group-hover:scale-110 transition-all"
                                        whileHover={{ rotate: 45 }}
                                    >
                                        <span
                                            className="text-cyan-400 transform -rotate-45 group-hover:text-cyan-300"
                                            style={{
                                                textShadow:
                                                    "0 0 10px currentColor",
                                            }}
                                        >
                                            →
                                        </span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div
                                className="absolute bottom-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{
                                    background: `linear-gradient(to right, transparent, ${planet.orbitColor}, transparent)`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Glow on Hover */}
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-all duration-300 pointer-events-none rounded"></div>
                </motion.button>
            ))}

            {/* Empty State */}
            {planets.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-cyan-400/50 font-mono text-sm">
                        No planets detected in this system
                    </p>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-4 pt-3 border-t border-cyan-500/20">
                <p className="text-cyan-400/40 font-mono text-[10px] text-center">
                    Click on any planet to enter detailed analysis mode
                </p>
            </div>
        </motion.div>
    );
};

export default PlanetList;
