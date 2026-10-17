import { motion } from "framer-motion";
import styles from "./PlanetInfoPanel.module.css";

/**
 * PlanetInfoPanel Component
 *
 * The information panel beside a planet in the planet detail view.
 *
 * Props:
 * @param {object} planetData - Data for the selected planet section
 * @param {function} onBack - Callback to return to solar system
 */
const PlanetInfoPanel = ({ planetData, onBack }) => {
    if (!planetData) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={styles.container}
            data-tutorial="planet-info-panel"
        >
            <div className={styles.panel}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{planetData.title}</h2>
                        {planetData.subtitle && (
                            <p className={styles.subtitle}>{planetData.subtitle}</p>
                        )}
                    </div>

                    <div className={styles.scrollableContent}>
                        <p className={styles.description}>{planetData.description}</p>

                        {planetData.stats && (
                            <div className={styles.statsGrid}>
                                {planetData.stats.map((stat) => (
                                    <div key={stat.label} className={styles.statCard}>
                                        <p className={styles.statValue}>{stat.value}</p>
                                        <p className={styles.statLabel}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {planetData.details && (
                            <div className={styles.detailsContainer}>
                                {planetData.details.map((detail) => (
                                    <div key={detail.label} className={styles.detailRow}>
                                        <span className={styles.detailLabel}>{detail.label}</span>
                                        <span className={styles.detailValue}>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {planetData.highlights && (
                            <div className={styles.highlightsContainer}>
                                <p className={styles.detailsTitle}>Highlights</p>
                                <ul className={styles.highlightsList}>
                                    {planetData.highlights.map((highlight, index) => (
                                        <li key={index} className={styles.highlightItem}>
                                            <span className={styles.highlightDot} />
                                            <span className={styles.highlightText}>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {planetData.links && (
                            <div className={styles.linksGrid}>
                                {planetData.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.linkButton}
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button onClick={onBack} className={styles.backButton}>
                            ← Back to the system
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlanetInfoPanel;
