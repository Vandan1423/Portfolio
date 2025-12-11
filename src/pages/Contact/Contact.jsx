import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create mailto link with form data
        const mailtoLink = `mailto:nagori.vandan04@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;

        setFormStatus({ submitted: true, error: false });
        setFormData({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => {
            setFormStatus({ submitted: false, error: false });
        }, 5000);
    };

    return (
        <div className={styles.container}>
            {/* Background - Static Space Image */}
            <div className={styles.spaceBackground}></div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTitle}>
                        <h1 className={styles.mainTitle}>Get In Touch</h1>
                        <div className={styles.titleUnderline}></div>
                    </div>
                    <p className={styles.heroSubtitle}>
                        Let's connect and create something amazing together
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

            {/* Contact Section */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>01</span>
                        <h2 className={styles.glitchTitle} data-text="SEND MESSAGE">
                            SEND MESSAGE
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <form onSubmit={handleSubmit} className={styles.contactForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="Your name"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="subject" className={styles.label}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    rows="6"
                                    required
                                    placeholder="Your message here..."
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                <span className={styles.btnText}>Send Message</span>
                                <span className={styles.btnIcon}>🚀</span>
                            </button>

                            {formStatus.submitted && (
                                <div className={styles.successMessage}>
                                    Message sent successfully!
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className={styles.rightContent}>
                    {/* Animated Communication Visualization */}
                    <div className={styles.communicationViz}>
                        <svg className={styles.vizSvg} viewBox="0 0 400 400">
                            <defs>
                                <linearGradient id="messageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="blur"/>
                                    <feMerge>
                                        <feMergeNode in="blur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Central Message Icon */}
                            <g className={styles.messageIcon}>
                                <rect
                                    x="150"
                                    y="160"
                                    width="100"
                                    height="80"
                                    rx="10"
                                    fill="url(#messageGradient)"
                                    filter="url(#glow)"
                                />
                                <path
                                    d="M150,150 L200,190 L250,150"
                                    fill="none"
                                    stroke="#1A1A2E"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="200"
                                    cy="200"
                                    r="80"
                                    fill="none"
                                    stroke="url(#messageGradient)"
                                    strokeWidth="2"
                                    opacity="0.3"
                                    className={styles.messageRing}
                                />
                            </g>

                            {/* Signal Waves */}
                            <g className={styles.signalWaves}>
                                <path
                                    d="M280,180 Q300,200 280,220"
                                    fill="none"
                                    stroke="#4F46E5"
                                    strokeWidth="2"
                                    opacity="0.6"
                                    className={styles.wave}
                                />
                                <path
                                    d="M300,170 Q330,200 300,230"
                                    fill="none"
                                    stroke="#818CF8"
                                    strokeWidth="2"
                                    opacity="0.4"
                                    className={styles.wave}
                                    style={{ animationDelay: '0.3s' }}
                                />
                                <path
                                    d="M120,180 Q100,200 120,220"
                                    fill="none"
                                    stroke="#4F46E5"
                                    strokeWidth="2"
                                    opacity="0.6"
                                    className={styles.wave}
                                />
                                <path
                                    d="M100,170 Q70,200 100,230"
                                    fill="none"
                                    stroke="#818CF8"
                                    strokeWidth="2"
                                    opacity="0.4"
                                    className={styles.wave}
                                    style={{ animationDelay: '0.3s' }}
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className={styles.section}>
                <div className={styles.leftContent}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>02</span>
                        <h2 className={styles.glitchTitle} data-text="CONTACT INFO">
                            CONTACT INFO
                        </h2>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.contactInfoGrid}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>📧</div>
                                <h4 className={styles.infoTitle}>Email</h4>
                                <a href="mailto:nagori.vandan04@gmail.com" className={styles.infoValue}>
                                    nagori.vandan04@gmail.com
                                </a>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>📱</div>
                                <h4 className={styles.infoTitle}>Phone</h4>
                                <a href="tel:+917372972514" className={styles.infoValue}>
                                    +91-7372972514
                                </a>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>📍</div>
                                <h4 className={styles.infoTitle}>Location</h4>
                                <p className={styles.infoValue}>IIT Indore, India</p>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>⏰</div>
                                <h4 className={styles.infoTitle}>Availability</h4>
                                <p className={styles.infoValue}>Open to opportunities</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.rightContent}>
                    {/* Social Links Visualization */}
                    <div className={styles.socialViz}>
                        <div className={styles.socialOrb}>
                            <a
                                href="https://github.com/Vandan1423"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                style={{ '--link-delay': '0s', '--link-angle': '0deg' }}
                            >
                                <div className={styles.socialIcon}>💻</div>
                                <span className={styles.socialLabel}>GitHub</span>
                            </a>

                            <a
                                href="https://linkedin.com/in/vandan-nagori-140a132b2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                style={{ '--link-delay': '0.2s', '--link-angle': '90deg' }}
                            >
                                <div className={styles.socialIcon}>🔗</div>
                                <span className={styles.socialLabel}>LinkedIn</span>
                            </a>

                            <a
                                href="mailto:nagori.vandan04@gmail.com"
                                className={styles.socialLink}
                                style={{ '--link-delay': '0.4s', '--link-angle': '180deg' }}
                            >
                                <div className={styles.socialIcon}>📧</div>
                                <span className={styles.socialLabel}>Email</span>
                            </a>

                            <a
                                href="tel:+917372972514"
                                className={styles.socialLink}
                                style={{ '--link-delay': '0.6s', '--link-angle': '270deg' }}
                            >
                                <div className={styles.socialIcon}>📱</div>
                                <span className={styles.socialLabel}>Phone</span>
                            </a>

                            {/* Center Orb */}
                            <div className={styles.centerOrb}>
                                <span className={styles.centerText}>Connect</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
