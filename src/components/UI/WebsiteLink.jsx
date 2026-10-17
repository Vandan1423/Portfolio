import { useNavigation, pathForPage } from "../../context/NavigationContext";
import styles from "./WebsiteLink.module.css";

/**
 * WebsiteLink Component
 *
 * A small, always-visible way out of the 3D view to the plain website.
 */
const WebsiteLink = () => {
    const { onNavigate } = useNavigation();

    const handleClick = (e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
        onNavigate("about-me");
    };

    return (
        <a href={pathForPage("about-me")} onClick={handleClick} className={styles.link}>
            View website
        </a>
    );
};

export default WebsiteLink;
