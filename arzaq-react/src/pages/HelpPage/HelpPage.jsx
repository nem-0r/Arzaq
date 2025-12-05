// src/pages/HelpPage/HelpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoArrowBack,
  IoHelpCircleOutline,
  IoChevronDown,
  IoMailOutline,
  IoChatboxEllipsesOutline,
  IoCallOutline
} from 'react-icons/io5';
import Header from '../../components/layout/Header/Header';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import styles from './HelpPage.module.css';

const HelpPage = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is ARZAQ?',
          answer: 'ARZAQ is a food rescue platform that connects users with restaurants offering surplus food at discounted prices. Our mission is to reduce food waste and help the environment while making quality food more accessible.'
        },
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking the "Register" button on the login page. You can sign up using your email or Google account. For restaurant owners, please select "Restaurant" as your account type and provide your business details.'
        },
        {
          question: 'Is ARZAQ free to use?',
          answer: 'Yes, creating an account and browsing available food is completely free. You only pay for the discounted food items you purchase from restaurants.'
        }
      ]
    },
    {
      category: 'Ordering Food',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Browse the map or list of participating restaurants, select available surplus food items, add them to your cart, and proceed to checkout. You\'ll receive a confirmation and pickup details after payment.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit/debit cards through our secure Paybox payment gateway. All transactions are encrypted and secure.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'Orders can be cancelled within 15 minutes of placement. After this time, the restaurant begins preparing your food, and cancellations may not be possible. Please contact support for assistance.'
        },
        {
          question: 'How do I pick up my order?',
          answer: 'After payment confirmation, you\'ll receive a QR code. Show this code at the restaurant during the specified pickup time window to collect your order.'
        }
      ]
    },
    {
      category: 'For Restaurants',
      questions: [
        {
          question: 'How can my restaurant join ARZAQ?',
          answer: 'Register as a restaurant user, provide your business details including restaurant name and verified address, and submit your application. Our team will review and approve your account within 1-2 business days.'
        },
        {
          question: 'How do I list surplus food?',
          answer: 'Once approved, access your Restaurant Dashboard to add food items, set prices (typically 30-50% off regular price), specify quantity, and set pickup time windows.'
        },
        {
          question: 'What fees does ARZAQ charge?',
          answer: 'ARZAQ charges a small service fee per transaction to maintain the platform. Detailed pricing information is available in your restaurant dashboard settings.'
        },
        {
          question: 'How do I verify customer orders?',
          answer: 'Customers will show you a QR code at pickup. Scan this code in your dashboard to verify and complete the order.'
        }
      ]
    },
    {
      category: 'Community Features',
      questions: [
        {
          question: 'What is the Community page?',
          answer: 'The Community page allows users to share their food rescue experiences, post photos, and connect with others passionate about reducing food waste.'
        },
        {
          question: 'How do I create a post?',
          answer: 'Click the "Create Post" button on the Community page, select a restaurant, write about your experience, optionally add a photo, and publish. Your post will be visible to all users.'
        },
        {
          question: 'What is the Environmental Impact tracker?',
          answer: 'Your profile displays statistics about meals rescued and CO2 emissions saved through your orders. Every meal rescued saves approximately 0.18kg of CO2 emissions.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          question: 'I forgot my password',
          answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'The app is not loading',
          answer: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the problem persists, contact our support team.'
        },
        {
          question: 'I didn\'t receive my order confirmation',
          answer: 'Check your spam/junk folder for the confirmation email. You can also view your order status in your Profile > Orders section. Contact support if you still cannot find it.'
        },
        {
          question: 'My location is not accurate',
          answer: 'Ensure location services are enabled in your browser settings. You can also manually enter your address in the Map page search bar.'
        }
      ]
    }
  ];

  return (
    <div className="page-container">
      <Header />

      <main id="main-content" className="main-content">
        <div className={styles.pageHeader}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <IoArrowBack size={24} />
          </button>
          <h1 className={styles.pageTitle}>Help & Support</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.iconSection}>
            <IoHelpCircleOutline size={64} />
          </div>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className={styles.faqCategory}>
                <h3 className={styles.categoryTitle}>{category.category}</h3>
                {category.questions.map((faq, faqIndex) => {
                  const index = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openFAQ === index;

                  return (
                    <div key={faqIndex} className={styles.faqItem}>
                      <button
                        className={styles.faqQuestion}
                        onClick={() => toggleFAQ(index)}
                      >
                        <span>{faq.question}</span>
                        <IoChevronDown
                          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
                          size={20}
                        />
                      </button>
                      {isOpen && (
                        <div className={styles.faqAnswer}>
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Contact Support</h2>
            <p>Can't find the answer you're looking for? Our support team is here to help.</p>

            <div className={styles.contactMethods}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <IoMailOutline size={32} />
                </div>
                <h3>Email Support</h3>
                <p>Get help via email</p>
                <a href="mailto:support@arzaq.com" className={styles.contactBtn}>
                  support@arzaq.com
                </a>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <IoChatboxEllipsesOutline size={32} />
                </div>
                <h3>Live Chat</h3>
                <p>Available Mon-Fri, 9AM-6PM</p>
                <button className={styles.contactBtn} disabled>
                  Coming Soon
                </button>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <IoCallOutline size={32} />
                </div>
                <h3>Phone Support</h3>
                <p>Available Mon-Fri, 9AM-6PM</p>
                <a href="tel:+77777777777" className={styles.contactBtn}>
                  +7 (777) 777-77-77
                </a>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Report an Issue</h2>
            <p>
              Found a bug or technical issue? Please report it to our development team at{' '}
              <a href="mailto:tech@arzaq.com">tech@arzaq.com</a> with details about the problem
              and steps to reproduce it.
            </p>
          </section>

          <div className={styles.footer}>
            <p>We typically respond within 24 hours during business days</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HelpPage;
