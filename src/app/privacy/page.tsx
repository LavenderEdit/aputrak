import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="space-y-6 text-base leading-relaxed">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">1. Introduction</h2>
          <p>
            At <strong>TKOH Studios</strong> ("we", "our", "us"), your privacy is a top priority. This Privacy Policy explains how we collect, use, and protect your information when you use <strong>Aputrak</strong> and <strong>Ataraxia</strong> (the "Services").
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">2. Offline-First Architecture</h2>
          <p>
            Our applications are built with an <strong>Offline-First</strong> philosophy. By default, all your schedules, tags, timers, and personal settings are stored locally on your device using <em>IndexedDB</em>. We believe that your data belongs to you, and it remains on your device until you explicitly decide to synchronize it with our cloud servers.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">3. Data Collection and Cloud Sync</h2>
          <p>
            When you create an account and enable Cloud Synchronization to bridge your data between Aputrak and Ataraxia or across multiple devices, we securely transmit and store the following data on our servers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Username, email address, and authentication credentials.</li>
            <li><strong>Application Data:</strong> Tasks, schedules, time logs, and custom tags.</li>
            <li><strong>Application Settings:</strong> Your UI preferences (like Dark/Light mode) and timer configurations.</li>
          </ul>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">4. How We Use Your Data</h2>
          <p>
            We strictly use your data for the sole purpose of providing and maintaining the Services. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Synchronizing your tasks and schedules seamlessly across your devices.</li>
            <li>Restoring your data in case you switch devices or lose access to your local storage.</li>
            <li>Ensuring basic operational functionality and security.</li>
          </ul>
          <p>
            <strong>We do NOT sell your data.</strong> We do not run third-party advertisements or use tracking pixels to monitor your behavior for marketing purposes.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">5. Data Security</h2>
          <p>
            All communications between your local device and our backend APIs (<code className="bg-muted/20 px-1 py-0.5 rounded text-sm">ataraxia-api.studios-tkoh.online</code>) are encrypted over HTTPS. While we implement industry-standard measures to protect your synchronized data, no method of transmission is 100% secure. You are responsible for keeping your login credentials confidential.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">6. Data Deletion and Your Rights</h2>
          <p>
            Because of our offline-first nature, you can instantly erase your local data by clearing your browser's site data or uninstalling the application. If you have synchronized your data to our cloud and wish to permanently delete your account and all associated cloud data, you can request account deletion through the app's settings or by contacting our support team.
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">7. Updates to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time as our Services evolve. The most current version will always be available within the application and on our official website.
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
