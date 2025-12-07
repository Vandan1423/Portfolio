import { motion } from "framer-motion";

/**
 * PlanetInfoPanel Component
 *
 * Cyberpunk/Space themed information panel displayed when viewing a planet
 * Now with proper padding between content and border
 *
 * Props:
 * @param {object} planetData - Data for the selected planet section
 * @param {string} planetColor - Color theme for the planet
 * @param {function} onBack - Callback to return to solar system
 */
const PlanetInfoPanel = ({ planetData, planetColor = "#00ffff", onBack }) => {
    if (!planetData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 w-[550px]"
        >
            {/* Main Panel Container */}
            <div
                className="relative bg-black/85 backdrop-blur-md border-2"
                style={{
                    borderColor: `${planetColor}60`,
                    clipPath:
                        "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                    boxShadow: `
                        0 0 30px ${planetColor}30,
                        inset 0 0 30px ${planetColor}10
                    `,
                }}
            >
                {/* Corner Accents - inside padding area */}
                <div
                    className="absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2"
                    style={{ borderColor: `${planetColor}80` }}
                />
                <div
                    className="absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2"
                    style={{ borderColor: `${planetColor}80` }}
                />

                {/* Scan Line Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none p-4">
                    <motion.div
                        className="w-full h-0.5"
                        style={{ backgroundColor: `${planetColor}40` }}
                        animate={{ y: [0, 500, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>

                {/* Grid Pattern Background */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, ${planetColor} 1px, transparent 1px),
                            linear-gradient(to bottom, ${planetColor} 1px, transparent 1px)
                        `,
                        backgroundSize: "15px 15px",
                    }}
                />

                {/* Content with INCREASED PADDING */}
                <div className="relative" style={{ padding: "25px" }}>
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-cyan-500/30">
                        {/* Section Label */}
                        <div className="flex items-center space-x-2 mb-2">
                            <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                    backgroundColor: planetColor,
                                    boxShadow: `0 0 10px ${planetColor}`,
                                }}
                            />
                            <span className="text-cyan-400/70 font-mono text-xs tracking-[0.2em] uppercase">
                                Section Data
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            className="text-2xl font-bold font-mono tracking-wide"
                            style={{
                                color: planetColor,
                                textShadow: `0 0 20px ${planetColor}80`,
                            }}
                        >
                            {planetData.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-cyan-300/60 font-mono text-sm mt-1">
                            {planetData.subtitle}
                        </p>

                        {/* Animated underline */}
                        <motion.div
                            className="h-0.5 mt-3"
                            style={{
                                background: `linear-gradient(to right, ${planetColor}, transparent)`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>

                    {/* Scrollable Content Area */}
                    <div
                        className="max-h-[380px] overflow-y-auto pr-3 space-y-5"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: `${planetColor}50 transparent`,
                        }}
                    >
                        {/* Description */}
                        <div>
                            <p className="text-gray-300 text-sm leading-relaxed font-light">
                                {planetData.description}
                            </p>
                        </div>

                        {/* Stats Row */}
                        {planetData.stats && (
                            <div className="grid grid-cols-3 gap-3">
                                {planetData.stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.4 + index * 0.1,
                                        }}
                                        className="text-center p-3 rounded border"
                                        style={{
                                            borderColor: `${planetColor}30`,
                                            background: `${planetColor}10`,
                                        }}
                                    >
                                        <span className="text-xl mb-1 block">
                                            {stat.icon}
                                        </span>
                                        <p
                                            className="text-lg font-bold font-mono"
                                            style={{ color: planetColor }}
                                        >
                                            {stat.value}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Details List */}
                        {planetData.details && (
                            <div className="space-y-2">
                                <p className="text-cyan-400/70 font-mono text-xs tracking-wider uppercase mb-3">
                                    Quick Info
                                </p>
                                {planetData.details.map((detail, index) => (
                                    <motion.div
                                        key={detail.label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.5 + index * 0.05,
                                        }}
                                        className="flex justify-between items-center py-2 border-b border-cyan-500/10"
                                    >
                                        <span className="text-gray-400 font-mono text-xs uppercase">
                                            {detail.label}
                                        </span>
                                        <span
                                            className="font-mono text-sm text-right"
                                            style={{ color: planetColor }}
                                        >
                                            {detail.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Highlights */}
                        {planetData.highlights && (
                            <div>
                                <p className="text-cyan-400/70 font-mono text-xs tracking-wider uppercase mb-3">
                                    Highlights
                                </p>
                                <ul className="space-y-2">
                                    {planetData.highlights.map(
                                        (highlight, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.6 + index * 0.05,
                                                }}
                                                className="flex items-start space-x-3 text-sm"
                                            >
                                                <span
                                                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            planetColor,
                                                        boxShadow: `0 0 6px ${planetColor}`,
                                                    }}
                                                />
                                                <span className="text-gray-300">
                                                    {highlight}
                                                </span>
                                            </motion.li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Links (if available) */}
                        {planetData.links && (
                            <div className="pt-3">
                                <p className="text-cyan-400/70 font-mono text-xs tracking-wider uppercase mb-3">
                                    External Links
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {planetData.links.map((link, index) => (
                                        <motion.a
                                            key={link.label}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.7 + index * 0.1,
                                            }}
                                            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider
                                                border rounded transition-all duration-300
                                                hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                                            style={{
                                                borderColor: `${planetColor}50`,
                                                color: planetColor,
                                            }}
                                            whileHover={{
                                                backgroundColor: `${planetColor}20`,
                                            }}
                                        >
                                            {link.label} →
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Back Button */}
                    <div className="mt-5 pt-4 border-t border-cyan-500/20">
                        <button
                            onClick={onBack}
                            className="w-full py-3 font-mono text-sm uppercase tracking-wider
                                border rounded transition-all duration-300 group
                                hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                            style={{
                                borderColor: `${planetColor}50`,
                                color: planetColor,
                            }}
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span className="group-hover:-translate-x-1 transition-transform">
                                    ←
                                </span>
                                <span>Return to System</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlanetInfoPanel;
