import { education } from '../../../data/profile';
import styles from './EducationSection.module.css';

const EducationSection = () => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.degreeTitle}>{education.degree}</h3>
                    <p className={styles.institute}>{education.school}</p>
                </div>
                <span className={styles.years}>{education.years}</span>
            </div>
            <div className={styles.educationStats}>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>CGPA</span>
                    <span className={styles.statValue}>{education.cgpa}</span>
                </div>
                {(education.schooling || []).map((school) => (
                    <div key={school.name} className={styles.statBox}>
                        <span className={styles.statLabel}>{school.name}</span>
                        <span className={styles.statValue}>
                            {school.score} <span className={styles.statYear}>{school.year}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationSection;
