import { person, links } from '../../../data/profile';
import styles from './SiteFooter.module.css';

const SiteFooter = () => {
    const items = [
        person.email && { label: person.email, href: `mailto:${person.email}` },
        links.github && { label: 'GitHub', href: links.github, external: true },
        links.linkedin && { label: 'LinkedIn', href: links.linkedin, external: true },
        links.resume && { label: 'Resume', href: links.resume, external: true },
    ].filter(Boolean);

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <span className={styles.name}>
                    © {new Date().getFullYear()} {person.name}
                </span>
                <ul className={styles.links} aria-label="Contact">
                    {items.map((item) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
};

export default SiteFooter;
