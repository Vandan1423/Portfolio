import React from 'react';
import TagList from '../../shared/TagList/TagList';
import ImageCarousel from '../../../pages/Projects/ImageCarousel';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, index }) => {
    const meta = [project.context, project.year].filter(Boolean).join(' · ');

    return (
        <div id={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
                <div className={styles.projectNumber}>
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className={styles.projectTitleWrapper}>
                    <h2 className={styles.projectTitle}>{project.name}</h2>
                    {meta && <p className={styles.projectMeta}>{meta}</p>}
                </div>
            </div>

            <div className={styles.projectInfo}>
                <p className={styles.projectDescription}>{project.summary}</p>

                {project.points?.length > 0 && (
                    <ul className={styles.featuresList}>
                        {project.points.map((point) => (
                            <li key={point} className={styles.featureItem}>
                                <span className={styles.featureBullet} aria-hidden="true" />
                                <div>{point}</div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className={styles.techSection}>
                    <TagList tags={project.stack} variant="tech" />
                </div>

                <div className={styles.actionButtons}>
                    {project.links?.code && (
                        <a
                            href={project.links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                        >
                            Code
                        </a>
                    )}
                    {project.links?.live && (
                        <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.actionBtn} ${styles.primaryBtn}`}
                        >
                            Live site
                        </a>
                    )}
                </div>
            </div>

            {project.screenshots?.length > 0 && (
                <div className={styles.carouselSection}>
                    <ImageCarousel screenshots={project.screenshots} projectName={project.name} />
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
