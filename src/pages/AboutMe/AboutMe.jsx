import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import TwoColumnSection from '../../components/shared/TwoColumnSection/TwoColumnSection';
import useScrollToSection from '../../hooks/useScrollToSection';
import { useNavigation } from '../../context/NavigationContext';

// Import all section components
import PersonalInfoSection from './sections/PersonalInfoSection';
import EducationSection from './sections/EducationSection';
import TechStackSection from './sections/TechStackSection';
import AchievementsSection from './sections/AchievementsSection';
import CertificationsSection from './sections/CertificationsSection';

const AboutMe = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);

    return (
        <PageTemplate
            title="About Me"
        >
            {/* Section 1: Personal Info */}
            <TwoColumnSection
                ref={registerRef('personal-info')}
                id="personal-info"
                sectionNumber="01"
                sectionTitle="Personal info"
                leftContent={<PersonalInfoSection />}
            />

            {/* Section 2: Education */}
            <TwoColumnSection
                ref={registerRef('education')}
                id="education"
                sectionNumber="02"
                sectionTitle="Education"
                leftContent={<EducationSection />}
            />

            {/* Section 3: Tech Stack */}
            <TwoColumnSection
                ref={registerRef('tech-stack')}
                id="tech-stack"
                sectionNumber="03"
                sectionTitle="Tech stack"
                leftContent={<TechStackSection />}
            />

            {/* Section 4: Achievements */}
            <TwoColumnSection
                ref={registerRef('achievements')}
                id="achievements"
                sectionNumber="04"
                sectionTitle="Achievements"
                leftContent={<AchievementsSection />}
            />

            {/* Section 5: Certifications */}
            <TwoColumnSection
                ref={registerRef('certifications')}
                id="certifications"
                sectionNumber="05"
                sectionTitle="Certifications"
                leftContent={<CertificationsSection />}
            />
        </PageTemplate>
    );
};

export default AboutMe;
