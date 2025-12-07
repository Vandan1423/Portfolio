import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SystemMap from "./SystemMap";
import PlanetList from "./PlanetList";

/**
 * NavigationScreen Component
 *
 * Futuristic cyberpunk-style HUD dashboard
 * Inspired by sci-fi interfaces with angular shapes and holographic effects
 *
 * Features:
 * - Angular geometric design with cut corners
 * - Animated scan lines and glitch effects
 * - Glowing cyan/blue accents
 * - Holographic panel overlays
 * - Tech-style grid patterns
 *
 * Props:
 * @param {boolean} isVisible - Controls visibility of the navigation screen
 * @param {function} onClose - Callback when screen is closed
 * @param {function} onPlanetSelect - Callback when a planet is selected (opens planet detail)
 * @param {object} selectedPlanet - Currently selected planet object (unused, kept for compatibility)
 * @param {array} planets - Array of planet data
 */
const NavigationScreen = ({
    isVisible,
    onClose,
    onPlanetSelect,
    selectedPlanet,
    planets = [],
}) => {
    const [currentView, setCurrentView] = useState("main-menu");
    // Views: 'main-menu', 'planet-list', 'system-map', 'system-travel'

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleBack = () => {
        setCurrentView("main-menu");
    };

    // Handle planet click - this opens the planet detail scene
    const handlePlanetClick = (planet) => {
        console.log("NavigationScreen: Planet clicked", planet.name);
        if (onPlanetSelect) {
            onPlanetSelect(planet);
        }
    };

    // Reset view when navigation closes
    const handleClose = () => {
        setCurrentView("main-menu");
        onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 pointer-events-auto bg-black/60"
                        onClick={handleClose}
                    ></motion.div>

                    {/* Centered Floating Panel */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0, x: "-50%" }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed left-1/2 top-1/2 -translate-y-1/2 w-[600px] max-h-[85vh] z-50 pointer-events-auto px-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main Container with Angular Design */}
                        <div className="relative h-full">
                            {/* Animated Background Grid */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(to right, rgba(0,255,255,0.3) 1px, transparent 1px),
                                            linear-gradient(to bottom, rgba(0,255,255,0.3) 1px, transparent 1px)
                                        `,
                                        backgroundSize: "20px 20px",
                                    }}
                                ></div>
                            </div>

                            {/* Scan Line Animation */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <motion.div
                                    className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
                                    animate={{ y: [0, 800] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                ></motion.div>
                            </div>

                            {/* Angular Frame with Cut Corners */}
                            <div
                                className="relative h-full bg-gradient-to-br from-[rgba(5,15,35,0.98)] via-[rgba(10,20,40,0.95)] to-[rgba(5,10,25,0.98)]"
                                style={{
                                    clipPath:
                                        "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                                    boxShadow: `
                                        0 0 40px rgba(0,255,255,0.3),
                                        inset 0 0 60px rgba(0,100,150,0.1)
                                    `,
                                }}
                            >
                                {/* Corner Accents */}
                                <div
                                    className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-400 opacity-60"
                                    style={{ margin: "10px" }}
                                ></div>
                                <div
                                    className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-400 opacity-60"
                                    style={{ margin: "10px" }}
                                ></div>

                                {/* Animated Corner Lines */}
                                <svg
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    style={{
                                        filter: "drop-shadow(0 0 4px cyan)",
                                    }}
                                >
                                    <motion.path
                                        d="M 30 0 L 0 30 L 0 100"
                                        stroke="rgba(0,255,255,0.6)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                    <motion.path
                                        d="M 450 620 L 420 650 L 350 650"
                                        stroke="rgba(0,255,255,0.6)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                    />
                                </svg>

                                {/* Header Section */}
                                <div className="relative p-8 pt-12 border-b-2 border-cyan-500/30">
                                    {/* Tech Pattern Background */}
                                    <div
                                        className="absolute top-0 right-0 w-32 h-full opacity-10"
                                        style={{
                                            backgroundImage:
                                                "repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)",
                                        }}
                                    ></div>

                                    {/* Title with Holographic Effect */}
                                    <div className="relative flex justify-between items-center">
                                        <div>
                                            <h2
                                                className="text-3xl font-bold text-cyan-400 font-mono tracking-widest uppercase"
                                                style={{
                                                    textShadow: `
                                                        0 0 10px rgba(0,255,255,0.8),
                                                        0 0 20px rgba(0,255,255,0.4),
                                                        0 0 30px rgba(0,255,255,0.2)
                                                    `,
                                                }}
                                            >
                                                DASHBOARD
                                            </h2>
                                            <motion.div
                                                className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent mt-2"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.3,
                                                }}
                                            ></motion.div>
                                        </div>

                                        {/* Close Button with Tech Frame */}
                                        <button
                                            onClick={handleClose}
                                            className="relative group"
                                            aria-label="Close Navigation"
                                        >
                                            <div className="w-10 h-10 border-2 border-cyan-400 flex items-center justify-center transform rotate-45 transition-all group-hover:border-red-400 group-hover:scale-110">
                                                <span
                                                    className="text-cyan-400 font-bold text-xl transform -rotate-45 group-hover:text-red-400"
                                                    style={{
                                                        textShadow:
                                                            "0 0 10px currentColor",
                                                    }}
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Subtitle/Status */}
                                    <div className="mt-4 flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
                                        <p className="text-cyan-300/70 text-sm font-mono uppercase tracking-wider">
                                            {currentView === "main-menu" &&
                                                "System Online"}
                                            {currentView === "planet-list" &&
                                                "Sector Navigation"}
                                            {currentView === "system-map" &&
                                                "Tactical Overview"}
                                            {currentView === "system-travel" &&
                                                "Warp Protocol"}
                                        </p>
                                    </div>

                                    {/* Decorative Tech Elements */}
                                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                                </div>

                                {/* Content Area */}
                                <div
                                    className="relative p-6 max-h-[50vh] overflow-y-auto"
                                    style={{
                                        scrollbarWidth: "thin",
                                        scrollbarColor:
                                            "rgba(0,255,255,0.5) transparent",
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {currentView === "main-menu" && (
                                            <MainMenu
                                                key="main-menu"
                                                onViewChange={handleViewChange}
                                            />
                                        )}
                                        {currentView === "planet-list" && (
                                            <PlanetList
                                                key="planet-list"
                                                planets={planets}
                                                selectedPlanet={null}
                                                onPlanetClick={
                                                    handlePlanetClick
                                                }
                                            />
                                        )}
                                        {currentView === "system-map" && (
                                            <SystemMap
                                                key="system-map"
                                                planets={planets}
                                                selectedPlanet={null}
                                                onPlanetClick={
                                                    handlePlanetClick
                                                }
                                            />
                                        )}
                                        {currentView === "system-travel" && (
                                            <div key="system-travel">
                                                <div className="text-center py-8">
                                                    <div className="text-cyan-400 text-xl font-mono mb-4">
                                                        COMING SOON
                                                    </div>
                                                    <p className="text-cyan-400/70 font-mono text-sm">
                                                        Inter-System Travel
                                                    </p>
                                                    <p className="text-cyan-400/50 font-mono text-xs mt-4">
                                                        This feature will allow
                                                        you to travel to
                                                        different star systems
                                                        via wormhole.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Footer - Back Button */}
                                {currentView !== "main-menu" && (
                                    <div className="relative p-4 border-t-2 border-cyan-500/30">
                                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                                        <button
                                            onClick={handleBack}
                                            className="relative w-full py-3 px-4 group overflow-hidden"
                                            style={{
                                                clipPath:
                                                    "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-400/50 transition-all group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"></div>
                                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/10 transition-all duration-300"></div>
                                            <span
                                                className="relative text-cyan-400 font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 group-hover:text-cyan-300"
                                                style={{
                                                    textShadow:
                                                        "0 0 10px rgba(0,255,255,0.5)",
                                                }}
                                            >
                                                <span className="text-lg">
                                                    ←
                                                </span>
                                                <span>RETURN</span>
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * MainMenu Component
 * Cyberpunk-styled navigation cards with angular design
 */
const MainMenu = ({ onViewChange }) => {
    const menuOptions = [
        {
            id: "planet-list",
            title: "LOCAL SECTOR",
            code: "A1",
            description: "Navigate current star system",
            available: true,
            color: "cyan",
        },
        {
            id: "system-map",
            title: "TACTICAL MAP",
            code: "A3",
            description: "System overview & coordinates",
            available: true,
            color: "blue",
        },
        {
            id: "system-travel",
            title: "WARP DRIVE",
            code: "A2",
            description: "Inter-system navigation",
            available: false,
            badge: "LOCKED",
            color: "purple",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            {menuOptions.map((option, index) => (
                <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 100,
                    }}
                    onClick={() => option.available && onViewChange(option.id)}
                    disabled={!option.available}
                    className={`w-full relative group ${
                        !option.available && "opacity-60 cursor-not-allowed"
                    }`}
                >
                    {/* Angular Container */}
                    <div
                        className="relative overflow-hidden"
                        style={{
                            clipPath:
                                "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                    >
                        <div
                            className={`p-5 border-2 transition-all duration-300 ${
                                option.available
                                    ? `border-cyan-400/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]`
                                    : "border-gray-600/30"
                            }`}
                            style={{
                                background: option.available
                                    ? `linear-gradient(135deg, rgba(0,50,80,0.3) 0%, rgba(0,20,40,0.1) 100%)`
                                    : "rgba(20,20,20,0.2)",
                                borderColor: option.available
                                    ? "rgba(0,255,255,0.4)"
                                    : "rgba(100,100,100,0.3)",
                            }}
                        >
                            {/* Tech Corner Accent */}
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/30"></div>

                            {/* Hover Scan Line */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0"
                                initial={{ y: "-100%" }}
                                whileHover={
                                    option.available
                                        ? {
                                              y: "100%",
                                              transition: {
                                                  duration: 0.6,
                                                  ease: "linear",
                                              },
                                          }
                                        : {}
                                }
                            ></motion.div>

                            <div className="relative flex items-center space-x-4">
                                {/* Code Label */}
                                <div
                                    className="flex-shrink-0 w-16 h-16 border-2 border-cyan-400/50 flex items-center justify-center"
                                    style={{
                                        clipPath:
                                            "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                                        background: "rgba(0,255,255,0.1)",
                                    }}
                                >
                                    <span
                                        className={`text-2xl font-bold font-mono ${
                                            option.available
                                                ? "text-cyan-400"
                                                : "text-gray-500"
                                        }`}
                                        style={{
                                            textShadow: option.available
                                                ? "0 0 10px rgba(0,255,255,0.8)"
                                                : "none",
                                        }}
                                    >
                                        {option.code}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 text-left">
                                    <h3
                                        className={`font-mono text-lg font-bold uppercase tracking-wider ${
                                            option.available
                                                ? "text-cyan-300"
                                                : "text-gray-500"
                                        }`}
                                        style={{
                                            textShadow: option.available
                                                ? "0 0 10px rgba(0,255,255,0.5)"
                                                : "none",
                                        }}
                                    >
                                        {option.title}
                                    </h3>
                                    <p
                                        className={`font-mono text-xs mt-1 ${
                                            option.available
                                                ? "text-cyan-400/60"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {option.description}
                                    </p>
                                </div>

                                {/* Badge */}
                                {option.badge && (
                                    <div
                                        className="absolute top-2 right-2 px-2 py-1 border border-yellow-500/50 text-[10px] font-mono font-bold text-yellow-400 bg-yellow-900/20"
                                        style={{
                                            clipPath:
                                                "polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)",
                                        }}
                                    >
                                        {option.badge}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Accent Line */}
                            {option.available && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}
                        </div>
                    </div>

                    {/* Glow Effect on Hover */}
                    {option.available && (
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-all duration-300 pointer-events-none"></div>
                    )}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default NavigationScreen;
