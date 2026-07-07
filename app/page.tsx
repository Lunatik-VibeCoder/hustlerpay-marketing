import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticContentProvider } from "@/content/StaticContentProvider";
import { SectionRenderer } from "@/content/SectionRenderer";
import { buildMetadata } from "@/lib/seo";

const provider = new StaticContentProvider();

export async function generateMetadata(): Promise<Metadata> {
  const page = await provider.getPage("home");
  if (!page) return {};
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/" });
}

export default async function HomePage() {
  const page = await provider.getPage("home");
  if (!page) notFound();

  return <SectionRenderer sections={page.sections} />;
}
