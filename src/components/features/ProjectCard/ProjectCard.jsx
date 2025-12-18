import React from 'react';
import Badge from '../../common/Badge/Badge';
import TagList from '../../shared/TagList/TagList';
import Button from '../../common/Button/Button';
import ImageCarousel from '../../../pages/Projects/ImageCarousel';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, index, isExpanded, onToggle }) => {
    const sectionId = `project-${index + 1}`;

    const getStatusBadgeVariant = (status) => {
        if (status === 'Live') return 'success';
        if (status === 'In Development') return 'warning';
        return 'info';
    };

    const getStatusIcon = (status) => {
        if (status === 'Live') return '🟢';
        if (status === 'In Development') return '🟡';
        return '✅';
    };

    return (
        <div id={sectionId} className={styles.projectCard}>
            <div className={styles.projectHeader}>
                <div className={styles.projectNumber}>
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className={styles.projectTitleWrapper}>
                    <h2 className={styles.projectTitle}>{project.name}</h2>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusIcon(project.status)} {project.status}
                    </Badge>
                </div>
            </div>

            <div className={styles.projectInfo}>
                <p className={styles.projectDescription}>
                    {project.shortDescription}
                </p>

                <div className={styles.techSection}>
                    <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🔧</span>
                        Tech Stack
                    </h4>
                    <TagList tags={project.technologies} variant="tech" />
                </div>

                <div className={styles.featuresSection}>
                    <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⚡</span>
                        Key Features
                    </h4>
                    <ul className={styles.featuresList}>
                        {project.keyFeatures
                            .slice(0, isExpanded ? project.keyFeatures.length : 3)
                            .map((feature, i) => {
                                const [title, description] = feature.split(' - ');
                                return (
                                    <li key={i} className={styles.featureItem}>
                                        <span className={styles.featureBullet}>▹</span>
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
                                <span className={styles.sectionIcon}>👨‍💻</span>
                                My Role
                            </h4>
                            <p className={styles.detailText}>{project.role}</p>
                        </div>

                        <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🎯</span>
                                Challenges & Solutions
                            </h4>
                            <p className={styles.detailText}>{project.challenges}</p>
                        </div>

                        <div className={styles.detailSection}>
                            <h4 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📊</span>
                                Impact & Results
                            </h4>
                            <p className={styles.detailText}>{project.impact}</p>
                        </div>

                        {project.note && (
                            <div className={styles.noteSection}>
                                <span className={styles.noteIcon}>💡</span>
                                <p className={styles.noteText}>{project.note}</p>
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

                <div className={styles.actionButtons}>
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                        >
                            <span className={styles.btnIcon}>💻</span>
                            View Code
                        </a>
                    )}
                    {project.liveDemo && (
                        <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                        >
                            <span className={styles.btnIcon}>🚀</span>
                            Live Demo
                        </a>
                    )}
                </div>
            </div>

            <div className={styles.carouselSection}>
                <ImageCarousel screenshots={project.screenshots} projectName={project.name} />
            </div>
        </div>
    );
};

export default ProjectCard;
