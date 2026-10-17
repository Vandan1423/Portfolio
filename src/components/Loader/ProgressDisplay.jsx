/**
 * ProgressDisplay Component
 *
 * The first-visit loading screen: name, a thin progress bar and the asset count.
 */

import { person } from '../../data/profile';
import styles from './RocketLoader.module.css';

const ProgressDisplay = ({ progress, loadedAssets, totalAssets }) => {
    const percent = Math.round(progress);

    return (
        <div className={styles.progressContainer}>
            <p className={styles.name}>{person.name}</p>
            <div
                className={styles.bar}
                role="progressbar"
                aria-label="Loading the 3D scene"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
            >
                <div className={styles.barFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.meta}>
                <span>Loading the 3D scene</span>
                <span className={styles.count}>
                    {loadedAssets} / {totalAssets} · {percent}%
                </span>
            </div>
        </div>
    );
};

export default ProgressDisplay;
