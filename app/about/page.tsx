export default function AboutPage() {
  return (
    <div className="static-page">
      <nav className="static-nav">
        <a href="/" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#ab)"
            />
            <defs>
              <linearGradient id="ab" x1="4" y1="4" x2="28" y2="28">
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
        <h1 className="static-title">About SnaehApp</h1>
        <p className="static-subtitle">Cambodia&apos;s dating app, built with love</p>

        <div className="static-section">
          <h2>Our Mission</h2>
          <p>
            SnaehApp (ស្នេហ៍ — &quot;love&quot; in Khmer) is Cambodia&apos;s first dating app
            built around Cambodian culture, language, and values. We connect hearts across
            all 25 provinces and the global Khmer diaspora.
          </p>
        </div>

        <div className="static-section">
          <h2>Why SnaehApp?</h2>
          <p>
            Unlike global dating apps, SnaehApp is designed specifically for Cambodians.
            We offer full Khmer Unicode support, Asian zodiac compatibility matching,
            province-based filtering, and local payment options including ABA PayWay,
            Wing Money, and ACLEDA.
          </p>
        </div>

        <div className="static-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Authenticity</strong> — Verified profiles to keep our community real and safe</li>
            <li><strong>Culture</strong> — Horoscope matching, bilingual experience, and respect for tradition</li>
            <li><strong>Privacy</strong> — Your data stays private. Incognito mode, photo blur, and block/report tools</li>
            <li><strong>Accessibility</strong> — Free to use with affordable premium options for all income levels</li>
          </ul>
        </div>

        <div className="static-section">
          <h2>Our Team</h2>
          <p>
            SnaehApp is built by a small team of Cambodian engineers and designers
            passionate about creating meaningful connections in our community.
            We are based in Phnom Penh and work remotely across Cambodia and abroad.
          </p>
        </div>

        <div className="static-section">
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? Reach out at{" "}
            <a href="mailto:contact@snaeh.com">contact@snaeh.com</a> or visit our{" "}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </div>

      <footer className="static-footer">
        <div className="footer-copy">&copy; 2026 SnaehApp. All rights reserved.</div>
      </footer>
    </div>
  );
}
