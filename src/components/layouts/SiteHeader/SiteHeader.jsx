import { useState, useEffect, useRef } from 'react';
import { useNavigation, pathForPage } from '../../../context/NavigationContext';
import { person, links } from '../../../data/profile';
import styles from './SiteHeader.module.css';

const NAV_ITEMS = [
    { id: 'about-me', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'journey', label: 'Journey' },
];

// Let the browser handle new-tab and new-window clicks itself
const isPlainClick = (e) =>
    e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const SiteHeader = () => {
    const { currentPage, onNavigate, isMobile } = useNavigation();
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    // Close the phone menu on Escape or a click outside the header
    useEffect(() => {
        if (!menuOpen) return;

        const handleKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        const handleClick = (e) => {
            if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
        };

        window.addEventListener('keydown', handleKey);
        document.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.removeEventListener('click', handleClick);
        };
    }, [menuOpen]);

    const go = (pageId) => (e) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        setMenuOpen(false);
        onNavigate(pageId);
    };

    const navLinks = NAV_ITEMS.map((item) => (
        <a
            key={item.id}
            href={pathForPage(item.id)}
            onClick={go(item.id)}
            className={styles.navLink}
            aria-current={currentPage === item.id ? 'page' : undefined}
        >
            {item.label}
        </a>
    ));

    const resumeLink = links.resume && (
        <a href={links.resume} target="_blank" rel="noopener noreferrer" className={styles.action}>
            Resume
        </a>
    );

    return (
        <header className={styles.header} ref={headerRef} data-site-header>
            <div className={styles.inner}>
                <a href={pathForPage('about-me')} onClick={go('about-me')} className={styles.name}>
                    {person.name}
                </a>

                <nav className={styles.nav} aria-label="Main">
                    {navLinks}
                </nav>

                <div className={styles.actions}>
                    {resumeLink}
                    {!isMobile && (
                        <a href="/" onClick={go('3d-portfolio')} className={styles.action}>
                            3D view
                        </a>
                    )}
                </div>

                <button
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={menuOpen}
                    aria-controls="site-menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {menuOpen && (
                <nav id="site-menu" className={styles.menu} aria-label="Main">
                    {navLinks}
                    {resumeLink}
                </nav>
            )}
        </header>
    );
};

export default SiteHeader;
