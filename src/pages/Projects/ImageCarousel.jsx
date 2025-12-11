import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";

const ImageCarousel = ({ screenshots, projectName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState({});

    // Navigate to next image
    const nextImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    };

    // Navigate to previous image
    const prevImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    // Open fullscreen
    const openFullscreen = () => {
        setIsFullscreen(true);
    };

    // Close fullscreen
    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    // Keyboard navigation in fullscreen
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyPress = (e) => {
            if (e.key === "Escape") closeFullscreen();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isFullscreen, currentIndex]);

    // Handle image load
    const handleImageLoad = (index) => {
        setImageLoaded(prev => ({ ...prev, [index]: true }));
    };

    // Reset current index when screenshots change
    useEffect(() => {
        setCurrentIndex(0);
    }, [screenshots]);

    if (!screenshots || screenshots.length === 0) {
        return (
            <div className={styles.noImages}>
                <span className={styles.noImagesIcon}>🖼️</span>
                <p>No screenshots available</p>
            </div>
        );
    }

    return (
        <>
            <div className={styles.carousel}>
                {/* Main Image Display */}
                <div className={styles.mainImageWrapper}>
                    {/* Loading Skeleton */}
                    {!imageLoaded[currentIndex] && (
                        <div className={styles.imageSkeleton}>
                            <div className={styles.skeletonPulse}></div>
                        </div>
                    )}

                    {/* Main Image */}
                    <img
                        src={screenshots[currentIndex]}
                        alt={`${projectName} Screenshot ${currentIndex + 1}`}
                        className={styles.mainImage}
                        onClick={openFullscreen}
                        onLoad={() => handleImageLoad(currentIndex)}
                        style={{ display: imageLoaded[currentIndex] ? 'block' : 'none' }}
                    />

                    {/* Fullscreen Button */}
                    <button
                        className={styles.fullscreenBtn}
                        onClick={openFullscreen}
                        title="View Fullscreen"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </button>

                    {/* Navigation Arrows - Only show if more than 1 image */}
                    {screenshots.length > 1 && (
                        <>
                            <button
                                className={`${styles.navArrow} ${styles.navArrowLeft}`}
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                className={`${styles.navArrow} ${styles.navArrowRight}`}
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className={styles.imageCounter}>
                        {currentIndex + 1} / {screenshots.length}
                    </div>
                </div>

                {/* Thumbnail Navigation - Only show if more than 1 image */}
                {screenshots.length > 1 && (
                    <div className={styles.thumbnailNav}>
                        {screenshots.map((screenshot, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnail} ${
                                    index === currentIndex ? styles.activeThumbnail : ""
                                }`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`View screenshot ${index + 1}`}
                            >
                                <img
                                    src={screenshot}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={styles.thumbnailImage}
                                />
                                {index === currentIndex && (
                                    <div className={styles.thumbnailOverlay}></div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className={styles.fullscreenModal} onClick={closeFullscreen}>
                    {/* Close Button */}
                    <button className={styles.closeBtn} onClick={closeFullscreen}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Fullscreen Image */}
                    <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={screenshots[currentIndex]}
                            alt={`${projectName} Screenshot ${currentIndex + 1}`}
                            className={styles.fullscreenImage}
                        />

                        {/* Navigation in Fullscreen */}
                        {screenshots.length > 1 && (
                            <>
                                <button
                                    className={`${styles.fullscreenArrow} ${styles.fullscreenArrowLeft}`}
                                    onClick={prevImage}
                                >
                                    ‹
                                </button>
                                <button
                                    className={`${styles.fullscreenArrow} ${styles.fullscreenArrowRight}`}
                                    onClick={nextImage}
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {/* Counter in Fullscreen */}
                        <div className={styles.fullscreenCounter}>
                            {currentIndex + 1} / {screenshots.length}
                        </div>

                        {/* Thumbnail Nav in Fullscreen */}
                        {screenshots.length > 1 && (
                            <div className={styles.fullscreenThumbnails}>
                                {screenshots.map((screenshot, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.fullscreenThumbnail} ${
                                            index === currentIndex ? styles.activeFullscreenThumbnail : ""
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(index);
                                        }}
                                    >
                                        <img
                                            src={screenshot}
                                            alt={`Thumbnail ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Keyboard Hints */}
                        <div className={styles.keyboardHints}>
                            <span>← → Navigate</span>
                            <span>ESC Close</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageCarousel;
