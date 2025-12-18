/**
 * ProgressDisplay Component
 *
 * Displays loading progress with a vertical altitude gauge and asset information.
 * Features:
 * - Vertical gauge with percentage markers (0%, 25%, 50%, 75%, 100%)
 * - Moving indicator showing current progress
 * - Asset counter and current asset name
 *
 * Matches the space/rocket theme with altitude-based visualization.
 */

import styles from './RocketLoader.module.css';

const ProgressDisplay = ({ progress, currentAsset, loadedAssets, totalAssets }) => {
    return (
        <div className={styles.progressContainer}>
            {/* Vertical Altitude Gauge (Left Side) */}
            <div className={styles.altitudeGauge}>
                {/* Gauge track */}
                <div className={styles.gaugeTrack}>
                    {/* Filled portion */}
                    <div
                        className={styles.gaugeFill}
                        style={{ height: `${progress}%` }}
                    />

                    {/* Moving marker with percentage */}
                    <div
                        className={styles.gaugeMarker}
                        style={{ bottom: `${progress}%` }}
                    >
                        <span className={styles.percentageText}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Gauge scale labels */}
                <div className={styles.gaugeLabels}>
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>
            </div>

            {/* Asset Information (Bottom Center) */}
            <div className={styles.assetInfo}>
                {/* Asset counter */}
                <div className={styles.loadingText}>
                    LOADING ASSETS
                </div>

                {/* Asset count display */}
                <div className={styles.assetCount}>
                    {loadedAssets} / {totalAssets}
                </div>

                {/* Loading indicator dots */}
                <div className={styles.loadingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default ProgressDisplay;
