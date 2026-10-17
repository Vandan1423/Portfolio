import React from 'react';
import TagList from '../../shared/TagList/TagList';
import styles from './ExperienceCard.module.css';

const ExperienceCard = ({ experience, index }) => {
    const meta = [`${experience.start} – ${experience.end}`, experience.location]
        .filter(Boolean)
        .join(' · ');

    return (
        <div id={experience.id} className={styles.experienceCard}>
            <div className={styles.experienceHeader}>
                <div className={styles.experienceNumber}>
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className={styles.experienceTitleWrapper}>
                    <div className={styles.titleSection}>
                        <h2 className={styles.experienceTitle}>{experience.role}</h2>
                        <p className={styles.organization}>{experience.org}</p>
                        <p className={styles.meta}>{meta}</p>
                    </div>
                </div>
            </div>

            <div className={styles.experienceInfo}>
                <p className={styles.experienceDescription}>{experience.summary}</p>

                {experience.projects?.length > 0 && (
                    <ul className={styles.responsibilitiesList}>
                        {experience.projects.map((project) => (
                            <li key={project.name} className={styles.responsibilityItem}>
                                <span className={styles.responsibilityBullet} aria-hidden="true" />
                                <div>
                                    <strong>
                                        {project.link ? (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                {project.name}
                                            </a>
                                        ) : (
                                            project.name
                                        )}
                                    </strong>
                                    {`: ${project.text}`}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {experience.points?.length > 0 && (
                    <ul className={styles.responsibilitiesList}>
                        {experience.points.map((point) => (
                            <li key={point} className={styles.responsibilityItem}>
                                <span className={styles.responsibilityBullet} aria-hidden="true" />
                                <div>{point}</div>
                            </li>
                        ))}
                    </ul>
                )}

                {experience.stack?.length > 0 && (
                    <div className={styles.techSection}>
                        <TagList tags={experience.stack} variant="tech" />
                    </div>
                )}

                {experience.links?.length > 0 && (
                    <div className={styles.actionButtons}>
                        {experience.links.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.actionBtn}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceCard;
