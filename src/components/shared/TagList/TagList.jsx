import React from 'react';
import Tag from '../../common/Tag/Tag';
import styles from './TagList.module.css';

const TagList = ({
    tags,
    variant = 'default',
    className = '',
    ...props
}) => {
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.tagList} ${className}`} {...props}>
            {tags.map((tag, index) => (
                <Tag key={index} variant={variant}>
                    {tag}
                </Tag>
            ))}
        </div>
    );
};

export default TagList;
