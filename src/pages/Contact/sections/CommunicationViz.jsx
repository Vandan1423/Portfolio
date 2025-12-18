import React from 'react';
import SVGFilter from '../../../components/common/SVGFilter/SVGFilter';
import styles from './CommunicationViz.module.css';

const CommunicationViz = () => {
    return (
        <div className={styles.communicationViz}>
            <SVGFilter />
            <svg className={styles.vizSvg} viewBox="0 0 400 400">
                <defs>
                    <linearGradient id="messageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                <g className={styles.messageIcon}>
                    <rect
                        x="150"
                        y="150"
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

                {[...Array(8)].map((_, i) => (
                    <circle
                        key={i}
                        cx="200"
                        cy="200"
                        r="4"
                        fill="#818CF8"
                        className={styles.floatingParticle}
                        style={{
                            '--particle-delay': `${i * 0.3}s`,
                            '--particle-angle': `${i * 45}deg`
                        }}
                    />
                ))}

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
    );
};

export default CommunicationViz;
