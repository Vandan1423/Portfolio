import React from 'react';
import styles from './CodeEditor.module.css';

const CodeEditor = () => {
    return (
        <div className={styles.techVisualization}>
            <div className={styles.editorHeader}>
                <div className={styles.editorDots}>
                    <span className={styles.dot} style={{ background: '#FF5F57' }} />
                    <span className={styles.dot} style={{ background: '#FFBD2E' }} />
                    <span className={styles.dot} style={{ background: '#28CA42' }} />
                </div>
                <span className={styles.fileName}>skills.js</span>
            </div>
            <div className={styles.codeEditor}>
                <pre className={styles.codeContent}>
                    <code>{`const skills = {
  languages: ["Python", "JavaScript", "C++"],
  web: ["React", "Node.js", "Express", "MongoDB"],
  tools: ["Git/GitHub", "SQL", "Tailwind CSS"]
};

console.log("Building amazing things! 🚀");`}</code>
                    <span className={styles.cursor}></span>
                </pre>
            </div>
        </div>
    );
};

export default CodeEditor;
