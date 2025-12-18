import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import TwoColumnSection from '../../components/shared/TwoColumnSection/TwoColumnSection';
import useScrollToSection from '../../hooks/useScrollToSection';
import { useNavigation } from '../../context/NavigationContext';

// Import all section components
import PersonalInfoSection from './sections/PersonalInfoSection';
import AvatarVisualization from './sections/AvatarVisualization';
import EducationSection from './sections/EducationSection';
import OrbitalSystem from './sections/OrbitalSystem';
import InterestsSection from './sections/InterestsSection';
import HobbyOrbs from './sections/HobbyOrbs';
import TechStackSection from './sections/TechStackSection';
import CodeEditor from './sections/CodeEditor';
import AchievementsSection from './sections/AchievementsSection';
import AchievementTimeline from './sections/AchievementTimeline';
import ResumeSection from './sections/ResumeSection';
import ResumeVisualization from './sections/ResumeVisualization';
import CertificationsSection from './sections/CertificationsSection';
import CertificateBadge from './sections/CertificateBadge';

const AboutMe = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);

    return (
        <PageTemplate
            title="About Me"
            subtitle="Journey through my universe of skills, passions, and achievements"
        >
            {/* Section 1: Personal Info + Avatar */}
            <TwoColumnSection
                ref={registerRef('personal-info')}
                id="personal-info"
                sectionNumber="01"
                sectionTitle="PERSONAL INFO"
                leftContent={<PersonalInfoSection />}
                rightContent={<AvatarVisualization />}
            />

            {/* Section 2: Education + Orbital Animation */}
            <TwoColumnSection
                ref={registerRef('education')}
                id="education"
                sectionNumber="02"
                sectionTitle="EDUCATION"
                leftContent={<EducationSection />}
                rightContent={<OrbitalSystem />}
            />

            {/* Section 3: Interests + Hobby Orbs */}
            <TwoColumnSection
                ref={registerRef('interests')}
                id="interests"
                sectionNumber="03"
                sectionTitle="INTERESTS & HOBBIES"
                leftContent={<InterestsSection />}
                rightContent={<HobbyOrbs />}
            />

            {/* Section 4: Tech Stack + Code Editor */}
            <TwoColumnSection
                ref={registerRef('tech-stack')}
                id="tech-stack"
                sectionNumber="04"
                sectionTitle="TECH STACK"
                leftContent={<TechStackSection />}
                rightContent={<CodeEditor />}
            />

            {/* Section 5: Achievements + Timeline */}
            <TwoColumnSection
                ref={registerRef('achievements')}
                id="achievements"
                sectionNumber="05"
                sectionTitle="ACHIEVEMENTS"
                leftContent={<AchievementsSection />}
                rightContent={<AchievementTimeline />}
            />

            {/* Section 6: Resume + Visualization */}
            <TwoColumnSection
                ref={registerRef('resume')}
                id="resume"
                sectionNumber="06"
                sectionTitle="RESUME"
                leftContent={<ResumeSection />}
                rightContent={<ResumeVisualization />}
            />

            {/* Section 7: Certifications + Certificate Badge */}
            <TwoColumnSection
                ref={registerRef('certifications')}
                id="certifications"
                sectionNumber="07"
                sectionTitle="CERTIFICATIONS"
                leftContent={<CertificationsSection />}
                rightContent={<CertificateBadge />}
            />
        </PageTemplate>
    );
};

export default AboutMe;
