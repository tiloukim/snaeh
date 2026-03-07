"use client";

import { useState, FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://snaeh.com/auth/reset-password",
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <>
        <h1 className="auth-title">Check Your Email</h1>
        <p className="auth-subtitle">
          We sent a password reset link to <strong>{email}</strong>.
          Click the link in the email to reset your password.
        </p>
        <p className="auth-switch">
          <a href="/auth/login">Back to Sign In</a>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="auth-title">Forgot Password</h1>
      <p className="auth-subtitle">Enter your email to receive a reset link</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-primary auth-submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="auth-switch">
        Remember your password?{" "}
        <a href="/auth/login">Sign In</a>
      </p>
    </>
  );
}
