import React from 'react';
import styles from '../Technologies.module.css';

/**
 * TechnologyCards Component
 * Displays detailed technology cards in a grid layout
 * Props:
 * - technologiesData: The data structure containing categories and technologies
 * - activeCategory: Currently active category filter (null for all)
 * - selectedTech: Currently selected technology
 * - highlightedTechs: Array of tech IDs to highlight
 */
const TechnologyCards = ({ technologiesData, activeCategory, selectedTech, highlightedTechs }) => {
    return (
        <section className={styles.detailsSection}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionNumber}>03</span>
                <h2 className={styles.glitchTitle} data-text="TECH DETAILS">
                    TECHNOLOGY DETAILS
                </h2>
            </div>

            <div className={styles.techGrid}>
                {technologiesData.categories
                    .filter(cat => !activeCategory || cat.id === activeCategory)
                    .flatMap(cat => cat.technologies)
                    .map(tech => {
                        const category = technologiesData.categories.find(cat =>
                            cat.technologies.some(t => t.id === tech.id)
                        );

                        return (
                            <div
                                key={tech.id}
                                id={`tech-${tech.id}`}
                                className={`${styles.techCard} ${
                                    selectedTech?.id === tech.id ? styles.selected : ''
                                } ${
                                    highlightedTechs.includes(tech.id) ? styles.highlighted : ''
                                }`}
                                style={{ '--card-color': category?.color }}
                            >
                                <div className={styles.techCardHeader}>
                                    <div className={styles.techIconLarge}>{tech.icon}</div>
                                    <div className={styles.techCardTitle}>
                                        <h3>{tech.name}</h3>
                                        <div className={styles.proficiencyBadge}>
                                            <span>{tech.proficiency}%</span>
                                            <div className={styles.proficiencyBarSmall}>
                                                <div
                                                    className={styles.proficiencyFillSmall}
                                                    style={{
                                                        width: `${tech.proficiency}%`,
                                                        background: category?.color
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className={styles.techDescription}>{tech.description}</p>

                                {tech.keyFeatures && (
                                    <div className={styles.techFeatures}>
                                        <h4>Key Features:</h4>
                                        <ul>
                                            {tech.keyFeatures.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.techMeta}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaIcon}>⏱️</span>
                                        <span>{tech.yearsOfExperience} years</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaIcon}>📁</span>
                                        <span>
                                            {tech.projects.length} project
                                            {tech.projects.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                {tech.projects && tech.projects.length > 0 && (
                                    <div className={styles.projectTags}>
                                        {tech.projects.slice(0, 3).map((project, index) => (
                                            <span key={index} className={styles.projectTag}>
                                                {project}
                                            </span>
                                        ))}
                                        {tech.projects.length > 3 && (
                                            <span className={styles.projectTag}>
                                                +{tech.projects.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};

export default TechnologyCards;
