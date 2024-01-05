import styles from './LandingPage.module.css'
import welcomeImg from '../assets/landing-page/Lesson-rafiki.png'
import signupImg from '../assets/landing-page/Sign up-bro.png'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className={`${styles['body-wrap']}`}>
      <main>
        <section className={`${styles['section']}`}>
          <div className={`${styles['section-content']}`}>
            <h1 className={`${styles['title']}`}>Welcome to Matcha</h1>
            <p className={`${styles['text']}`}>
              Revolutionize your learning experience with our innovative
              platform. Connect, collaborate, and learn seamlessly.
            </p>
            <Link to={'/signup'} className={`${styles['cta-button']}`}>
              Get Started
            </Link>
          </div>
          <img src={welcomeImg} alt="teaching" />
        </section>

        <section className={`${styles['role-section']}`}>
          <div className={`${styles['section-content']}`}>
            <h1 className={`${styles['title']}`}>For Teachers</h1>
            <p className={`${styles['text']}`}>
              <strong>Effortless Class Management</strong> Create classes, and
              invite others with ease.
            </p>
            <p className={`${styles['text']}`}>
              <strong>Intuitive Grade Structure</strong> Manage grades
              seamlessly.
            </p>
            <p className={`${styles['text']}`}>
              <strong>Streamlined Grade Management</strong> Download/upload,
              input grades, and export effortlessly.
            </p>
          </div>
        </section>

        <section className={`${styles['role-section']}`}>
          <div className={`${styles['section-content']}`}>
            <h1 className={`${styles['title']}`}>For Students</h1>
            <p className={`${styles['text']}`}>
              <strong>Join Classes with Ease</strong> Use codes or invitation
              links.
            </p>
            <p className={`${styles['text']}`}>
              <strong>Effortless Grade Tracking</strong> View, request reviews,
              and engage in discussions.
            </p>
          </div>
        </section>

        <section className={`${styles['section']}`} id="signup">
          <div className={`${styles['section-content']}`}>
            <h1 className={`${styles['title']}`}>Sign Up Now</h1>
            <p className={`${styles['text']}`}>
              Join thousands of students and educators who are already using
              Matcha to enhance your learning journey.
            </p>
            <Link to={'/signup'} className={`${styles['cta-button']}`}>
              Sign Up
            </Link>
          </div>
          <img src={signupImg} alt="teaching" />
        </section>
      </main>

      <footer className={`${styles['footer']}`}>
        <p className="m-0">
          &copy;Matcha. All rights reserved. | <a href="#">Privacy Policy</a> |{' '}
          <a href="#">Terms of Service</a>
        </p>
      </footer>
    </div>
  )
}
