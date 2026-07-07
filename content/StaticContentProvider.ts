import { ContentProvider } from "./ContentProvider";
import { PageContent } from "./types";
import { home } from "./pages/home";

// Sole implementation for WEB-CALC-1. Each page is a plain TS file under
// content/pages/, imported eagerly here — no filesystem/DB read. Adding a
// page = add a file + one entry in PAGES below.
const PAGES: Record<string, PageContent> = {
  home,
};

export class StaticContentProvider implements ContentProvider {
  async getPage(slug: string): Promise<PageContent | null> {
    return PAGES[slug] ?? null;
  }
}
