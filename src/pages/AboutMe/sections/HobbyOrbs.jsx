import React from 'react';
import styles from './HobbyOrbs.module.css';

const HobbyOrbs = () => {
    const hobbies = [
        { name: 'Piano', color: '#4F46E5', delay: '0s', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
        { name: 'Cricket', color: '#F59E0B', delay: '0.5s', icon: 'M12 4v16M4 12h16M7.5 7.5l9 9M7.5 16.5l9-9', circle: true },
        { name: 'Music', color: '#60A5FA', delay: '1s', icon: 'M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z' },
        { name: 'Gaming', color: '#34D399', delay: '1.5s', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        <div className={styles.hobbyOrbsContainer}>
            {hobbies.map((hobby, index) => (
                <div
                    key={index}
                    className={styles.hobbyOrb}
                    style={{
                        '--orb-delay': hobby.delay,
                        '--orb-color': hobby.color
                    }}
                >
                    <div className={styles.orbInner}>
                        <svg className={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            {hobby.circle && (
                                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                            )}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={hobby.icon}
                            />
                        </svg>
                        <span className={styles.orbLabel}>{hobby.name}</span>
                    </div>
                    <div className={styles.orbGlow}></div>
                </div>
            ))}
        </div>
    );
};

export default HobbyOrbs;
