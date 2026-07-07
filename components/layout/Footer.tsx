import Link from "next/link";
import { Badge } from "@ui/Badge";
import { FOOTER_COLUMNS, type NavLink } from "./navigation";

function FooterLink({ link }: { link: NavLink }) {
  if (link.comingSoon) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground/70 select-none">
        {link.label}
        <Badge variant="warning" className="text-[10px] py-0">
          Bientôt
        </Badge>
      </span>
    );
  }
  return (
    <Link
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {link.label}
    </Link>
  );
}

// Deliberately lists categories/links the wider HustlerPay ecosystem will
// need (Partners, Developers portal, Status page, Webhooks, Changelog)
// even though most don't exist yet — every one of them is either a real
// destination or clearly marked "Bientôt", never a link that 404s.
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">{column.title}</h3>
            <ul className="space-y-2">
              {column.items.map((item) => (
                <li key={item.label}>
                  <FooterLink link={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} HustlerPay. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
