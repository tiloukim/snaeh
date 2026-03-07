export default function PrivacyPage() {
  return (
    <div className="static-page">
      <nav className="static-nav">
        <a href="/" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#pv)"
            />
            <defs>
              <linearGradient id="pv" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#E8454A" />
                <stop offset="1" stopColor="#8B1A28" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">
            Snaeh<span>App</span>
          </span>
        </a>
      </nav>

      <div className="static-content">
        <h1 className="static-title">Privacy Policy</h1>
        <p className="static-subtitle">Last updated: March 2026</p>

        <div className="static-section">
          <h2>1. Information We Collect</h2>
          <p>When you use SnaehApp, we collect the following information:</p>
          <ul>
            <li><strong>Account information:</strong> Email address, password, and profile details (name, date of birth, gender, photos, bio, province/city, country)</li>
            <li><strong>Usage data:</strong> Swipe activity, matches, messages, and app interactions</li>
            <li><strong>Device information:</strong> Device type, operating system, and browser type</li>
          </ul>
        </div>

        <div className="static-section">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To show you potential matches based on your preferences</li>
            <li>To enable messaging between matched users</li>
            <li>To improve our app and user experience</li>
            <li>To send important service updates</li>
          </ul>
        </div>

        <div className="static-section">
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information to third parties. Your profile information
            is visible to other SnaehApp users as part of the matching experience. We may share
            anonymized, aggregated data for analytics purposes.
          </p>
        </div>

        <div className="static-section">
          <h2>4. Data Security</h2>
          <p>
            We use industry-standard security measures including encryption in transit (TLS)
            and at rest to protect your data. Your password is hashed and never stored in plain text.
            We use Supabase&apos;s Row Level Security to ensure users can only access their own data.
          </p>
        </div>

        <div className="static-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Request a copy of your data</li>
          </ul>
        </div>

        <div className="static-section">
          <h2>6. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management.
            We do not use tracking cookies or third-party advertising cookies.
          </p>
        </div>

        <div className="static-section">
          <h2>7. Children&apos;s Privacy</h2>
          <p>
            SnaehApp is intended for users aged 18 and older. We do not knowingly
            collect information from anyone under the age of 18.
          </p>
        </div>

        <div className="static-section">
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you
            of significant changes via email or in-app notification.
          </p>
        </div>

        <div className="static-section">
          <h2>9. Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:contact@snaeh.com">contact@snaeh.com</a>.
          </p>
        </div>
      </div>

      <footer className="static-footer">
        <div className="footer-copy">&copy; 2026 SnaehApp. All rights reserved.</div>
        <div className="footer-powered">Powered by <a href="https://angkorai.ai" target="_blank" rel="noopener noreferrer">AngkorAI</a></div>
      </footer>
    </div>
  );
}
