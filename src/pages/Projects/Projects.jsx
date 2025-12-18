import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import ProjectCard from '../../components/features/ProjectCard/ProjectCard';
import useScrollToSection from '../../hooks/useScrollToSection';
import useExpandableState from '../../hooks/useExpandableState';
import { useNavigation } from '../../context/NavigationContext';
import projectsData from '../../data/projectsData';
import styles from './Projects.module.css';

const Projects = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);
    const { isExpanded, toggle } = useExpandableState();

    return (
        <PageTemplate
            title="Projects"
            subtitle="Explore my journey trough code, innovation, and problem-solving"
        >
            <section className={styles.projectsSection}>
                {projectsData.map((project, index) => (
                    <div
                        key={project.id}
                        ref={registerRef(`project-${index + 1}`)}
                    >
                        <ProjectCard
                            project={project}
                            index={index}
                            isExpanded={isExpanded(project.id)}
                            onToggle={() => toggle(project.id)}
                        />
                    </div>
                ))}
            </section>
        </PageTemplate>
    );
};

export default Projects;
