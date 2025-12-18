import React from 'react';
import styles from '../Technologies.module.css';

/**
 * CategoryFilters Component
 * Displays category filter buttons with proficiency bars
 * Props:
 * - categories: Array of category objects from technologiesData
 * - activeCategory: Currently active category ID
 * - onCategoryFilter: Function to handle category filter clicks
 */
const CategoryFilters = ({ categories, activeCategory, onCategoryFilter }) => {
    return (
        <section className={styles.filterSection}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionNumber}>02</span>
                <h2 className={styles.glitchTitle} data-text="CATEGORIES">
                    CATEGORIES
                </h2>
            </div>

            <div className={styles.categoryFilters}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryBtn} ${
                            activeCategory === category.id ? styles.active : ''
                        }`}
                        onClick={() => onCategoryFilter(category.id)}
                        style={{ '--category-color': category.color }}
                    >
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryIcon}>{category.icon}</span>
                            <span className={styles.categoryName}>{category.name}</span>
                        </div>
                        <p className={styles.categoryDesc}>{category.description}</p>
                        <div className={styles.proficiencyBar}>
                            <div
                                className={styles.proficiencyFill}
                                style={{
                                    width: `${category.proficiency}%`,
                                    background: category.color
                                }}
                            />
                        </div>
                        <span className={styles.proficiencyLabel}>
                            {category.proficiency}%
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategoryFilters;
