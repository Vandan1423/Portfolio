import React from 'react';
import Badge from '../../common/Badge/Badge';
import TagList from '../../shared/TagList/TagList';
import MetaInfo from '../../shared/MetaInfo/MetaInfo';
import Button from '../../common/Button/Button';
import styles from './ExperienceCard.module.css';

const ExperienceCard = ({ experience, index, isExpanded, onToggle }) => {
    const sectionId = `exp-${String(index + 1).padStart(2, '0')}`;

    const getStatusBadgeVariant = (status) => {
        return status === 'Current' ? 'success' : 'info';
    };

    const getStatusIcon = (status) => {
        return status === 'Current' ? '🟢' : '✅';
    };

    const metaItems = [
        { icon: '📅', label: 'Duration', value: experience.duration },
        { icon: '📍', label: 'Location', value: experience.location }
    ];

    return (
        <div id={sectionId} className={styles.experienceCard}>
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
                        <Badge variant={getStatusBadgeVariant(experience.status)}>
                            {getStatusIcon(experience.status)} {experience.status}
                        </Badge>
                        <Badge variant="default">
                            {experience.icon} {experience.type}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className={styles.experienceInfo}>
                <MetaInfo items={metaItems} className={styles.metaInfo} />

                <p className={styles.experienceDescription}>
                    {experience.shortDescription}
                </p>

                <div className={styles.techSection}>
                    <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🔧</span>
                        Technologies & Tools
                    </h4>
                    <TagList tags={experience.technologies} variant="tech" />
                </div>

                <div className={styles.responsibilitiesSection}>
                    <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⚡</span>
                        Key Responsibilities
                    </h4>
                    <ul className={styles.responsibilitiesList}>
                        {experience.keyResponsibilities
                            .slice(0, isExpanded ? experience.keyResponsibilities.length : 3)
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

                {isExpanded && (
                    <div className={styles.expandedDetails}>
                        <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🎯</span>
                                Key Achievements
                            </h4>
                            <p className={styles.detailText}>{experience.achievements}</p>
                        </div>

                        <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>💡</span>
                                Skills Developed
                            </h4>
                            <p className={styles.detailText}>{experience.skillsDeveloped}</p>
                        </div>

                        <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📊</span>
                                Impact & Results
                            </h4>
                            <p className={styles.detailText}>{experience.impact}</p>
                        </div>

                        {experience.note && (
                            <div className={styles.noteSection}>
                                <span className={styles.noteIcon}>💡</span>
                                <p className={styles.noteText}>{experience.note}</p>
                            </div>
                        )}
                    </div>
                )}

                <Button
                    variant="ghost"
                    onClick={onToggle}
                    className={styles.readMoreBtn}
                >
                    {isExpanded ? (
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
                </Button>

                {experience.link && (
                    <div className={styles.actionButtons}>
                        <a
                            href={experience.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                        >
                            <span className={styles.btnIcon}>🔗</span>
                            Learn More
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceCard;
