// pages/privacy.tsx
import React from "react";

export default function Privacy() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <main className="container" style={{ padding: "2rem" }}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective date: </strong>September 27, 2025
      </p>
      <p>
        <strong>Last updated: </strong>
        {formattedDate}
      </p>

      <p>
        Stack2Subs (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) respects
        your privacy and is committed to protecting your personal data.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We only collect the personal information that you provide voluntarily
        through our website form: your <strong>email address</strong>.
      </p>

      <h2>2. Purpose and Legal Basis</h2>
      <p>
        We process your email address only to inform you about our launch and
        updates. The legal basis is your <strong>consent</strong> under Art.
        6(1)(a) GDPR, which you give by submitting your email.
      </p>

      <h2>3. Data Storage and Security</h2>
      <p>
        Your data is stored securely in our database provider (Supabase). We
        apply technical and organizational measures to protect it from
        unauthorized access.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We may use trusted service providers (such as Supabase, Vercel, or email
        delivery platforms) to operate our services. These providers are bound
        by data protection laws and process data only on our behalf.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Under the GDPR, you have the right to access, correct, or delete your
        personal data, and the right to withdraw your consent at any time. To
        exercise your rights, please contact us at:{" "}
        <strong>stack2subs@gmail.com</strong>
      </p>

      <h2>6. Children’s Privacy</h2>
      <p>
        Our website is not directed to individuals under 16. We do not knowingly
        collect data from children.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The latest version
        will always be available on this page.
      </p>
    </main>
  );
}
