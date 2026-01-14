import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";

// Optimize Cloudinary URLs for faster loading
const optimizeCloudinaryUrl = (url, options = {}) => {
    // Return original URL if it's undefined/null
    if (!url) return url;
    
    // Return original URL if it's NOT a Cloudinary URL (local images)
    if (!url.includes('cloudinary.com')) {
        return url;
    }

    const { width = 'auto', quality = 'auto', format = 'auto', thumbnail = false } = options;

    // Extract the base URL and image path
    const parts = url.split('/upload/');
    if (parts.length !== 2) {
        return url;
    }

    // Build transformation string
    const transformations = [];

    if (thumbnail) {
        // Smaller transformations for thumbnails
        transformations.push('w_150');
        transformations.push('h_100');
        transformations.push('c_fill');
        transformations.push('q_60');
        transformations.push('f_auto');
    } else {
        // Full-size image optimizations
        if (width !== 'auto') {
            transformations.push(`w_${width}`);
        }
        transformations.push(`q_${quality}`);
        transformations.push(`f_${format}`);
        transformations.push('c_limit');
        transformations.push('dpr_auto');
    }

    const transformationString = transformations.join(',');
    const optimizedUrl = `${parts[0]}/upload/${transformationString}/${parts[1]}`;

    return optimizedUrl;
};

const ImageCarousel = ({ screenshots, projectName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState({});

    // Debug: Log screenshots on mount
    useEffect(() => {
        console.log('ImageCarousel screenshots:', screenshots);
    }, [screenshots]);

    const nextImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    const openFullscreen = () => setIsFullscreen(true);
    const closeFullscreen = () => setIsFullscreen(false);

    // Keyboard navigation
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

    const handleImageLoad = (index) => {
        console.log(`Image loaded at index ${index}`);
        setImageLoaded(prev => ({ ...prev, [index]: true }));
    };

    // Reset when screenshots change
    useEffect(() => {
        setCurrentIndex(0);
        setImageLoaded({});
    }, [screenshots]);

    // Preload current and adjacent images
    useEffect(() => {
        if (!screenshots || screenshots.length === 0) return;

        const preloadImage = (index) => {
            if (index < 0 || index >= screenshots.length) return;

            const url = optimizeCloudinaryUrl(screenshots[index], { width: 1200 });
            console.log(`Preloading image at index ${index}:`, url);
            
            const img = new Image();
            img.src = url;
            
            // Timeout fallback: Show image after 2 seconds even if onLoad doesn't fire
            const timeoutId = setTimeout(() => {
                console.log(`Timeout fallback: Marking image ${index} as loaded`);
                handleImageLoad(index);
            }, 2000);
            
            img.onload = () => {
                clearTimeout(timeoutId);
                console.log(`Successfully loaded image at index ${index}`);
                handleImageLoad(index);
            };
            
            img.onerror = (error) => {
                clearTimeout(timeoutId);
                console.error(`Failed to preload image at index ${index}:`, url, error);
                handleImageLoad(index); // Mark as loaded even on error to show alt text
            };
            
            // Immediately mark as loaded if image is already cached
            if (img.complete) {
                clearTimeout(timeoutId);
                console.log(`Image ${index} already cached`);
                handleImageLoad(index);
            }
        };

        // Preload current image
        preloadImage(currentIndex);

        // Preload next and previous images for smooth navigation
        if (screenshots.length > 1) {
            preloadImage((currentIndex + 1) % screenshots.length);
            preloadImage((currentIndex - 1 + screenshots.length) % screenshots.length);
        }
    }, [currentIndex, screenshots]);

    if (!screenshots || screenshots.length === 0) {
        return (
            <div className={styles.noImages}>
                <span className={styles.noImagesIcon}>🖼️</span>
                <p>No screenshots available</p>
            </div>
        );
    }

    // Optimize image URLs
    const optimizedMainImage = optimizeCloudinaryUrl(screenshots[currentIndex], { width: 1200 });
    const optimizedFullscreenImage = optimizeCloudinaryUrl(screenshots[currentIndex], { width: 1920 });

    return (
        <>
            <div className={styles.carousel}>
                <div className={styles.mainImageWrapper}>
                    {!imageLoaded[currentIndex] && (
                        <div className={styles.imageSkeleton}>
                            <div className={styles.skeletonPulse} />
                        </div>
                    )}

                    <img
                        src={optimizedMainImage}
                        alt={`${projectName} Screenshot ${currentIndex + 1}`}
                        className={styles.mainImage}
                        onClick={openFullscreen}
                        onLoad={() => handleImageLoad(currentIndex)}
                        onError={() => {
                            console.error(`Failed to load image: ${optimizedMainImage}`);
                            handleImageLoad(currentIndex); // Still mark as loaded to show alt text
                        }}
                        style={{
                            opacity: imageLoaded[currentIndex] ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                    />

                    <button
                        className={styles.fullscreenBtn}
                        onClick={openFullscreen}
                        title="View Fullscreen"
                        aria-label="View Fullscreen"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </button>

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

                    <div className={styles.imageCounter}>
                        {currentIndex + 1} / {screenshots.length}
                    </div>
                </div>

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
                                    src={optimizeCloudinaryUrl(screenshot, { thumbnail: true })}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={styles.thumbnailImage}
                                    loading="lazy"
                                />
                                {index === currentIndex && (
                                    <div className={styles.thumbnailOverlay} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isFullscreen && (
                <div className={styles.fullscreenModal} onClick={closeFullscreen}>
                    <button className={styles.closeBtn} onClick={closeFullscreen} aria-label="Close fullscreen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={optimizedFullscreenImage}
                            alt={`${projectName} Screenshot ${currentIndex + 1}`}
                            className={styles.fullscreenImage}
                        />

                        {screenshots.length > 1 && (
                            <>
                                <button
                                    className={`${styles.fullscreenArrow} ${styles.fullscreenArrowLeft}`}
                                    onClick={prevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button
                                    className={`${styles.fullscreenArrow} ${styles.fullscreenArrowRight}`}
                                    onClick={nextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        <div className={styles.fullscreenCounter}>
                            {currentIndex + 1} / {screenshots.length}
                        </div>

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
                                        aria-label={`View screenshot ${index + 1}`}
                                    >
                                        <img
                                            src={optimizeCloudinaryUrl(screenshot, { thumbnail: true })}
                                            alt={`Thumbnail ${index + 1}`}
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

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
