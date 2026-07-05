import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-black selection:text-white pb-24">
      <header className="sticky top-0 z-50 border-b-[3px] border-black dark:border-white/10 bg-surface/90 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link href="/">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black dark:border-white/10 bg-white dark:bg-white/5 transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
              <ArrowLeft size={18} strokeWidth={3} />
            </button>
          </Link>
          <h1 className="font-display text-xl font-black uppercase tracking-tight">
            Terms & Conditions
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="space-y-6 text-base leading-relaxed">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong>Aputrak</strong> and <strong>Ataraxia</strong> (the "Services") provided by <strong>TKOH Studios</strong>, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the Services.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">2. Use of the Services</h2>
          <p>
            Aputrak and Ataraxia are productivity tools designed to help you manage your schedules and focus time. You agree to use the Services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Services.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">3. Offline-First Nature & Data Responsibility</h2>
          <p>
            The Services are designed to operate primarily offline. Your data is stored locally in your browser or device using <em>IndexedDB</em>. We provide Cloud Synchronization as an optional convenience to bridge data across devices. 
            <strong>TKOH Studios is not responsible for data loss</strong> resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Clearing your browser's site data or cache before syncing.</li>
            <li>Using the Services in private/incognito browsing modes where data is not persisted.</li>
            <li>Hardware failure or software corruption on your local device.</li>
          </ul>
          <p>
            We highly recommend regularly exporting your data or ensuring Cloud Synchronization is active if your data is critical.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">4. User Accounts</h2>
          <p>
            If you choose to use the Cloud Synchronization features, you must create an account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">5. Intellectual Property</h2>
          <p>
            The Services and their original content, features, and functionality are and will remain the exclusive property of TKOH Studios and its licensors. The Services are protected by copyright, trademark, and other laws of both the local and international jurisdictions.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall TKOH Studios, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <p className="mt-16 text-sm font-bold text-muted uppercase tracking-widest">
            Last Updated: June 2026<br/>
            TKOH Studios
          </p>
        </article>
      </main>
    </div>
  );
}
