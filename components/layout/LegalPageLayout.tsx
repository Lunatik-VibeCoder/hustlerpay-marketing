import { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  /** Shown for documents that need a real legal review before publishing
   * as-is (Privacy, Terms) — never silently presented as final/binding
   * legal text authored by an actual lawyer. */
  draftNotice?: boolean;
  children: ReactNode;
}

// Shared wrapper for the 4 long-form static pages (About/Privacy/Terms/
// Cookies) — these are single documents, not composable marketing
// sections, so they deliberately sit outside the ContentProvider/
// SectionRenderer pattern (that pattern is for repeatable page-building
// blocks like Hero/FAQ, not long-form prose). Still styled entirely from
// Design System tokens, no hardcoded colors.
export function LegalPageLayout({ title, lastUpdated, draftNotice, children }: LegalPageLayoutProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {lastUpdated && <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : {lastUpdated}</p>}
      {draftNotice && (
        <div className="mt-4 rounded-md border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
          Document provisoire — en attente de revue juridique avant publication définitive.
        </div>
      )}
      <div className="mt-8 space-y-6 text-sm text-foreground leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </main>
  );
}
