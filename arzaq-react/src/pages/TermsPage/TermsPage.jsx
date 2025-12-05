// src/pages/TermsPage/TermsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoDocumentTextOutline } from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import styles from './TermsPage.module.css';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.pageHeader}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <IoArrowBack size={24} />
          </button>
          <h1 className={styles.pageTitle}>Terms & Conditions</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.iconSection}>
            <IoDocumentTextOutline size={64} />
          </div>

          <section className={styles.section}>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using ARZAQ, you accept and agree to be bound by these Terms and Conditions.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Use of Service</h2>
            <h3>Eligibility</h3>
            <p>
              You must be at least 13 years old to use ARZAQ. By using our service, you represent that you
              meet this age requirement.
            </p>

            <h3>Account Registration</h3>
            <ul>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized access to your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>

            <h3>Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any illegal purposes</li>
              <li>Impersonate another person or entity</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Use automated systems to access the platform without permission</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Food Orders and Transactions</h2>
            <h3>Order Placement</h3>
            <ul>
              <li>All orders are subject to availability and acceptance by restaurants</li>
              <li>Prices displayed are final and include all applicable fees</li>
              <li>Payment must be completed before order confirmation</li>
              <li>You will receive a QR code for order pickup after successful payment</li>
            </ul>

            <h3>Pickup Requirements</h3>
            <ul>
              <li>Orders must be picked up during the specified time window</li>
              <li>You must present your QR code to collect your order</li>
              <li>Unclaimed orders after the pickup window cannot be refunded</li>
              <li>Special dietary requirements or allergies should be communicated directly to the restaurant</li>
            </ul>

            <h3>Cancellations and Refunds</h3>
            <ul>
              <li>Cancellations are only permitted within 15 minutes of order placement</li>
              <li>Refunds will be processed within 5-7 business days</li>
              <li>ARZAQ reserves the right to cancel orders in case of suspected fraud</li>
              <li>No refunds will be issued for unclaimed orders or orders not picked up during the specified time</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Restaurant Partners</h2>
            <h3>Restaurant Registration</h3>
            <ul>
              <li>Restaurants must provide accurate business information and documentation</li>
              <li>All listed food must comply with local health and safety regulations</li>
              <li>Restaurants are responsible for food quality and safety</li>
              <li>ARZAQ reserves the right to approve or reject restaurant applications</li>
            </ul>

            <h3>Restaurant Responsibilities</h3>
            <ul>
              <li>Maintain accurate inventory and pricing information</li>
              <li>Honor all confirmed orders</li>
              <li>Comply with pickup time windows</li>
              <li>Maintain proper food handling and storage practices</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Community Guidelines</h2>
            <p>When using community features, you agree to:</p>
            <ul>
              <li>Post content that is respectful and appropriate</li>
              <li>Not post content that is offensive, hateful, or discriminatory</li>
              <li>Respect intellectual property rights</li>
              <li>Not spam or post repetitive content</li>
              <li>Only post content related to food rescue and sustainability</li>
            </ul>
            <p>
              ARZAQ reserves the right to remove any content that violates these guidelines and may suspend
              or terminate accounts of repeat violators.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual Property</h2>
            <p>
              All content on ARZAQ, including text, graphics, logos, images, and software, is the property
              of ARZAQ or its content suppliers and is protected by international copyright laws.
            </p>
            <p>
              By posting content on ARZAQ, you grant us a non-exclusive, worldwide, royalty-free license
              to use, display, and distribute your content on our platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              ARZAQ is provided "as is" without warranties of any kind, either express or implied.
              We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
            <p>
              While we facilitate connections between users and restaurants, ARZAQ is not responsible for:
            </p>
            <ul>
              <li>Food quality, safety, or preparation</li>
              <li>Accuracy of restaurant information</li>
              <li>Allergic reactions or food-related illnesses</li>
              <li>Disputes between users and restaurants</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ARZAQ and its affiliates shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages resulting from your
              use or inability to use the service.
            </p>
            <p>
              Our total liability shall not exceed the amount paid by you in the past 12 months for
              using ARZAQ.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ARZAQ, its affiliates, and their respective
              officers, directors, and employees from any claims, damages, losses, or expenses
              arising from:
            </p>
            <ul>
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you post on the platform</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>10. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of
              significant changes via email or through the platform. Continued use of ARZAQ
              after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Harmful behavior towards other users or restaurants</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p>
              Upon termination, your right to use ARZAQ will immediately cease.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Kazakhstan,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> legal@arzaq.com</p>
              <p><strong>Address:</strong> Almaty, Kazakhstan</p>
            </div>
          </section>

          <div className={styles.footer}>
            <p>Last updated: December 2024</p>
            <p>Version 1.0</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TermsPage;
