import React, { useState, useEffect, useRef } from "react";
import PageTemplate from "../../components/layouts/PageTemplate/PageTemplate";
import useScrollToSection from "../../hooks/useScrollToSection";
import { useNavigation } from "../../context/NavigationContext";
import journeyData from "../../data/journeyData";
import styles from "./Journey.module.css";

const Journey = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);
    const [visibleItems, setVisibleItems] = useState([]);
    const itemRefs = useRef([]);

    // Observe timeline cards to trigger animations on scroll
    useEffect(() => {
        const VISIBILITY_THRESHOLD = 0.5;
        const HIDE_THRESHOLD = 0.3;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.dataset.index);

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= VISIBILITY_THRESHOLD
                    ) {
                        setVisibleItems((prev) => [
                            ...new Set([...prev, index]),
                        ]);
                    } else if (
                        !entry.isIntersecting ||
                        entry.intersectionRatio < HIDE_THRESHOLD
                    ) {
                        setVisibleItems((prev) =>
                            prev.filter((i) => i !== index)
                        );
                    }
                });
            },
            {
                threshold: [0, 0.3, 0.5, 0.7, 1],
                rootMargin: "-10% 0px -10% 0px",
            }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <PageTemplate
            title="My Journey"
            subtitle="A timeline of growth, learning, and achievement"
        >
            <section className={styles.timelineSection}>
                <div className={styles.timelineWrapper}>
                    <div className={styles.timelinePath}>
                        <div className={styles.pathLine} />
                        <div className={styles.pathGlow} />
                    </div>

                    <div className={styles.timelineItems}>
                        {journeyData.map((item, index) => {
                            const sectionId = `journey-${index + 1}`;
                            const isLeft = index % 2 === 0;
                            const isVisible = visibleItems.includes(index);

                            return (
                                <div
                                    key={index}
                                    id={sectionId}
                                    ref={(el) => {
                                        itemRefs.current[index] = el;
                                        registerRef(sectionId)(el);
                                    }}
                                    data-index={index}
                                    className={`${styles.timelineCard} ${
                                        isLeft ? styles.left : styles.right
                                    } ${isVisible ? styles.visible : ""}`}
                                    style={{
                                        "--card-delay": `${index * 0.15}s`,
                                        "--card-color": item.color,
                                    }}
                                >
                                    <div className={styles.cardContent}>
                                        <div
                                            className={
                                                styles.cardGradientBorder
                                            }
                                        />

                                        <div className={styles.cardHeader}>
                                            <span
                                                className={styles.cardCategory}
                                            >
                                                {item.category}
                                            </span>
                                            <span className={styles.cardYear}>
                                                {item.year}
                                            </span>
                                        </div>

                                        <h3 className={styles.cardTitle}>
                                            {item.title}
                                        </h3>
                                        <p className={styles.cardDescription}>
                                            {item.description}
                                        </p>

                                        <div className={styles.cardParticles}>
                                            <div
                                                className={`${styles.particle} ${styles.particle1}`}
                                            />
                                            <div
                                                className={`${styles.particle} ${styles.particle2}`}
                                            />
                                            <div
                                                className={`${styles.particle} ${styles.particle3}`}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.cardNode}>
                                        <div className={styles.nodeOuterRing} />
                                        <div className={styles.nodeInnerCircle}>
                                            <span className={styles.nodeIcon}>
                                                {item.icon}
                                            </span>
                                        </div>
                                        <div className={styles.nodePulse} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className={styles.visionSection}>
                <div className={styles.visionContent}>
                    <div className={styles.infinityContainer}>
                        <svg
                            className={styles.infinitySvg}
                            viewBox="0 0 200 100"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Infinity symbol"
                        >
                            <path
                                className={styles.infinityPath}
                                d="M 50,50 C 50,20 70,20 100,50 C 130,80 150,80 150,50 C 150,20 130,20 100,50 C 70,80 50,80 50,50"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <circle
                                className={styles.infinityDot}
                                cx="50"
                                cy="50"
                                r="5"
                                fill="#818CF8"
                            />
                            <circle
                                className={styles.infinityDot}
                                cx="150"
                                cy="50"
                                r="5"
                                fill="#818CF8"
                            />
                        </svg>
                        <p className={styles.infinityText}>
                            The Journey Continues...
                        </p>
                    </div>
                </div>
            </section>
        </PageTemplate>
    );
};

export default Journey;
