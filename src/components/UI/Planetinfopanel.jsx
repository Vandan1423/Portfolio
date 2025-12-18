import { motion } from "framer-motion";
import styles from "./Planetinfopanel.module.css";

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
            className={styles.container}
        >
            {/* Main Panel Container */}
            <div
                className={styles.panel}
                style={{
                    borderColor: `${planetColor}60`,
                    boxShadow: `
                        0 0 30px ${planetColor}30,
                        inset 0 0 30px ${planetColor}10
                    `,
                }}
            >
                {/* Corner Accents - inside padding area */}
                <div
                    className={styles.cornerTopLeft}
                    style={{ borderColor: `${planetColor}80` }}
                />
                <div
                    className={styles.cornerBottomRight}
                    style={{ borderColor: `${planetColor}80` }}
                />

                {/* Scan Line Effect */}
                <div className={styles.scanLineContainer}>
                    <motion.div
                        className={styles.scanLine}
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
                    className={styles.gridPattern}
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, ${planetColor} 1px, transparent 1px),
                            linear-gradient(to bottom, ${planetColor} 1px, transparent 1px)
                        `,
                    }}
                />

                {/* Content with INCREASED PADDING */}
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        {/* Section Label */}
                        <div className={styles.sectionLabel}>
                            <div
                                className={styles.statusIndicator}
                                style={{
                                    backgroundColor: planetColor,
                                    boxShadow: `0 0 10px ${planetColor}`,
                                }}
                            />
                            <span className={styles.sectionLabelText}>
                                Section Data
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            className={styles.title}
                            style={{
                                color: planetColor,
                                textShadow: `0 0 20px ${planetColor}80`,
                            }}
                        >
                            {planetData.title}
                        </h2>

                        {/* Subtitle */}
                        <p className={styles.subtitle}>
                            {planetData.subtitle}
                        </p>

                        {/* Animated underline */}
                        <motion.div
                            className={styles.titleUnderline}
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
                        className={styles.scrollableContent}
                        style={{
                            scrollbarColor: `${planetColor}50 transparent`,
                        }}
                    >
                        {/* Description */}
                        <div>
                            <p className={styles.description}>
                                {planetData.description}
                            </p>
                        </div>

                        {/* Stats Row */}
                        {planetData.stats && (
                            <div className={styles.statsGrid}>
                                {planetData.stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.4 + index * 0.1,
                                        }}
                                        className={styles.statCard}
                                        style={{
                                            borderColor: `${planetColor}30`,
                                            background: `${planetColor}10`,
                                        }}
                                    >
                                        <span className={styles.statIcon}>
                                            {stat.icon}
                                        </span>
                                        <p
                                            className={styles.statValue}
                                            style={{ color: planetColor }}
                                        >
                                            {stat.value}
                                        </p>
                                        <p className={styles.statLabel}>
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Details List */}
                        {planetData.details && (
                            <div className={styles.detailsContainer}>
                                <p className={styles.detailsTitle}>
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
                                        className={styles.detailRow}
                                    >
                                        <span className={styles.detailLabel}>
                                            {detail.label}
                                        </span>
                                        <span
                                            className={styles.detailValue}
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
                            <div className={styles.highlightsContainer}>
                                <p className={styles.detailsTitle}>
                                    Highlights
                                </p>
                                <ul className={styles.highlightsList}>
                                    {planetData.highlights.map(
                                        (highlight, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.6 + index * 0.05,
                                                }}
                                                className={styles.highlightItem}
                                            >
                                                <span
                                                    className={styles.highlightDot}
                                                    style={{
                                                        backgroundColor:
                                                            planetColor,
                                                        boxShadow: `0 0 6px ${planetColor}`,
                                                    }}
                                                />
                                                <span className={styles.highlightText}>
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
                            <div className={styles.linksContainer}>
                                <p className={styles.detailsTitle}>
                                    External Links
                                </p>
                                <div className={styles.linksGrid}>
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
                                            className={styles.linkButton}
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
                    <div className={styles.footer}>
                        <button
                            onClick={onBack}
                            className={styles.backButton}
                            style={{
                                borderColor: `${planetColor}50`,
                                color: planetColor,
                            }}
                        >
                            <span className={styles.backButtonContent}>
                                <span className={styles.backButtonArrow}>
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
