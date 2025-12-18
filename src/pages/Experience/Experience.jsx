import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import ExperienceCard from '../../components/features/ExperienceCard/ExperienceCard';
import useScrollToSection from '../../hooks/useScrollToSection';
import useExpandableState from '../../hooks/useExpandableState';
import { useNavigation } from '../../context/NavigationContext';
import experienceData from '../../data/experienceData';
import styles from './Experience.module.css';

const Experience = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);
    const { isExpanded, toggle } = useExpandableState();

    return (
        <PageTemplate
            title="Experience"
            subtitle="My journey through research, leadership, and technical excellence"
        >
            <section className={styles.experienceSection}>
                {experienceData.map((experience, index) => {
                    const sectionId = `exp-${String(index + 1).padStart(2, '0')}`;
                    return (
                        <div
                            key={experience.id}
                            ref={registerRef(sectionId)}
                        >
                            <ExperienceCard
                                experience={experience}
                                index={index}
                                isExpanded={isExpanded(experience.id)}
                                onToggle={() => toggle(experience.id)}
                            />
                        </div>
                    );
                })}
            </section>
        </PageTemplate>
    );
};

export default Experience;
