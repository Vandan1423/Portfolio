import React from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import TwoColumnSection from '../../components/shared/TwoColumnSection/TwoColumnSection';
import useScrollToSection from '../../hooks/useScrollToSection';
import useFormState from '../../hooks/useFormState';
import { useNavigation } from '../../context/NavigationContext';
import ContactFormSection from './sections/ContactFormSection';
import ContactInfoSection from './sections/ContactInfoSection';
import CommunicationViz from './sections/CommunicationViz';
import SocialLinksViz from './sections/SocialLinksViz';

const Contact = () => {
    const { scrollTarget, onScrollComplete } = useNavigation();
    const { registerRef } = useScrollToSection(scrollTarget, onScrollComplete);

    const { formData, formStatus, handleChange, handleReset, setStatus } = useFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const mailtoLink = `mailto:nagori.vandan04@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;

        setStatus({ submitted: true, error: false });
        handleReset();

        setTimeout(() => {
            setStatus({ submitted: false, error: false });
        }, 5000);
    };

    return (
        <PageTemplate
            title="Get In Touch"
            subtitle="Let's connect and create something amazing together"
        >
            <TwoColumnSection
                ref={registerRef('contact-form')}
                id="contact-form"
                sectionNumber="01"
                sectionTitle="SEND MESSAGE"
                leftContent={
                    <ContactFormSection
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        formStatus={formStatus}
                    />
                }
                rightContent={<CommunicationViz />}
            />

            <TwoColumnSection
                ref={registerRef('contact-info')}
                id="contact-info"
                sectionNumber="02"
                sectionTitle="CONTACT INFO"
                leftContent={<ContactInfoSection />}
                rightContent={<SocialLinksViz />}
            />
        </PageTemplate>
    );
};

export default Contact;
