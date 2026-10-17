import { person } from "../../data/profile";
import styles from "./FullscreenPrompt.module.css";

/**
 * FullscreenPrompt Component
 *
 * The first screen on desktop: enter the 3D view (full screen, or in the
 * window) or go to the plain website.
 */
const FullscreenPrompt = ({ onDismiss, onViewWebsite }) => {
    // Called straight from the click, so the browser counts it as a user gesture
    const enterFullscreen = () => {
        const elem = document.documentElement;
        const request =
            elem.requestFullscreen ||
            elem.webkitRequestFullscreen || // Safari
            elem.msRequestFullscreen;
        request?.call(elem)?.catch?.(() => {});
        onDismiss();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.panel} role="dialog" aria-labelledby="landing-title">
                <h1 id="landing-title" className={styles.name}>{person.name}</h1>
                <p className={styles.headline}>{person.headline}</p>
                <p className={styles.text}>
                    Fly through the portfolio in 3D, or read it as a website.
                </p>

                <div className={styles.buttons}>
                    <button type="button" onClick={enterFullscreen} className={styles.primary} autoFocus>
                        Enter 3D
                    </button>
                    <button type="button" onClick={onViewWebsite} className={styles.secondary}>
                        View website
                    </button>
                </div>

                <p className={styles.hint}>
                    3D opens full screen. Press <kbd>Esc</kbd> to leave it, or{" "}
                    <button type="button" onClick={onDismiss} className={styles.textButton}>
                        stay in this window
                    </button>
                    .
                </p>
            </div>
        </div>
    );
};

export default FullscreenPrompt;
