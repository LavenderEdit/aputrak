"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { getLegalCopy } from "@/shared/constants/legal.constants";

export default function TermsPage() {
  const { lang } = useLanguage();
  const copy = getLegalCopy(lang).terms;

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
            {copy.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="space-y-6 text-base leading-relaxed">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.agreementTitle}</h2>
          <p>{copy.agreementContent}</p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.useTitle}</h2>
          <p>{copy.useContent}</p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.offlineTitle}</h2>
          <p>{copy.offlineContent}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{copy.offlineItem1}</li>
            <li>{copy.offlineItem2}</li>
            <li>{copy.offlineItem3}</li>
          </ul>
          <p>
            <strong>{copy.offlineWarning}</strong>
          </p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.accountsTitle}</h2>
          <p>{copy.accountsContent}</p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.ipTitle}</h2>
          <p>{copy.ipContent}</p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.liabilityTitle}</h2>
          <p>{copy.liabilityContent}</p>

          <h2 className="font-display text-2xl font-black uppercase tracking-tight mt-10 mb-4">{copy.changesTitle}</h2>
          <p>{copy.changesContent}</p>

          <p className="mt-16 text-sm font-bold text-muted uppercase tracking-widest">
            {copy.lastUpdated}<br/>
            {copy.company}
          </p>
        </article>
      </main>
    </div>
  );
}
