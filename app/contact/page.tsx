"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="static-page">
      <nav className="static-nav">
        <a href="/" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="url(#ct)"
            />
            <defs>
              <linearGradient id="ct" x1="4" y1="4" x2="28" y2="28">
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
        <h1 className="static-title">Contact Us</h1>
        <p className="static-subtitle">We&apos;d love to hear from you</p>

        <div className="static-section">
          <p>
            Have questions, feedback, or need help? Send us a message and we&apos;ll
            get back to you as soon as possible.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="profile-form-group">
            <label>Name</label>
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="profile-form-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="profile-form-group">
            <label>Message</label>
            <textarea
              className="auth-input contact-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={5}
              required
            />
          </div>

          {status === "sent" && (
            <p className="profile-msg success">Message sent! We&apos;ll get back to you soon.</p>
          )}
          {status === "error" && (
            <p className="profile-msg error">Something went wrong. Please try again or email us directly.</p>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="static-section" style={{ marginTop: 40 }}>
          <h2>Other Ways to Reach Us</h2>
          <ul>
            <li>Email: <a href="mailto:contact@snaeh.com">contact@snaeh.com</a></li>
          </ul>
        </div>
      </div>

      <footer className="static-footer">
        <div className="footer-copy">&copy; 2026 SnaehApp. All rights reserved.</div>
      </footer>
    </div>
  );
}
