"use client";

import { useState, useRef, FormEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });

    setCaptchaToken("");
    turnstileRef.current?.reset();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/app/profile");
      router.refresh();
    }
  };

  return (
    <>
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-subtitle">Sign in to your account</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setCaptchaToken}
          onExpire={() => setCaptchaToken("")}
          options={{ theme: "light", size: "flexible" }}
        />
        <button type="submit" className="btn-primary auth-submit" disabled={loading || !captchaToken}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="auth-forgot">
        <a href="/auth/forgot-password">Forgot password?</a>
      </p>
      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <a href="/auth/signup">Sign Up</a>
      </p>
    </>
  );
}
