import React, { useState } from 'react';
import { skills } from '../../../data/profile';
import skillsData from '../../../data/skillsData';
import SkillTree from './SkillTree';
import styles from './TechStackSection.module.css';

const VIEWS = [
    { id: 'list', label: 'List' },
    { id: 'tree', label: 'Tree' },
];

const TechStackSection = () => {
    const [view, setView] = useState('list');
    const showTree = view === 'tree';

    return (
        <div className={styles.infoBox}>
            {/* The tree needs a wide screen, so the switch only shows there */}
            <div className={styles.viewSwitch} role="group" aria-label="Show skills as">
                {VIEWS.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        className={styles.viewButton}
                        aria-pressed={view === id}
                        onClick={() => setView(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* On narrow screens the list stays visible even in tree view */}
            <dl className={`${styles.groups} ${showTree ? styles.hiddenWhenWide : ''}`}>
                {skills.map((group) => (
                    <div key={group.group} className={styles.row}>
                        <dt className={styles.groupName}>{group.group}</dt>
                        <dd className={styles.groupSkills}>
                            <ul className={styles.skillList}>
                                {(group.items || []).map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                            {group.basic?.length > 0 && (
                                <p className={styles.basic}>
                                    <span className={styles.basicLabel}>Basic</span>
                                    {group.basic.join(', ')}
                                </p>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>

            {showTree && (
                <div className={styles.treeWrap}>
                    <SkillTree skillsData={skillsData} />
                </div>
            )}
        </div>
    );
};

export default TechStackSection;
