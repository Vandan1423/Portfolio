import React, { useState } from "react";
import styles from "./Projects.module.css";
import { projectsData } from "./projectsData";
import ImageCarousel from "./ImageCarousel";

const Projects = () => {
    const [expandedProjects, setExpandedProjects] = useState({});

    const toggleReadMore = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    return (
        <div className={styles.container}>
            {/* Background - Static Space Image */}
            <div className={styles.spaceBackground}></div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTitle}>
                        <h1 className={styles.mainTitle}>Projects</h1>
                        <div className={styles.titleUnderline}></div>
                    </div>
                    <p className={styles.heroSubtitle}>
                        Explore my journey through code, innovation, and problem-solving
                    </p>
                    <div className={styles.heroStars}>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={styles.heroStar}
                                style={{ '--star-delay': `${i * 0.3}s` }}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollArrow}></div>
                    <span className={styles.scrollText}>Scroll to explore</span>
                </div>
            </section>

            {/* Projects Section */}
            <section className={styles.projectsSection}>
                {projectsData.map((project, index) => (
                    <div key={project.id} className={styles.projectCard}>
                        {/* Project Header */}
                        <div className={styles.projectHeader}>
                            <div className={styles.projectNumber}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className={styles.projectTitleWrapper}>
                                <h2 className={styles.projectTitle}>{project.name}</h2>
                                <div className={styles.statusBadge} data-status={project.status}>
                                    {project.status === "Live" && "🟢 Live"}
                                    {project.status === "In Development" && "🟡 In Development"}
                                    {project.status === "Completed" && "✅ Completed"}
                                </div>
                            </div>
                        </div>

                        {/* Project Info Section */}
                        <div className={styles.projectInfo}>
                            {/* Description */}
                            <p className={styles.projectDescription}>
                                {project.shortDescription}
                            </p>

                            {/* Technologies */}
                            <div className={styles.techSection}>
                                <h4 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>🔧</span>
                                    Tech Stack
                                </h4>
                                <div className={styles.techTags}>
                                    {project.technologies.map((tech, i) => (
                                        <span key={i} className={styles.techTag}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Key Features - Show first 3, rest on Read More */}
                            <div className={styles.featuresSection}>
                                <h4 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>⚡</span>
                                    Key Features
                                </h4>
                                <ul className={styles.featuresList}>
                                    {project.keyFeatures
                                        .slice(0, expandedProjects[project.id] ? project.keyFeatures.length : 3)
                                        .map((feature, i) => {
                                            const [title, description] = feature.split(' - ');
                                            return (
                                                <li key={i} className={styles.featureItem}>
                                                    <span className={styles.featureBullet}>▹</span>
                                                    <div>
                                                        <strong>{title}</strong>
                                                        {description && ` - ${description}`}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>

                            {/* Expandable Details */}
                            {expandedProjects[project.id] && (
                                <div className={styles.expandedDetails}>
                                    {/* Role */}
                                    <div className={styles.detailSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <span className={styles.sectionIcon}>👨‍💻</span>
                                            My Role
                                        </h4>
                                        <p className={styles.detailText}>{project.role}</p>
                                    </div>

                                    {/* Challenges */}
                                    <div className={styles.detailSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <span className={styles.sectionIcon}>🎯</span>
                                            Challenges & Solutions
                                        </h4>
                                        <p className={styles.detailText}>{project.challenges}</p>
                                    </div>

                                    {/* Impact */}
                                    <div className={styles.detailSection}>
                                        <h4 className={styles.sectionTitle}>
                                            <span className={styles.sectionIcon}>📊</span>
                                            Impact & Results
                                        </h4>
                                        <p className={styles.detailText}>{project.impact}</p>
                                    </div>

                                    {/* Note if exists */}
                                    {project.note && (
                                        <div className={styles.noteSection}>
                                            <span className={styles.noteIcon}>💡</span>
                                            <p className={styles.noteText}>{project.note}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Read More Button */}
                            <button
                                className={styles.readMoreBtn}
                                onClick={() => toggleReadMore(project.id)}
                            >
                                {expandedProjects[project.id] ? (
                                    <>
                                        <span>Show Less</span>
                                        <span className={styles.btnArrow}>↑</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Read More</span>
                                        <span className={styles.btnArrow}>↓</span>
                                    </>
                                )}
                            </button>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.actionBtn}
                                    >
                                        <span className={styles.btnIcon}>💻</span>
                                        View Code
                                    </a>
                                )}
                                {project.liveDemo && (
                                    <a
                                        href={project.liveDemo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    >
                                        <span className={styles.btnIcon}>🚀</span>
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Image Carousel Section */}
                        <div className={styles.carouselSection}>
                            <ImageCarousel screenshots={project.screenshots} projectName={project.name} />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Projects;
