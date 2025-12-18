import { useState, useCallback } from 'react';

/**
 * Custom hook to manage form state and submissions
 * Used in Contact page
 *
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
const useFormState = (initialValues = {}) => {
    const [formData, setFormData] = useState(initialValues);
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false,
        message: ''
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFormData(initialValues);
        setFormStatus({
            submitted: false,
            error: false,
            message: ''
        });
    }, [initialValues]);

    const setStatus = useCallback((status) => {
        setFormStatus(status);
    }, []);

    const setFieldValue = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    return {
        formData,
        formStatus,
        handleChange,
        handleReset,
        setStatus,
        setFieldValue,
        setFormData,
    };
};

export default useFormState;
