import { useTutorial } from "../../context/TutorialContext";
import styles from "./TutorialHint.module.css";

/**
 * TutorialHint Component
 *
 * Shows the current first-visit tip in the 3D view, when the visitor is in
 * the view the tip is about.
 *
 * @param {string} view - 'orbit' or 'piloting'
 */
const TutorialHint = ({ view }) => {
    const { currentTutorialMessage, nextStep, skipTutorial } = useTutorial();

    if (!currentTutorialMessage || currentTutorialMessage.where !== view) return null;

    return (
        <div className={styles.hint} role="status">
            <p className={styles.text}>{currentTutorialMessage.message}</p>
            <div className={styles.actions}>
                <button type="button" className={styles.primary} onClick={nextStep}>
                    Got it
                </button>
                <button type="button" className={styles.secondary} onClick={skipTutorial}>
                    Skip tips
                </button>
            </div>
        </div>
    );
};

export default TutorialHint;
