"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <Image
          className="spark-logo"
          src="/spark-logo-long.png"
          alt="Spark"
          width={706}
          height={412}
          priority
        />
        <h1>Welcome back.</h1>
        <p className="login-tagline">
          The Limit Is Not Within Our Office, It&rsquo;s Beyond The
          Sky.
        </p>
        <p className="login-copy">
          Masuk dengan email BPJS Ketenagakerjaan Anda untuk masuk ke SPARK.
        </p>
        <button
          className="google-button"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <span className="google-mark" aria-hidden="true">G</span>
          Continue with Google
          <span aria-hidden="true">↗</span>
        </button>
        <p className="login-note">
          Access is limited to authorized organization accounts.
        </p>
      </section>
    </main>
  );
}
