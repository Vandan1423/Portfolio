import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTutorial } from "../../context/TutorialContext";
import SystemMap from "./SystemMap";
import PlanetList from "./PlanetList";
import styles from "./NavigationScreen.module.css";

/**
 * NavigationScreen Component
 *
 * Futuristic cyberpunk-style HUD dashboard
 * Inspired by sci-fi interfaces with angular shapes and holographic effects
 *
 * Features:
 * - Angular geometric design with cut corners
 * - Animated scan lines and glitch effects
 * - Glowing cyan/blue accents
 * - Holographic panel overlays
 * - Tech-style grid patterns
 *
 * Props:
 * @param {boolean} isVisible - Controls visibility of the navigation screen
 * @param {function} onClose - Callback when screen is closed
 * @param {function} onPlanetSelect - Callback when a planet is selected (opens planet detail)
 * @param {object} selectedPlanet - Currently selected planet object (unused, kept for compatibility)
 * @param {array} planets - Array of planet data
 */
const NavigationScreen = ({
    isVisible,
    onClose,
    onPlanetSelect,
    onSystemTravelSelect,
    currentSystemId,
    selectedPlanet,
    planets = [],
    starSystems = [],
}) => {
    const [currentView, setCurrentView] = useState("main-menu");
    // Views: 'main-menu', 'planet-list', 'system-map', 'system-travel'

    // Tutorial context
    const { isActive: tutorialActive, currentStep: tutorialStep, nextStep: tutorialNextStep, completeStep: tutorialCompleteStep } = useTutorial();

    const handleViewChange = (view) => {
        setCurrentView(view);

        // Tutorial: Track navigation menu clicks
        if (tutorialActive) {
            if (tutorialStep === 'NAV_LOCAL_SECTOR' && view === 'planet-list') {
                // Show planet list and go directly to planet selection
                tutorialNextStep('PLANET_SELECTION');
            } else if (tutorialStep === 'NAV_TACTICAL_MAP' && view === 'system-map') {
                // Show tactical map
                tutorialNextStep('NAV_MAP_VIEW');
            } else if (tutorialStep === 'NAV_WARP_DRIVE' && view === 'system-travel') {
                // Show system list and go directly to system selection
                tutorialCompleteStep('NAV_WARP_DRIVE', {
                    id: 'warp-capable',
                    icon: '⚡',
                    name: "WARP CAPABLE",
                    description: "Mastered inter-system navigation"
                });
                tutorialNextStep('SELECT_DESTINATION');
            }
        }
    };

    const handleBack = () => {
        setCurrentView("main-menu");

        // Tutorial: Track back button from tactical map to auto-focus A3
        if (tutorialActive && tutorialStep === 'NAV_MAP_VIEW') {
            // Don't close navigation - just go back to main menu and advance tutorial
            tutorialNextStep('NAV_WARP_DRIVE');
        }
    };

    // Handle planet click - this opens the planet detail scene
    const handlePlanetClick = (planet) => {
        if (onPlanetSelect) {
            onPlanetSelect(planet);
        }

        // Tutorial: When planet is selected, advance to info panel step
        // Delay slightly to ensure planet detail scene is rendered
        if (tutorialActive && tutorialStep === 'PLANET_SELECTION') {
            setTimeout(() => {
                tutorialNextStep('PLANET_INFO_PANEL');
            }, 800); // Wait for navigation to close and planet scene to render
        }
    };

    // Reset view when navigation closes
    const handleClose = () => {
        // During tutorial, prevent closing until user completes the required action
        if (tutorialActive) {
            // Don't allow closing during most tutorial steps
            // User should follow the tutorial flow
            const preventCloseSteps = [
                'NAV_LOCAL_SECTOR',
                'NAV_TACTICAL_MAP',
                'NAV_MAP_VIEW',
                'NAV_WARP_DRIVE'
            ];
            if (preventCloseSteps.includes(tutorialStep)) {
                return;
            }
        }
        setCurrentView("main-menu");
        onClose();
    };

    // Tutorial: No longer auto-close - user will click back button instead

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        exit={{ opacity: 0 }}
                        className={styles.backdrop}
                        onClick={handleClose}
                    ></motion.div>

                    {/* Centered Floating Panel */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0, x: "-50%" }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.panel}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main Container with Angular Design */}
                        <div style={{ position: "relative", height: "100%" }}>
                            {/* Animated Background Grid */}
                            <div className={styles.gridPattern}></div>

                            {/* Scan Line Animation */}
                            <div className={styles.scanLineContainer}>
                                <motion.div
                                    className={styles.scanLine}
                                    animate={{ y: [0, 800] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                ></motion.div>
                            </div>

                            {/* Angular Frame with Cut Corners */}
                            <div className={styles.angularFrame}>
                                {/* Corner Accents */}
                                <div className={styles.cornerTopLeft}></div>
                                <div className={styles.cornerBottomRight}></div>

                                {/* Animated Corner Lines */}
                                <svg className={styles.cornerLinesSvg}>
                                    <motion.path
                                        d="M 30 0 L 0 30 L 0 100"
                                        stroke="rgba(0,255,255,0.6)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </svg>

                                {/* Header Section */}
                                <div className={styles.header}>
                                    {/* Tech Pattern Background */}
                                    <div className={styles.headerPattern}></div>

                                    {/* Title with Holographic Effect */}
                                    <div className={styles.headerContent}>
                                        <div>
                                            <h2 className={styles.title}>
                                                DASHBOARD
                                            </h2>
                                            <motion.div
                                                className={
                                                    styles.titleUnderline
                                                }
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.3,
                                                }}
                                            ></motion.div>
                                        </div>

                                        {/* Close Button with Tech Frame */}
                                        <button
                                            onClick={handleClose}
                                            className={styles.closeButton}
                                            aria-label="Close Navigation"
                                        >
                                            <div
                                                className={
                                                    styles.closeButtonFrame
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.closeButtonIcon
                                                    }
                                                >
                                                    ×
                                                </span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Subtitle/Status */}
                                    <div className={styles.statusBar}>
                                        <div
                                            className={styles.statusIndicator}
                                        ></div>
                                        <p className={styles.statusText}>
                                            {currentView === "main-menu" &&
                                                "System Online"}
                                            {currentView === "planet-list" &&
                                                "Sector Navigation"}
                                            {currentView === "system-map" &&
                                                "Tactical Overview"}
                                            {currentView === "system-travel" &&
                                                "Warp Protocol"}
                                        </p>
                                    </div>

                                    {/* Decorative Tech Elements */}
                                    <div
                                        className={styles.headerBottomLine}
                                    ></div>
                                </div>

                                {/* Content Area and Footer Wrapper (for tutorial spotlight) */}
                                <div
                                    data-tutorial={
                                        currentView === "planet-list" ? "planet-list-view" :
                                        currentView === "system-map" ? "tactical-map-view" :
                                        currentView === "system-travel" ? "system-travel-view" :
                                        undefined
                                    }
                                    style={{ flex: 1, display: "flex", flexDirection: "column" }}
                                >
                                    {/* Content Area */}
                                    <div className={styles.contentArea}>
                                        <AnimatePresence mode="wait">
                                            {currentView === "main-menu" && (
                                                <MainMenu
                                                    key="main-menu"
                                                    onViewChange={handleViewChange}
                                                />
                                            )}
                                            {currentView === "planet-list" && (
                                                <PlanetList
                                                    key="planet-list"
                                                    planets={planets}
                                                    selectedPlanet={selectedPlanet}
                                                    onPlanetClick={
                                                        handlePlanetClick
                                                    }
                                                />
                                            )}
                                            {currentView === "system-map" && (
                                                <SystemMap
                                                    key="system-map"
                                                    planets={planets}
                                                    selectedPlanet={selectedPlanet}
                                                    onPlanetClick={
                                                        handlePlanetClick
                                                    }
                                                />
                                            )}
                                            {currentView === "system-travel" && (
                                                <SystemTravelList
                                                    key="system-travel"
                                                    starSystems={starSystems}
                                                    currentSystemId={
                                                        currentSystemId
                                                    }
                                                    onSystemSelect={
                                                        onSystemTravelSelect
                                                    }
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer - Back Button */}
                                    {currentView !== "main-menu" && (
                                        <div className={styles.footer}>
                                            <div
                                                className={styles.footerTopLine}
                                            ></div>

                                            <button
                                                onClick={handleBack}
                                                className={styles.backButton}
                                                data-tutorial="back-button"
                                            >
                                                <div
                                                    className={styles.backButtonBg}
                                                ></div>
                                                <div
                                                    className={
                                                        styles.backButtonHighlight
                                                    }
                                                ></div>
                                                <span
                                                    className={
                                                        styles.backButtonText
                                                    }
                                                >
                                                    <span>←</span>
                                                    <span>RETURN</span>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * MainMenu Component
 * Cyberpunk-styled navigation cards with angular design
 */
const MainMenu = ({ onViewChange }) => {
    const menuOptions = [
        {
            id: "planet-list",
            title: "LOCAL SECTOR",
            code: "A1",
            description:
                "Explore planets of this star system",
            available: true,
            color: "cyan",
        },
        {
            id: "system-map",
            title: "TACTICAL MAP",
            code: "A2",
            description: "System overview & coordinates",
            available: true,
            color: "blue",
        },
        {
            id: "system-travel",
            title: "WARP DRIVE",
            code: "A3",
            description: "Travel through different pages",
            available: true,
            color: "purple",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.menuContainer}
        >
            {menuOptions.map((option, index) => (
                <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 100,
                    }}
                    onClick={() => option.available && onViewChange(option.id)}
                    disabled={!option.available}
                    className={styles.menuOption}
                    data-tutorial={
                        option.id === 'planet-list' ? 'local-sector' :
                        option.id === 'system-map' ? 'tactical-map' :
                        option.id === 'system-travel' ? 'warp-drive' :
                        undefined
                    }
                >
                    {/* Angular Container */}
                    <div className={styles.menuOptionAngular}>
                        <div
                            className={`${styles.menuOptionContent} ${
                                !option.available
                                    ? styles.menuOptionDisabled
                                    : ""
                            }`}
                        >
                            {/* Tech Corner Accent */}
                            <div className={styles.menuOptionCorner}></div>

                            {/* Hover Scan Line */}
                            <motion.div
                                className={styles.menuScanLine}
                                initial={{ y: "-100%" }}
                                whileHover={
                                    option.available
                                        ? {
                                              y: "100%",
                                              transition: {
                                                  duration: 0.6,
                                                  ease: "linear",
                                              },
                                          }
                                        : {}
                                }
                            ></motion.div>

                            <div className={styles.menuOptionInner}>
                                {/* Code Label */}
                                <div className={styles.menuCodeLabel}>
                                    <span
                                        className={`${styles.menuCodeText} ${
                                            !option.available
                                                ? styles.menuCodeTextDisabled
                                                : ""
                                        }`}
                                    >
                                        {option.code}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className={styles.menuTextContent}>
                                    <h3
                                        className={`${styles.menuTitle} ${
                                            !option.available
                                                ? styles.menuTitleDisabled
                                                : ""
                                        }`}
                                    >
                                        {option.title}
                                    </h3>
                                    <p
                                        className={`${styles.menuDescription} ${
                                            !option.available
                                                ? styles.menuDescriptionDisabled
                                                : ""
                                        }`}
                                    >
                                        {option.description}
                                    </p>
                                </div>

                                {/* Badge */}
                                {option.badge && (
                                    <div className={styles.menuBadge}>
                                        {option.badge}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Accent Line */}
                            {option.available && (
                                <div className={styles.menuBottomAccent}></div>
                            )}
                        </div>
                    </div>

                    {/* Glow Effect on Hover */}
                    {option.available && (
                        <div className={styles.menuOptionGlow}></div>
                    )}
                </motion.button>
            ))}
        </motion.div>
    );
};

/**
 * SystemTravelList Component
 * Displays all available star systems for inter-system navigation
 * Each star system represents a different page of the portfolio
 */
const SystemTravelList = ({ starSystems, currentSystemId, onSystemSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.travelListContainer}
        >
            {/* Header */}
            <div className={styles.travelListHeader}>
                <h3 className={styles.travelListTitle}>
                    Available Star Systems
                </h3>
                <p className={styles.travelListSubtitle}>
                    Select any star system to travel to its corresponding page.
                </p>
            </div>

            {/* Star Systems List */}
            {starSystems.map((system, index) => {
                const isCurrent = system.id === currentSystemId;
                // Find the second non-current system for tutorial
                const nonCurrentSystems = starSystems.filter(s => s.id !== currentSystemId);
                const isSecondNonCurrent = !isCurrent &&
                    nonCurrentSystems.length > 1 &&
                    system.id === nonCurrentSystems[1].id;

                return (
                    <motion.div
                        key={system.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100,
                        }}
                        onClick={() => {
                            if (!isCurrent && onSystemSelect) {
                                onSystemSelect(system.id);
                            }
                        }}
                        className={`${styles.systemItem} ${
                            isCurrent
                                ? styles.systemItemCurrent
                                : styles.systemItemClickable
                        }`}
                        data-tutorial={isSecondNonCurrent ? "second-system" : undefined}
                    >
                        {/* Angular Container */}
                        <div className={styles.systemItemAngular}>
                            <div
                                className={`${styles.systemItemContent} ${
                                    isCurrent
                                        ? styles.systemItemContentCurrent
                                        : ""
                                }`}
                            >
                                {/* Hover Scan Effect */}
                                {!isCurrent && (
                                    <motion.div
                                        className={styles.systemScanEffect}
                                        initial={{ y: "-100%" }}
                                        whileHover={{
                                            y: "100%",
                                            transition: {
                                                duration: 0.5,
                                                ease: "linear",
                                            },
                                        }}
                                    ></motion.div>
                                )}

                                <div className={styles.systemItemInner}>
                                    {/* System Code */}
                                    <div
                                        className={`${styles.systemCode} ${
                                            isCurrent
                                                ? styles.systemCodeCurrent
                                                : ""
                                        }`}
                                    >
                                        <span className={styles.systemCodeText}>
                                            {system.code}
                                        </span>
                                    </div>

                                    {/* System Info */}
                                    <div className={styles.systemInfo}>
                                        <div
                                            className={styles.systemInfoHeader}
                                        >
                                            <h4 className={styles.systemName}>
                                                {system.name}
                                            </h4>
                                            <div className={styles.systemDot}>
                                                •
                                            </div>
                                            <span className={styles.systemPage}>
                                                {system.page}
                                            </span>
                                        </div>
                                        <p className={styles.systemDescription}>
                                            {system.description}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div
                                        className={styles.statusBadgeContainer}
                                    >
                                        {isCurrent ? (
                                            <div
                                                className={styles.currentBadge}
                                            >
                                                <span
                                                    className={
                                                        styles.currentBadgeText
                                                    }
                                                >
                                                    CURRENT
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={styles.arrowIcon}>
                                                <span
                                                    className={
                                                        styles.arrowIconText
                                                    }
                                                >
                                                    →
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Accent Line */}
                                {!isCurrent && (
                                    <div
                                        className={styles.systemBottomAccent}
                                    ></div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default NavigationScreen;
