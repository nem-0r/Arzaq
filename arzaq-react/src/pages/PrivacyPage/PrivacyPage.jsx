// src/pages/PrivacyPage/PrivacyPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoShieldCheckmarkOutline } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import styles from './PrivacyPage.module.css';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.pageHeader}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <IoArrowBack size={24} />
          </button>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.iconSection}>
            <IoShieldCheckmarkOutline size={64} />
          </div>

          <section className={styles.section}>
            <h2>Introduction</h2>
            <p>
              At ARZAQ, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our food rescue platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <ul>
              <li>Name and contact details (email, phone number)</li>
              <li>Location data for restaurant and food discovery</li>
              <li>Payment information for order processing</li>
              <li>Profile picture and preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <ul>
              <li>Order history and saved items</li>
              <li>App usage patterns and preferences</li>
              <li>Device information and IP address</li>
              <li>Community posts and interactions</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfill your food rescue orders</li>
              <li>Connect you with nearby restaurants offering surplus food</li>
              <li>Calculate and display your environmental impact statistics</li>
              <li>Send important notifications about orders and updates</li>
              <li>Improve our services and user experience</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Data Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share your data with:
            </p>
            <ul>
              <li><strong>Restaurant Partners:</strong> To fulfill your orders</li>
              <li><strong>Payment Processors:</strong> To process transactions securely</li>
              <li><strong>Service Providers:</strong> Who help us operate our platform</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns,
              and remember your preferences. You can manage cookie settings in your browser.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant
              changes by email or through the app. Your continued use of ARZAQ after changes indicates
              acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or your personal data, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> privacy@arzaq.com</p>
              <p><strong>Address:</strong> Almaty, Kazakhstan</p>
            </div>
          </section>

          <div className={styles.footer}>
            <p>Last updated: December 2024</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PrivacyPage;
