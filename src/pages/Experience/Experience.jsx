import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import ExperienceCard from '../../components/features/ExperienceCard/ExperienceCard';
import useScrollToSection from '../../hooks/useScrollToSection';
import { useNavigation } from '../../context/NavigationContext';
import { experience, positions } from '../../data/profile';
import styles from './Experience.module.css';

const Experience = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);

    return (
        <PageTemplate
            title="Experience"
        >
            <section className={styles.experienceSection}>
                {experience.map((item, index) => (
                    <div key={item.id} ref={registerRef(item.id)}>
                        <ExperienceCard experience={item} index={index} />
                    </div>
                ))}

                {positions.length > 0 && (
                    <>
                        <h2 className={styles.groupTitle}>Positions of responsibility</h2>
                        {positions.map((item, index) => (
                            <div key={item.id} ref={registerRef(item.id)}>
                                <ExperienceCard experience={item} index={index} />
                            </div>
                        ))}
                    </>
                )}
            </section>
        </PageTemplate>
    );
};

export default Experience;
