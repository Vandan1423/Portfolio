import { useGameMode } from '../../context/GameModeContext';
import styles from './PilotingHUD.module.css';

/**
 * PilotingHUD Component
 *
 * Heads-up display for spaceship piloting mode showing:
 * - Speed indicator
 * - Boost status
 * - Nearest planet name + distance
 * - Landing prompt when near a planet
 * - Control hints
 */
const PilotingHUD = () => {
    const {
        shipVelocity,
        thrustLevel,
        isBoosting,
        nearestPlanet,
        canLand,
    } = useGameMode();

    // Calculate speed (units per second)
    const speed = Math.round(shipVelocity.length());
    const maxSpeed = isBoosting ? 120 : 60;
    const speedPercent = Math.min((speed / maxSpeed) * 100, 100);

    return (
        <div className={styles.container}>
            {/* Left panel - Speed and status */}
            <div className={styles.leftPanel}>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <span className={styles.title}>Speed</span>
                    </div>

                    <div className={styles.speedDisplay}>
                        <span className={styles.speedValue}>{speed}</span>
                        <span className={styles.speedUnit}>u/s</span>
                    </div>

                    <div className={styles.speedBar}>
                        <div
                            className={`${styles.speedFill} ${isBoosting ? styles.boosting : ''}`}
                            style={{ width: `${speedPercent}%` }}
                        />
                    </div>

                    {isBoosting && (
                        <div className={styles.boostIndicator}>
                            <span>Boost on</span>
                        </div>
                    )}

                    {thrustLevel > 0 && !isBoosting && (
                        <div className={styles.thrustIndicator}>
                            <span>Thrust</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right panel - Navigation */}
            <div className={styles.rightPanel}>
                {nearestPlanet && (
                    <div className={styles.panel}>
                        <div className={styles.header}>
                            <span className={styles.title}>Nearest planet</span>
                        </div>

                        <div className={styles.planetInfo}>
                            <span className={styles.planetName}>{nearestPlanet.name}</span>
                            <span className={styles.planetDistance}>
                                {Math.round(nearestPlanet.distance)} units
                            </span>
                        </div>

                        {canLand && (
                            <div className={styles.landingPrompt}>
                                <span className={styles.landKey}>L</span>
                                <span>Land here</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom panel - Controls */}
            <div className={styles.bottomPanel}>
                <div className={styles.controlsHint}>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>Mouse</span>
                        <span className={styles.action}>Look / Steer</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>W S</span>
                        <span className={styles.action}>Thrust</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>A D</span>
                        <span className={styles.action}>Strafe</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>Shift</span>
                        <span className={styles.action}>Boost</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>Space</span>
                        <span className={styles.action}>Brake</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>Q E</span>
                        <span className={styles.action}>Roll</span>
                    </div>
                    <div className={styles.controlGroup}>
                        <span className={styles.key}>Esc</span>
                        <span className={styles.action}>Exit</span>
                    </div>
                </div>
            </div>

            {/* Center crosshair */}
            <div className={styles.crosshair}>
                <div className={styles.crosshairInner} />
            </div>
        </div>
    );
};

export default PilotingHUD;
