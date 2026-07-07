import { PageContent } from "./types";

// The abstraction that lets the rest of the site never know where content
// comes from. WEB-CALC-1 ships exactly one implementation
// (StaticContentProvider). Swapping to a real CMS/database/API later means
// writing a new class that satisfies this same interface — nothing else
// in the site changes.
export interface ContentProvider {
  getPage(slug: string): Promise<PageContent | null>;
}
