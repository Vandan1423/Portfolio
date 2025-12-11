import React, { useState, useEffect, useRef } from "react";
import styles from "./AboutMe.module.css";

// Achievement tooltip data
const achievementData = [
    {
        title: "Academic Excellence",
        description: "Maintained 8.58 CGPA at IIT Indore in Space Science & Engineering"
    },
    {
        title: "Full-Stack Development",
        description: "Built scalable web applications using React, Node.js, and MongoDB"
    },
    {
        title: "Space Science Engineering",
        description: "Specialized knowledge in aerospace and space technology domains"
    },
    {
        title: "Problem Solving",
        description: "Strong foundation in DSA and competitive programming skills"
    }
];

const AboutMe = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Tooltip interaction with right-side positioning
    useEffect(() => {
        const starNodes = document.querySelectorAll(`.${styles.starNode}`);
        const tooltip = document.getElementById('achievement-tooltip');

        if (!tooltip) return;

        // Star Y positions for each node (matching SVG coordinates)
        const starPositions = [
            { y: 80 },   // Trophy
            { y: 190 },  // Code
            { y: 310 },  // Rocket
            { y: 430 }   // Target
        ];

        starNodes.forEach((node, index) => {
            const handleMouseEnter = () => {
                const data = achievementData[index];
                const titleEl = tooltip.querySelector(`.${styles.tooltipTitle}`);
                const descEl = tooltip.querySelector(`.${styles.tooltipDesc}`);

                if (titleEl && descEl) {
                    titleEl.textContent = data.title;
                    descEl.textContent = data.description;

                    // Position tooltip to the right of the star
                    const position = starPositions[index];
                    const percentage = (position.y / 550) * 100; // Convert to percentage of SVG height

                    tooltip.style.top = `${percentage}%`;
                    tooltip.style.left = '65%';
                    tooltip.style.transform = 'translateY(-50%)';

                    tooltip.classList.add(styles.active);
                }
            };

            const handleMouseLeave = () => {
                tooltip.classList.remove(styles.active);
            };

            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            starNodes.forEach((node) => {
                node.removeEventListener('mouseenter', () => {});
                node.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    // Intersection Observer for grid wave activation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && gridRef.current) {
                    const cells = gridRef.current.querySelectorAll(`.${styles.gridCell}`);
                    cells.forEach((cell, i) => {
                        setTimeout(() => {
                            cell.setAttribute('data-active', 'true');
                        }, i * 50);
                    });
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        if (gridRef.current) {
            observer.observe(gridRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            {/* Background - Static Space Image */}
            <div className={styles.spaceBackground}></div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTitle}>
                        <h1 className={styles.mainTitle}>About Me</h1>
                        <div className={styles.titleUnderline}></div>
                    </div>
                    <p className={styles.heroSubtitle}>
                        Journey through my universe of skills, passions, and achievements
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

            {/* Section 1: Personal Info + Avatar */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>01</span>
                        <h2
                            className={styles.glitchTitle}
                            data-text="PERSONAL INFO"
                        >
                            PERSONAL INFO
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <h1 className={styles.name}>VANDAN NAGORI</h1>
                        <p className={styles.tagline}>Full-Stack Developer</p>
                        <p className={styles.description}>
                            Building scalable web applications with modern
                            technologies
                        </p>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Location</span>
                                <span className={styles.value}>IIT Indore</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Email</span>
                                <a
                                    href="mailto:nagori.vandan04@gmail.com"
                                    className={styles.value}
                                >
                                    nagori.vandan04@gmail.com
                                </a>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Phone</span>
                                <a
                                    href="tel:+917372972514"
                                    className={styles.value}
                                >
                                    +91-7372972514
                                </a>
                            </div>
                        </div>
                        <div className={styles.socialLinks}>
                            <a
                                href="https://github.com/Vandan1423"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialBtn}
                            >
                                <span className={styles.icon}>💻</span> GitHub
                            </a>
                            <a
                                href="https://linkedin.com/in/vandan-nagori-140a132b2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialBtn}
                            >
                                <span className={styles.icon}>🔗</span> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div
                        className={styles.avatarWrapper}
                        style={{
                            transform: `translate(${mousePosition.x / 30}px, ${mousePosition.y / 30}px)
                                       rotateY(${(mousePosition.x / 30) * 0.5}deg)
                                       rotateX(${-(mousePosition.y / 30) * 0.5}deg)`
                        }}
                    >
                        {/* Particle Orbit System */}
                        <div className={styles.particleOrbit}>
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={styles.orbitParticle}
                                    style={{ '--orbit-delay': `${i * 0.5}s` }}
                                />
                            ))}
                        </div>

                        <img
                            src="/images/Avatar.png"
                            alt="Avatar"
                            className={styles.avatarImage}
                        />
                        <div className={styles.avatarGlow}></div>
                    </div>
                </div>
            </section>

            {/* Section 2: Education + Orbital Animation */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>02</span>
                        <h2
                            className={styles.glitchTitle}
                            data-text="EDUCATION"
                        >
                            EDUCATION
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <h3 className={styles.degreeTitle}>
                            B.Tech Space Science & Engineering
                        </h3>
                        <p className={styles.institute}>
                            Indian Institute of Technology, Indore
                        </p>
                        <div className={styles.educationStats}>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>CGPA</span>
                                <span className={styles.statValue}>8.58</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Year</span>
                                <span className={styles.statValue}>
                                    2023 - Present
                                </span>
                            </div>
                        </div>
                        <div className={styles.previousEducation}>
                            <div className={styles.eduItem}>
                                <span>Senior Secondary (CBSE)</span>
                                <span className={styles.percentage}>93.2%</span>
                            </div>
                            <div className={styles.eduItem}>
                                <span>Secondary (CBSE)</span>
                                <span className={styles.percentage}>86.2%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <svg className={styles.orbitalSystem} viewBox="0 0 400 400">
                        <defs>
                            {/* Gradient definitions */}
                            <linearGradient id="ringGradient1" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="ringGradient2" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="ringGradient3" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                            </linearGradient>
                            <radialGradient id="planetGradient">
                                <stop offset="0%" stopColor="#818CF8" />
                                <stop offset="100%" stopColor="#4F46E5" />
                            </radialGradient>
                            <linearGradient id="cometTrail1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
                                <stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="cometTrail2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                                <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="cometTrail3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="blur"/>
                                <feMerge>
                                    <feMergeNode in="blur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Central Planet */}
                        <circle
                            cx="200"
                            cy="200"
                            r="40"
                            fill="url(#planetGradient)"
                            filter="url(#glow)"
                            className={styles.centralPlanet}
                        />

                        {/* Orbit Ring 1 */}
                        <circle
                            cx="200"
                            cy="200"
                            r="100"
                            fill="none"
                            stroke="url(#ringGradient1)"
                            strokeWidth="2"
                            className={styles.orbitRing}
                        />

                        {/* Satellite 1 with comet trail */}
                        <g className={styles.satelliteGroup1}>
                            <path
                                d="M200,100 Q180,100 170,105"
                                fill="none"
                                stroke="url(#cometTrail1)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className={styles.cometTrail}
                            />
                            <circle
                                cx="200"
                                cy="100"
                                r="8"
                                fill="#818CF8"
                                filter="url(#glow)"
                                className={styles.satellite}
                            />
                        </g>

                        {/* Orbit Ring 2 */}
                        <circle
                            cx="200"
                            cy="200"
                            r="140"
                            fill="none"
                            stroke="url(#ringGradient2)"
                            strokeWidth="2"
                            className={styles.orbitRing}
                        />

                        {/* Satellite 2 with comet trail */}
                        <g className={styles.satelliteGroup2}>
                            <path
                                d="M200,60 Q180,60 170,65"
                                fill="none"
                                stroke="url(#cometTrail2)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className={styles.cometTrail}
                            />
                            <circle
                                cx="200"
                                cy="60"
                                r="8"
                                fill="#60A5FA"
                                filter="url(#glow)"
                                className={styles.satellite}
                            />
                        </g>

                        {/* Orbit Ring 3 */}
                        <circle
                            cx="200"
                            cy="200"
                            r="180"
                            fill="none"
                            stroke="url(#ringGradient3)"
                            strokeWidth="2"
                            className={styles.orbitRing}
                        />

                        {/* Satellite 3 with comet trail */}
                        <g className={styles.satelliteGroup3}>
                            <path
                                d="M200,20 Q180,20 170,25"
                                fill="none"
                                stroke="url(#cometTrail3)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className={styles.cometTrail}
                            />
                            <circle
                                cx="200"
                                cy="20"
                                r="8"
                                fill="#F59E0B"
                                filter="url(#glow)"
                                className={styles.satellite}
                            />
                        </g>
                    </svg>
                </div>
            </section>

            {/* Section 3: Interests + Interactive Grid */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>03</span>
                        <h2
                            className={styles.glitchTitle}
                            data-text="INTERESTS"
                        >
                            INTERESTS & HOBBIES
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.interestsGrid}>
                            <div className={styles.interestCard}>
                                <span className={styles.interestIcon}>🎹</span>
                                <h4>Piano</h4>
                                <p>Creating melodies and harmonies</p>
                            </div>
                            <div className={styles.interestCard}>
                                <span className={styles.interestIcon}>🏏</span>
                                <h4>Cricket</h4>
                                <p>Team spirit and strategy</p>
                            </div>
                            <div className={styles.interestCard}>
                                <span className={styles.interestIcon}>🎵</span>
                                <h4>Music</h4>
                                <p>Exploring diverse genres</p>
                            </div>
                            <div className={styles.interestCard}>
                                <span className={styles.interestIcon}>🎮</span>
                                <h4>E-Sports</h4>
                                <p>Competitive gaming passion</p>
                            </div>
                        </div>
                        <div className={styles.funFact}>
                            <span className={styles.funFactLabel}>
                                Fun Fact:
                            </span>
                            <p>"I see the universe in arrays and loops"</p>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.hobbyOrbsContainer}>
                        {/* Piano Orb */}
                        <div className={styles.hobbyOrb} style={{ '--orb-delay': '0s', '--orb-color': '#4F46E5' }}>
                            <div className={styles.orbInner}>
                                <svg className={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span className={styles.orbLabel}>Piano</span>
                            </div>
                            <div className={styles.orbGlow}></div>
                        </div>

                        {/* Cricket Orb */}
                        <div className={styles.hobbyOrb} style={{ '--orb-delay': '0.5s', '--orb-color': '#F59E0B' }}>
                            <div className={styles.orbInner}>
                                <svg className={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="8" strokeWidth={2} />
                                    <path strokeLinecap="round" strokeWidth={2} d="M12 4v16M4 12h16M7.5 7.5l9 9M7.5 16.5l9-9" />
                                </svg>
                                <span className={styles.orbLabel}>Cricket</span>
                            </div>
                            <div className={styles.orbGlow}></div>
                        </div>

                        {/* Music Orb */}
                        <div className={styles.hobbyOrb} style={{ '--orb-delay': '1s', '--orb-color': '#60A5FA' }}>
                            <div className={styles.orbInner}>
                                <svg className={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                </svg>
                                <span className={styles.orbLabel}>Music</span>
                            </div>
                            <div className={styles.orbGlow}></div>
                        </div>

                        {/* Gaming Orb */}
                        <div className={styles.hobbyOrb} style={{ '--orb-delay': '1.5s', '--orb-color': '#34D399' }}>
                            <div className={styles.orbInner}>
                                <svg className={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={styles.orbLabel}>Gaming</span>
                            </div>
                            <div className={styles.orbGlow}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Skills + Tech Visualization */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>04</span>
                        <h2
                            className={styles.glitchTitle}
                            data-text="TECH STACK"
                        >
                            TECH STACK
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.skillCategory}>
                            <h4 className={styles.categoryTitle}>Languages</h4>
                            <div className={styles.skillTags}>
                                {["Python", "C/C++", "JavaScript"].map(
                                    (skill) => (
                                        <span
                                            key={skill}
                                            className={styles.skillTag}
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                        <div className={styles.skillCategory}>
                            <h4 className={styles.categoryTitle}>
                                Web Development
                            </h4>
                            <div className={styles.skillTags}>
                                {[
                                    "React",
                                    "Node.js",
                                    "Express",
                                    "MongoDB",
                                    "Tailwind CSS",
                                    "Bootstrap",
                                ].map((skill) => (
                                    <span
                                        key={skill}
                                        className={styles.skillTag}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.skillCategory}>
                            <h4 className={styles.categoryTitle}>
                                Tools & Others
                            </h4>
                            <div className={styles.skillTags}>
                                {["Git/GitHub", "SQL", "EJS"].map((skill) => (
                                    <span
                                        key={skill}
                                        className={styles.skillTag}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.techVisualization}>
                        <div className={styles.editorHeader}>
                            <div className={styles.editorDots}>
                                <span className={styles.dot} style={{ background: '#FF5F57' }} />
                                <span className={styles.dot} style={{ background: '#FFBD2E' }} />
                                <span className={styles.dot} style={{ background: '#28CA42' }} />
                            </div>
                            <span className={styles.fileName}>skills.js</span>
                        </div>
                        <div className={styles.codeEditor}>
                            <pre className={styles.codeContent}>
                                <code>{`const skills = {
  languages: ["Python", "JavaScript", "C++"],
  web: ["React", "Node.js", "Express", "MongoDB"],
  tools: ["Git/GitHub", "SQL", "Tailwind CSS"]
};

console.log("Building amazing things! 🚀");`}</code>
                                <span className={styles.cursor}></span>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Projects/Achievements */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>05</span>
                        <h2
                            className={styles.glitchTitle}
                            data-text="ACHIEVEMENTS"
                        >
                            ACHIEVEMENTS
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.achievementsList}>
                            <div className={styles.achievementItem}>
                                <div className={styles.achievementIcon}>🏆</div>
                                <div className={styles.achievementContent}>
                                    <h4 className={styles.achievementTitle}>Academic Excellence</h4>
                                    <p className={styles.achievementDesc}>
                                        Maintained 8.58 CGPA at IIT Indore
                                    </p>
                                </div>
                            </div>
                            <div className={styles.achievementItem}>
                                <div className={styles.achievementIcon}>💻</div>
                                <div className={styles.achievementContent}>
                                    <h4 className={styles.achievementTitle}>Full-Stack Development</h4>
                                    <p className={styles.achievementDesc}>
                                        Built scalable web applications with modern tech stack
                                    </p>
                                </div>
                            </div>
                            <div className={styles.achievementItem}>
                                <div className={styles.achievementIcon}>🚀</div>
                                <div className={styles.achievementContent}>
                                    <h4 className={styles.achievementTitle}>Space Science Engineering</h4>
                                    <p className={styles.achievementDesc}>
                                        Specialized in Space Science & Engineering domain
                                    </p>
                                </div>
                            </div>
                            <div className={styles.achievementItem}>
                                <div className={styles.achievementIcon}>🎯</div>
                                <div className={styles.achievementContent}>
                                    <h4 className={styles.achievementTitle}>Problem Solving</h4>
                                    <p className={styles.achievementDesc}>
                                        Strong foundation in DSA and competitive programming
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.achievementVisualization}>
                        {/* Interactive Timeline Constellation */}
                        <div className={styles.constellationTimeline}>
                            <svg className={styles.timelineSvg} viewBox="0 0 300 550">
                                <defs>
                                    {/* Gradients for connecting lines */}
                                    <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
                                    </linearGradient>
                                    <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
                                    </linearGradient>
                                    <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
                                    </linearGradient>

                                    {/* Star gradient */}
                                    <radialGradient id="starGradient">
                                        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
                                    </radialGradient>

                                    {/* Glow filter */}
                                    <filter id="starGlow">
                                        <feGaussianBlur stdDeviation="3" result="blur"/>
                                        <feMerge>
                                            <feMergeNode in="blur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Connecting Lines */}
                                <path
                                    d="M150,80 L150,190"
                                    stroke="url(#lineGradient1)"
                                    strokeWidth="2"
                                    fill="none"
                                    className={styles.timelinePath}
                                    strokeDasharray="120"
                                    strokeDashoffset="120"
                                />
                                <path
                                    d="M150,190 L150,310"
                                    stroke="url(#lineGradient2)"
                                    strokeWidth="2"
                                    fill="none"
                                    className={styles.timelinePath}
                                    strokeDasharray="120"
                                    strokeDashoffset="120"
                                    style={{ animationDelay: '0.3s' }}
                                />
                                <path
                                    d="M150,310 L150,430"
                                    stroke="url(#lineGradient3)"
                                    strokeWidth="2"
                                    fill="none"
                                    className={styles.timelinePath}
                                    strokeDasharray="120"
                                    strokeDashoffset="120"
                                    style={{ animationDelay: '0.6s' }}
                                />

                                {/* Star Node 1 - Trophy */}
                                <g className={styles.starNode} data-node="0">
                                    <circle cx="150" cy="80" r="30" fill="url(#starGradient)" filter="url(#starGlow)" className={styles.starCircle} />
                                    <circle cx="150" cy="80" r="38" fill="none" stroke="#4F46E5" strokeWidth="2" opacity="0.3" className={styles.starRing} />
                                    <text x="150" y="93" fontSize="28" textAnchor="middle" fill="#1A1A2E">🏆</text>

                                    {/* Particle on path */}
                                    <circle cx="150" cy="110" r="3" fill="#818CF8" className={styles.flowParticle}>
                                        <animateMotion
                                            dur="3s"
                                            repeatCount="indefinite"
                                            path="M0,0 L0,80"
                                        />
                                    </circle>
                                </g>

                                {/* Star Node 2 - Code */}
                                <g className={styles.starNode} data-node="1">
                                    <circle cx="150" cy="190" r="30" fill="url(#starGradient)" filter="url(#starGlow)" className={styles.starCircle} />
                                    <circle cx="150" cy="190" r="38" fill="none" stroke="#818CF8" strokeWidth="2" opacity="0.3" className={styles.starRing} />
                                    <text x="150" y="203" fontSize="28" textAnchor="middle" fill="#1A1A2E">💻</text>

                                    <circle cx="150" cy="220" r="3" fill="#60A5FA" className={styles.flowParticle}>
                                        <animateMotion
                                            dur="3s"
                                            repeatCount="indefinite"
                                            begin="0.3s"
                                            path="M0,0 L0,90"
                                        />
                                    </circle>
                                </g>

                                {/* Star Node 3 - Rocket */}
                                <g className={styles.starNode} data-node="2">
                                    <circle cx="150" cy="310" r="30" fill="url(#starGradient)" filter="url(#starGlow)" className={styles.starCircle} />
                                    <circle cx="150" cy="310" r="38" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.3" className={styles.starRing} />
                                    <text x="150" y="323" fontSize="28" textAnchor="middle" fill="#1A1A2E">🚀</text>

                                    <circle cx="150" cy="340" r="3" fill="#F59E0B" className={styles.flowParticle}>
                                        <animateMotion
                                            dur="3s"
                                            repeatCount="indefinite"
                                            begin="0.6s"
                                            path="M0,0 L0,90"
                                        />
                                    </circle>
                                </g>

                                {/* Star Node 4 - Target */}
                                <g className={styles.starNode} data-node="3">
                                    <circle cx="150" cy="430" r="30" fill="url(#starGradient)" filter="url(#starGlow)" className={styles.starCircle} />
                                    <circle cx="150" cy="430" r="38" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.3" className={styles.starRing} />
                                    <text x="150" y="443" fontSize="28" textAnchor="middle" fill="#1A1A2E">🎯</text>
                                </g>
                            </svg>

                            {/* Achievement Details Tooltip */}
                            <div className={styles.achievementTooltip} id="achievement-tooltip">
                                <div className={styles.tooltipContent}>
                                    <h4 className={styles.tooltipTitle}>Achievement</h4>
                                    <p className={styles.tooltipDesc}>Hover over stars to see details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutMe;
