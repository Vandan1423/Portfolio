import React, { useState } from "react";
import styles from "./Experience.module.css";
import { experienceData } from "./experienceData";

const Experience = () => {
    const [expandedExperiences, setExpandedExperiences] = useState({});

    const toggleReadMore = (experienceId) => {
        setExpandedExperiences(prev => ({
            ...prev,
            [experienceId]: !prev[experienceId]
        }));
    };

    return (
        <div className={styles.container}>
            {/* Background - Static Space Image */}
            <div className={styles.spaceBackground}></div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTitle}>
                        <h1 className={styles.mainTitle}>Experience</h1>
                        <div className={styles.titleUnderline}></div>
                    </div>
                    <p className={styles.heroSubtitle}>
                        My journey through research, leadership, and technical excellence
                    </p>
                    <div className={styles.heroStars}>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={styles.heroStar}
                                style={{ '--star-delay': `${i * 0.3}s` }}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollArrow}></div>
                    <span className={styles.scrollText}>Scroll to explore</span>
                </div>
            </section>

            {/* Experience Section */}
            <section className={styles.experienceSection}>
                {experienceData.map((experience, index) => (
                    <div key={experience.id} className={styles.experienceCard}>
                        {/* Experience Header */}
                        <div className={styles.experienceHeader}>
                            <div className={styles.experienceNumber}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className={styles.experienceTitleWrapper}>
                                <div className={styles.titleSection}>
                                    <h2 className={styles.experienceTitle}>{experience.title}</h2>
                                    <p className={styles.organization}>{experience.organization}</p>
                                </div>
                                <div className={styles.badges}>
                                    <div className={styles.statusBadge} data-status={experience.status}>
                                        {experience.status === "Current" && "🟢 Current"}
                                        {experience.status === "Completed" && "✅ Completed"}
                                    </div>
                                    <div className={styles.typeBadge} data-type={experience.type}>
                                        {experience.icon} {experience.type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Info Section */}
                        <div className={styles.experienceInfo}>
                            {/* Duration and Location */}
                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📅</span>
                                    <span className={styles.metaText}>{experience.duration}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📍</span>
                                    <span className={styles.metaText}>{experience.location}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className={styles.experienceDescription}>
                                {experience.shortDescription}
                            </p>

                            {/* Technologies */}
                            <div className={styles.techSection}>
                                <h4 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>🔧</span>
                                    Technologies & Tools
                                </h4>
                                <div className={styles.techTags}>
                                    {experience.technologies.map((tech, i) => (
                                        <span key={i} className={styles.techTag}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Key Responsibilities - Show first 3, rest on Read More */}
                            <div className={styles.responsibilitiesSection}>
                                <h4 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>⚡</span>
                                    Key Responsibilities
                                </h4>
                                <ul className={styles.responsibilitiesList}>
                                    {experience.keyResponsibilities
                                        .slice(0, expandedExperiences[experience.id] ? experience.keyResponsibilities.length : 3)
                                        .map((responsibility, i) => {
                                            const [title, description] = responsibility.split(' - ');
                                            return (
                                                <li key={i} className={styles.responsibilityItem}>
                                                    <span className={styles.responsibilityBullet}>▹</span>
                                                    <div>
                                                        <strong>{title}</strong>
                                                        {description && ` - ${description}`}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>

                            {/* Expandable Details */}
                            {expandedExperiences[experience.id] && (
                                <div className={styles.expandedDetails}>
                                    {/* Impact */}
                                    <div className={styles.detailSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <span className={styles.sectionIcon}>📊</span>
                                            Impact & Results
                                        </h4>
                                        <p className={styles.detailText}>{experience.impact}</p>
                                    </div>

                                    {/* Skills Developed */}
                                    <div className={styles.detailSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <span className={styles.sectionIcon}>🎯</span>
                                            Skills Developed
                                        </h4>
                                        <p className={styles.detailText}>{experience.skillsDeveloped}</p>
                                    </div>

                                    {/* Note if exists */}
                                    {experience.note && (
                                        <div className={styles.noteSection}>
                                            <span className={styles.noteIcon}>💡</span>
                                            <p className={styles.noteText}>{experience.note}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Read More Button */}
                            <button
                                className={styles.readMoreBtn}
                                onClick={() => toggleReadMore(experience.id)}
                            >
                                {expandedExperiences[experience.id] ? (
                                    <>
                                        <span>Show Less</span>
                                        <span className={styles.btnArrow}>↑</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Read More</span>
                                        <span className={styles.btnArrow}>↓</span>
                                    </>
                                )}
                            </button>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                {experience.certificate && (
                                    <a
                                        href={experience.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    >
                                        <span className={styles.btnIcon}>📜</span>
                                        View Certificate
                                    </a>
                                )}
                                {experience.github && (
                                    <a
                                        href={experience.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.actionBtn}
                                    >
                                        <span className={styles.btnIcon}>💻</span>
                                        View Repository
                                    </a>
                                )}
                                {experience.website && (
                                    <a
                                        href={experience.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    >
                                        <span className={styles.btnIcon}>🌐</span>
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Experience;
