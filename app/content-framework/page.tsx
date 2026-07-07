import { StaticContentProvider } from "@/content/StaticContentProvider";
import { SectionRenderer } from "@/content/SectionRenderer";
import { notFound } from "next/navigation";
import { buildNoIndexMetadata } from "@/lib/seo";

// WEB-CALC-1 Sprint B — proves ContentProvider -> SectionRenderer end to
// end as a real Server Component (async data fetch, not just a client
// demo). Sprint C's real homepage will follow this exact same 3-line
// pattern (provider.getPage(slug) -> notFound() guard -> SectionRenderer),
// just pointed at "home" once real sections exist there.
const provider = new StaticContentProvider();

// Internal engineering demo, not a real marketing page — noindex so it
// never surfaces in search results alongside the real site.
export const metadata = buildNoIndexMetadata({
  title: "Content Framework (demo)",
  description: "Internal demo of the ContentProvider -> SectionRenderer pipeline.",
});

export default async function ContentFrameworkDemoPage() {
  const page = await provider.getPage("home");
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Content Framework</h1>
        <p className="text-muted-foreground mt-1">
          WEB-CALC-1 Sprint B — ContentProvider → SectionRenderer, câblé de bout en bout.
        </p>
      </div>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
