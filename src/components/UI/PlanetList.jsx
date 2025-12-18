import { motion } from "framer-motion";
import styles from "./PlanetList.module.css";

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
            className={styles.container}
        >
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>
                    Available Destinations
                </h3>
                <p className={styles.headerSubtitle}>
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
                    className={styles.planetButton}
                >
                    {/* Angular Container */}
                    <div className={styles.planetAngular}>
                        {/* Background */}
                        <div
                            className={styles.planetContent}
                            style={{
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
                                className={styles.planetHoverScan}
                                initial={{ x: "-100%" }}
                                whileHover={{
                                    x: "100%",
                                    transition: {
                                        duration: 0.5,
                                        ease: "linear",
                                    },
                                }}
                            ></motion.div>

                            <div className={styles.planetInner}>
                                {/* Planet Indicator */}
                                <div className={styles.planetIndicatorContainer}>
                                    <div
                                        className={styles.planetIndicator}
                                        style={{
                                            borderColor: planet.orbitColor,
                                            background: `radial-gradient(circle, ${planet.orbitColor}20 0%, transparent 70%)`,
                                        }}
                                    >
                                        {/* Pulsing Ring for Selected */}
                                        {selectedPlanet?.name ===
                                            planet.name && (
                                            <motion.div
                                                className={styles.planetPulsingRing}
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
                                            className={styles.planetDot}
                                            style={{
                                                backgroundColor:
                                                    planet.orbitColor,
                                                boxShadow: `0 0 15px ${planet.orbitColor}`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Planet Info */}
                                <div className={styles.planetInfo}>
                                    <h4 className={styles.planetName}>
                                        {planet.name}
                                    </h4>
                                    <p className={styles.planetSection}>
                                        {planet.section || `SECTION ${planet.sectionId || planet.id}`}
                                    </p>

                                    {/* Distance/Stats */}
                                    <div className={styles.planetStats}>
                                        <span className={styles.planetStatText}>
                                            ORBIT: {planet.orbitRadius} AU
                                        </span>
                                        <div
                                            className={styles.planetStatDot}
                                            style={{
                                                backgroundColor:
                                                    planet.orbitColor,
                                            }}
                                        ></div>
                                        <span className={styles.planetStatText}>
                                            SECTOR{" "}
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow Indicator */}
                                <div className={styles.arrowContainer}>
                                    <motion.div
                                        className={styles.arrowFrame}
                                        whileHover={{ rotate: 45 }}
                                    >
                                        <span className={styles.arrowIcon}>
                                            →
                                        </span>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Bottom Accent Line */}
                            <div
                                className={styles.bottomAccent}
                                style={{
                                    background: `linear-gradient(to right, transparent, ${planet.orbitColor}, transparent)`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Glow on Hover */}
                    <div className={styles.glowEffect}></div>
                </motion.button>
            ))}

            {/* Empty State */}
            {planets.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateText}>
                        No planets detected in this system
                    </p>
                </div>
            )}

            {/* Info Note */}
            <div className={styles.infoNote}>
                <p className={styles.infoNoteText}>
                    Click on any planet to enter detailed analysis mode
                </p>
            </div>
        </motion.div>
    );
};

export default PlanetList;
