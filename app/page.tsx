"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Navbar scroll effect
    const nav = document.getElementById("navbar");
    const handleScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav id="navbar">
        <a href="#" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#ng)"
            />
            <defs>
              <linearGradient id="ng" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#E8454A" />
                <stop offset="1" stopColor="#8B1A28" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">
            Snaeh<span>App</span>
          </span>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#how">How It Works</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#stories">Stories</a>
          </li>
          <li>
            <a href="#" className="nav-cta">
              Download Free
            </a>
          </li>
        </ul>
        <button className="nav-menu-btn" aria-label="Menu">
          &#9776;
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-bg-circle c1"></div>
          <div className="hero-bg-circle c2"></div>
        </div>
        <div className="hero-pattern"></div>

        <div className="hero-content">
          <div className="hero-label">Cambodia&apos;s #1 Dating App</div>
          <h1 className="hero-title">
            Find Your
            <br />
            <em>Perfect Match</em>
            <br />
            in Cambodia
          </h1>
          <span className="hero-title-khmer">រកស្នេហ៍ដ៏ល្អឥតខ្ចោះ</span>
          <p className="hero-desc">
            SnaehApp connects Cambodian hearts through authentic culture, shared
            values, and modern technology. Bilingual Khmer–English, built for
            you.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">
              <span>Download Free</span>
              <span>&rarr;</span>
            </a>
            <a href="#how" className="btn-secondary">
              See How It Works
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-num">50K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div>
              <span className="stat-num">8K+</span>
              <span className="stat-label">Matches Made</span>
            </div>
            <div>
              <span className="stat-num">4.8&#9733;</span>
              <span className="stat-label">App Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-wrap">
            <div className="phone-glow"></div>
            <div className="phone">
              <div className="phone-notch"></div>
              <div className="phone-card">
                <div className="profile-photo-sim">
                  <span className="profile-emoji">&#128105;</span>
                </div>
                <div className="phone-card-img">
                  <div className="profile-info">
                    <div className="profile-name">Sreymom, 24</div>
                    <div className="profile-detail">
                      &#128205; Phnom Penh &middot; &#10003; Verified
                    </div>
                    <div className="profile-tags">
                      <span className="profile-tag">Buddhist</span>
                      <span className="profile-tag">Teacher</span>
                      <span className="profile-tag">Foodie</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone-actions">
                <div className="phone-btn pass">&#10005;</div>
                <div className="phone-btn like">&#9829;</div>
                <div className="phone-btn star">&#9733;</div>
              </div>
            </div>

            <div className="badge badge-left">
              <span className="badge-icon">&#128172;</span>
              <div>
                <span className="badge-text">It&apos;s a Match!</span>
                <span className="badge-sub">Start chatting now</span>
              </div>
            </div>
            <div className="badge badge-right">
              <span className="badge-icon">&#128737;&#65039;</span>
              <div>
                <span className="badge-text">Verified Profile</span>
                <span className="badge-sub">Safe &amp; trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-header reveal">
          <span className="section-eyebrow">Simple &amp; Easy</span>
          <h2 className="section-title">
            How <em>SnaehApp</em> Works
          </h2>
          <p className="section-desc">
            Get started in minutes. Find meaningful connections with people who
            share your values and culture.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step reveal">
            <div className="step-num">01</div>
            <span className="step-icon">&#128241;</span>
            <div className="step-title">Create Profile</div>
            <p className="step-desc">
              Sign up with your phone number. Add photos, interests, and your
              story in Khmer or English.
            </p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="step-num">02</div>
            <span className="step-icon">&#128269;</span>
            <div className="step-title">Discover Matches</div>
            <p className="step-desc">
              Browse profiles nearby. Filter by province, interests, horoscope,
              and lifestyle preferences.
            </p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="step-num">03</div>
            <span className="step-icon">&#9829;</span>
            <div className="step-title">Like &amp; Connect</div>
            <p className="step-desc">
              Swipe, super-like, or send a message. When both like each other —
              it&apos;s a match!
            </p>
          </div>
          <div className="step reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="step-num">04</div>
            <span className="step-icon">&#128172;</span>
            <div className="step-title">Start Chatting</div>
            <p className="step-desc">
              Chat securely in Khmer or English. Share photos and plan your
              first date in Cambodia.
            </p>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-header reveal">
          <span className="section-eyebrow">Built for Cambodia</span>
          <h2 className="section-title">
            Features Made <em>for You</em>
          </h2>
          <p className="section-desc">
            Unlike global apps, SnaehApp is designed around Cambodian culture,
            language, and values.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card reveal">
            <span className="feature-icon">&#127472;&#127469;</span>
            <div className="feature-title">Bilingual Experience</div>
            <span className="feature-title-khmer">
              ភាសាខ្មែរ &amp; English
            </span>
            <p className="feature-desc">
              Full Khmer Unicode support throughout the entire app. Communicate
              naturally in your own language.
            </p>
          </div>
          <div
            className="feature-card reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="feature-icon">&#127800;</span>
            <div className="feature-title">Horoscope Matching</div>
            <span className="feature-title-khmer">ហោរាសាស្ត្រ</span>
            <p className="feature-desc">
              Khmer zodiac and horoscope compatibility filtering — a cherished
              part of Cambodian matchmaking tradition.
            </p>
          </div>
          <div
            className="feature-card reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="feature-icon">&#128737;&#65039;</span>
            <div className="feature-title">Verified Profiles</div>
            <span className="feature-title-khmer">ប្រវត្តិពិតប្រាកដ</span>
            <p className="feature-desc">
              Photo and ID verification badges. Know you&apos;re talking to a
              real person, not a scammer.
            </p>
          </div>
          <div className="feature-card reveal">
            <span className="feature-icon">&#128205;</span>
            <div className="feature-title">Province Filter</div>
            <span className="feature-title-khmer">ខេត្ត &amp; ក្រុង</span>
            <p className="feature-desc">
              Find matches in Phnom Penh, Siem Reap, Battambang, or any of
              Cambodia&apos;s 25 provinces.
            </p>
          </div>
          <div
            className="feature-card reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="feature-icon">&#127974;</span>
            <div className="feature-title">Local Payments</div>
            <span className="feature-title-khmer">
              ABA &middot; Wing &middot; ACLEDA
            </span>
            <p className="feature-desc">
              Pay for premium features using ABA PayWay, Wing Money, or ACLEDA.
              No international card needed.
            </p>
          </div>
          <div
            className="feature-card reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="feature-icon">&#128274;</span>
            <div className="feature-title">Private &amp; Safe</div>
            <span className="feature-title-khmer">សុវត្ថិភាព</span>
            <p className="feature-desc">
              Incognito mode, photo blur, and block/report features. Your
              privacy and safety are our top priority.
            </p>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-header reveal">
          <span className="section-eyebrow">Simple Pricing</span>
          <h2 className="section-title">
            Choose Your <em>Plan</em>
          </h2>
          <p className="section-desc">
            Affordable plans designed for Cambodian income levels. Pay in USD or
            KHR using local payment methods.
          </p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card reveal">
            <span className="pricing-tier">Free</span>
            <div className="pricing-price">
              <sup>$</sup>0
            </div>
            <span className="pricing-period">Forever free</span>
            <ul className="pricing-features">
              <li>10 likes per day</li>
              <li>Basic matching</li>
              <li>Chat with matches</li>
              <li>Khmer &amp; English UI</li>
              <li>Province filter</li>
            </ul>
            <a href="#" className="btn-outline">
              Get Started
            </a>
          </div>

          <div
            className="pricing-card featured reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <div className="pricing-badge">Most Popular</div>
            <span className="pricing-tier">Premium</span>
            <div className="pricing-price">
              <sup>$</sup>5
            </div>
            <span className="pricing-period">per month</span>
            <ul className="pricing-features">
              <li>Unlimited likes</li>
              <li>See who liked you</li>
              <li>Rewind last swipe</li>
              <li>Horoscope matching</li>
              <li>Verified badge</li>
              <li>Priority in search</li>
            </ul>
            <a href="#" className="btn-filled">
              Start Premium
            </a>
          </div>

          <div
            className="pricing-card reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="pricing-tier">Gold</span>
            <div className="pricing-price">
              <sup>$</sup>10
            </div>
            <span className="pricing-period">per month</span>
            <ul className="pricing-features">
              <li>Everything in Premium</li>
              <li>5 Super Likes/day</li>
              <li>1 Boost per week</li>
              <li>Incognito mode</li>
              <li>Read receipts</li>
              <li>VIP support</li>
            </ul>
            <a href="#" className="btn-outline">
              Go Gold
            </a>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* TESTIMONIALS */}
      <section id="stories">
        <div className="section-header reveal">
          <span className="section-eyebrow">Success Stories</span>
          <h2 className="section-title">
            Real <em>Love</em> Stories
          </h2>
          <p className="section-desc">
            Thousands of Cambodians have found meaningful connections through
            SnaehApp.
          </p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">
              I found my boyfriend on SnaehApp after just two weeks. The
              horoscope matching actually works — we are so compatible!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128105;</div>
              <div>
                <span className="author-name">Bopha, 26</span>
                <span className="author-loc">&#128205; Phnom Penh</span>
              </div>
            </div>
          </div>
          <div
            className="testimonial-card reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">
              Finally an app that works in Khmer! The verified profiles gave me
              confidence that I was talking to real people.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128104;</div>
              <div>
                <span className="author-name">Dara, 29</span>
                <span className="author-loc">&#128205; Siem Reap</span>
              </div>
            </div>
          </div>
          <div
            className="testimonial-card reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">
              We matched in October, met in November, and got engaged in March.
              SnaehApp changed our lives completely.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">&#128107;</div>
              <div>
                <span className="author-name">Channary &amp; Virak</span>
                <span className="author-loc">&#128205; Battambang</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ornament-divider">
        <span className="ornament-center">&#9670; &#9670; &#9670;</span>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="cta-ornament">ស្នេហ៍</div>
        <div className="cta-content reveal">
          <h2 className="cta-title">
            Your Story
            <br />
            Starts <em>Today</em>
          </h2>
          <p className="cta-sub">
            Download free. No credit card required. Start meeting people near
            you.
          </p>
          <div className="cta-buttons">
            <a href="#" className="store-btn">
              <span className="store-icon">&#127822;</span>
              <div className="store-text">
                <span className="store-label">Download on the</span>
                <span className="store-name">App Store</span>
              </div>
            </a>
            <a href="#" className="store-btn">
              <span className="store-icon">&#9654;</span>
              <div className="store-text">
                <span className="store-label">Get it on</span>
                <span className="store-name">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">
            Snaeh<span>App</span>
          </div>
          <span className="footer-khmer">
            ស្នេហ៍ &middot; Find Love in Cambodia
          </span>
        </div>
        <ul className="footer-links">
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Safety</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <div className="footer-copy">
          &copy; 2026 SnaehApp. All rights reserved.
        </div>
      </footer>
    </>
  );
}
