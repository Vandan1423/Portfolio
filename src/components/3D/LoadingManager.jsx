import { useState, useEffect } from "react";
import { Html, useProgress } from "@react-three/drei";

/**
 * LoadingScreen Component
 *
 * Displays loading progress for 3D assets
 * Shows percentage and loaded items count
 */
export const LoadingScreen = () => {
    const { active, progress, errors, item, loaded, total } = useProgress();

    return (
        <Html center>
            <div style={{
                color: '#00ff88',
                fontSize: '24px',
                fontFamily: 'monospace',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '10px',
                border: '2px solid #00ff88',
                minWidth: '300px'
            }}>
                <div style={{ marginBottom: '10px' }}>
                    Loading 3D Assets...
                </div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#06b6d4' }}>
                    {progress.toFixed(0)}%
                </div>
                <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                    {loaded} / {total} items
                </div>
                {errors.length > 0 && (
                    <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '12px' }}>
                        Errors: {errors.length}
                    </div>
                )}
            </div>
        </Html>
    );
};

/**
 * ModelLoadingFallback Component
 *
 * Simple loading indicator for individual model suspense boundaries
 */
export const ModelLoadingFallback = () => {
    return (
        <Html center>
            <div style={{
                color: '#00ff88',
                fontSize: '16px',
                fontFamily: 'monospace',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '5px'
            }}>
                Loading...
            </div>
        </Html>
    );
};

export default LoadingScreen;
