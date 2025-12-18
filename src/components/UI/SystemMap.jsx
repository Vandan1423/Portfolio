import { motion } from "framer-motion";
import styles from "./SystemMap.module.css";

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
            className={styles.container}
        >
            {/* Map Container */}
            <div className={styles.mapContainer}>
                {/* Grid Background */}
                <div className={styles.gridBackground}>
                    <svg className={styles.gridSvg}>
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
                    className={styles.sun}
                    style={{
                        left: `${centerX - 12}px`,
                        top: `${centerY - 12}px`,
                    }}
                >
                    <div className={styles.sunGlow}></div>
                </div>

                {/* Orbit Rings */}
                {planets.map((planet, index) => {
                    const radius = planet.orbitRadius / scale;
                    return (
                        <svg
                            key={`orbit-${index}`}
                            className={styles.orbitSvg}
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
                            className={styles.planetNode}
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
                                className={`${styles.planetDot} ${
                                    isSelected ? styles.planetDotSelected : ""
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
                                        className={styles.planetPulse}
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
                                className={`${styles.planetLabel} ${
                                    isSelected ? styles.planetLabelVisible : ""
                                }`}
                                style={{
                                    borderColor: `${planet.orbitColor}50`,
                                }}
                            >
                                <p
                                    className={styles.planetName}
                                    style={{ color: planet.orbitColor }}
                                >
                                    {planet.name}
                                </p>
                                <p className={styles.planetSection}>
                                    {planet.section}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Corner Decorations */}
                <div className={styles.cornerTopLeft}></div>
                <div className={styles.cornerTopRight}></div>
                <div className={styles.cornerBottomLeft}></div>
                <div className={styles.cornerBottomRight}></div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <p className={styles.legendTitle}>
                    SYSTEM LEGEND
                </p>
                <div className={styles.legendGrid}>
                    {planets.map((planet) => (
                        <div
                            key={planet.name}
                            className={styles.legendItem}
                            onClick={() => handlePlanetClick(planet)}
                        >
                            <div
                                className={styles.legendDot}
                                style={{
                                    backgroundColor: planet.orbitColor,
                                    boxShadow: `0 0 5px ${planet.orbitColor}80`,
                                }}
                            ></div>
                            <span className={styles.legendText}>
                                {planet.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className={styles.instructions}>
                <p className={styles.instructionsText}>
                    Click on a planet to analyze
                </p>
            </div>
        </motion.div>
    );
};

export default SystemMap;
