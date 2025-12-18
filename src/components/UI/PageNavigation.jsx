import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageNavigation.module.css";

const NAV_ITEMS = [
    { id: "about-me", systemId: "alpha-centauri", code: "SYS-01", title: "About Me" },
    { id: "projects", systemId: "sirius", code: "SYS-02", title: "Projects" },
    { id: "experience", systemId: "vega", code: "SYS-03", title: "Experience" },
    { id: "contact", systemId: "betelgeuse", code: "SYS-04", title: "Contact" },
    { id: "journey", systemId: "polaris", code: "SYS-05", title: "Journey" },
    { id: "technologies", systemId: "rigel", code: "SYS-06", title: "Technologies" }
];

const PageNavigation = ({ currentPage, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen]);

    // Handle navigation click - reset scroll target when navigating via sidebar
    const handleNavigationClick = (pageId) => {
        if (onNavigate) {
            // Call onNavigate with null section to reset scrollTarget
            onNavigate(pageId, null);
        }
        // Close mobile menu if open
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle keyboard navigation
    const handleKeyDown = (e, pageId) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigationClick(pageId);
        }
    };

    // Desktop Sidebar
    const renderDesktopSidebar = () => (
        <aside
            className={styles.sidebar}
            data-expanded={isExpanded}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Scan line animation */}
            <div className={styles.scanLine} />

            {/* Navigation items */}
            {NAV_ITEMS.map((item, index) => (
                <motion.div
                    key={item.id}
                    className={styles.navItem}
                    data-active={currentPage === item.id}
                    onClick={() => handleNavigationClick(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Navigate to ${item.title}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={styles.navCode}>{item.code}</div>
                    <div className={styles.navTitle}>{item.title}</div>
                    <div className={styles.activeIndicator} />
                </motion.div>
            ))}
        </aside>
    );

    // Mobile Menu
    const renderMobileMenu = () => (
        <>
            {/* Hamburger Button */}
            <button
                className={styles.mobileHamburger}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
            >
                <span className={styles.hamburgerIcon}>☰</span>
            </button>

            {/* Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.drawerOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            className={styles.drawerBackdrop}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer Content */}
                        <motion.div
                            className={styles.drawerContent}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Close Button */}
                            <button
                                className={styles.closeBtn}
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close navigation menu"
                            >
                                ×
                            </button>

                            {/* Navigation Items */}
                            {NAV_ITEMS.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className={styles.drawerItem}
                                    data-active={currentPage === item.id}
                                    onClick={() => handleNavigationClick(item.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <span className={styles.itemCode}>{item.code}</span>
                                    <span className={styles.itemTitle}>{item.title}</span>
                                    {currentPage === item.id && (
                                        <span className={styles.activeMarker}>▶</span>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    return (
        <>
            {renderDesktopSidebar()}
            {renderMobileMenu()}
        </>
    );
};

export default PageNavigation;
