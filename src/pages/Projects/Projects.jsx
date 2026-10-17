import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import ProjectCard from '../../components/features/ProjectCard/ProjectCard';
import useScrollToSection from '../../hooks/useScrollToSection';
import { useNavigation } from '../../context/NavigationContext';
import { projects } from '../../data/profile';
import styles from './Projects.module.css';

const featuredProjects = projects.filter((project) => project.featured);
const earlierProjects = projects.filter((project) => !project.featured);

const Projects = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);

    return (
        <PageTemplate
            title="Projects"
        >
            <section className={styles.projectsSection}>
                {featuredProjects.map((project, index) => (
                    <div key={project.id} ref={registerRef(project.id)}>
                        <ProjectCard project={project} index={index} />
                    </div>
                ))}

                {earlierProjects.length > 0 && (
                    <div className={styles.earlierWork}>
                        <h2 className={styles.earlierTitle}>Earlier work</h2>
                        <ul className={styles.earlierList}>
                            {earlierProjects.map((project) => (
                                <li key={project.id} className={styles.earlierItem}>
                                    <span className={styles.earlierName}>{project.name}</span>
                                    <span className={styles.earlierSummary}>{project.summary}</span>
                                    <span className={styles.earlierLinks}>
                                        {project.links?.live && (
                                            <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                                                Live
                                            </a>
                                        )}
                                        {project.links?.code && (
                                            <a href={project.links.code} target="_blank" rel="noopener noreferrer">
                                                Code
                                            </a>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </PageTemplate>
    );
};

export default Projects;
