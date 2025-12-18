import React from 'react';
import styles from './TechStackSection.module.css';

const TechStackSection = () => {
    const techStack = {
        languages: ["Python", "C/C++", "JavaScript"],
        webDev: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Bootstrap"],
        tools: ["Git/GitHub", "SQL", "EJS"]
    };

    return (
        <div className={styles.infoBox}>
            <div className={styles.skillCategory}>
                <h4 className={styles.categoryTitle}>Languages</h4>
                <div className={styles.skillTags}>
                    {techStack.languages.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.skillCategory}>
                <h4 className={styles.categoryTitle}>Web Development</h4>
                <div className={styles.skillTags}>
                    {techStack.webDev.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.skillCategory}>
                <h4 className={styles.categoryTitle}>Tools & Others</h4>
                <div className={styles.skillTags}>
                    {techStack.tools.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechStackSection;
