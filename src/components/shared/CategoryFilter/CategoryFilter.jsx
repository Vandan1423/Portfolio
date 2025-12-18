import React from 'react';
import Button from '../../common/Button/Button';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({
    categories,
    activeCategory,
    onCategoryChange,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.categoryFilter} ${className}`} {...props}>
            {categories.map((category) => (
                <Button
                    key={category.value}
                    variant={activeCategory === category.value ? 'primary' : 'ghost'}
                    onClick={() => onCategoryChange(category.value)}
                    className={styles.categoryButton}
                >
                    {category.label}
                </Button>
            ))}
        </div>
    );
};

export default CategoryFilter;
