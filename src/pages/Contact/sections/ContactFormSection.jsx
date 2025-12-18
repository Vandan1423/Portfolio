import React from 'react';
import FormGroup from '../../../components/shared/FormGroup/FormGroup';
import Button from '../../../components/common/Button/Button';
import styles from './ContactFormSection.module.css';

const ContactFormSection = ({ formData, handleChange, handleSubmit, formStatus }) => {
    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
                <FormGroup
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                />

                <FormGroup
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                />

                <FormGroup
                    label="Subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                />

                <FormGroup
                    label="Message"
                    name="message"
                    type="textarea"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={6}
                    required
                />

                <Button type="submit" variant="primary" className={styles.submitBtn}>
                    <span className={styles.btnText}>Send Message</span>
                    <span className={styles.btnIcon}>🚀</span>
                </Button>

                {formStatus.submitted && (
                    <div className={styles.successMessage}>
                        Message sent successfully!
                    </div>
                )}
            </form>
        </div>
    );
};

export default ContactFormSection;
