import { links, person } from "../../../data/profile";
import styles from "./PersonalInfoSection.module.css";

const PersonalInfoSection = () => {
    return (
        <div className={styles.infoBox}>
            <h1 className={styles.name}>{person.name}</h1>
            <p className={styles.tagline}>{person.headline}</p>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email</span>
                    <a href={`mailto:${person.email}`} className={styles.value}>
                        {person.email}
                    </a>
                </div>
            </div>
            <div className={styles.socialLinks}>
                <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                >
                    GitHub
                </a>
                <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                >
                    LinkedIn
                </a>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
