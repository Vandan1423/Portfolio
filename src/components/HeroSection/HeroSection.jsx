import styles from "./HeroSection.module.css";

export default function HeroSection({ mainTitle, heroSubtitle }) {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}>
                    <h1 className={styles.mainTitle}>{mainTitle}</h1>
                    <div className={styles.titleUnderline}></div>
                </div>
                <p className={styles.heroSubtitle}>
                    {heroSubtitle}
                </p>
                <div className={styles.heroStars}>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.heroStar}
                            style={{ "--star-delay": `${i * 0.3}s` }}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollArrow}></div>
                <span className={styles.scrollText}>Scroll to explore</span>
            </div>
        </section>
    );
}
