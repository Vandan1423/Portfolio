import React, { useState, useEffect, useRef } from 'react';
import styles from './AvatarVisualization.module.css';

const AvatarVisualization = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

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

    return (
        <div className={styles.container} ref={containerRef}>
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
    );
};

export default AvatarVisualization;
