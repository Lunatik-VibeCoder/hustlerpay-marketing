"use client";

import { useState } from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";
import { cn } from "@/lib/utils";
import { HEADER_NAV, HEADER_ACTIONS, isMegaMenu, type NavLink } from "./navigation";
import { MobileMenu } from "./MobileMenu";

function NavLinkItem({ link }: { link: NavLink }) {
  if (link.comingSoon) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground cursor-default select-none">
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
      className="block px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
    >
      {link.label}
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              H
            </span>
            <span className="font-semibold text-foreground">HustlerPay</span>
          </Link>

          <NavigationMenu.Root className="hidden lg:flex relative">
            <NavigationMenu.List className="flex items-center gap-1">
              {HEADER_NAV.map((entry) =>
                isMegaMenu(entry) ? (
                  <NavigationMenu.Item key={entry.label}>
                    <NavigationMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors data-[state=open]:bg-secondary">
                      {entry.label}
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-border bg-card p-2 shadow-lg">
                      {entry.items.map((item) => (
                        <NavLinkItem key={item.label} link={item} />
                      ))}
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={entry.label}>
                    <NavLinkItem link={entry} />
                  </NavigationMenu.Item>
                ),
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href={HEADER_ACTIONS.signIn.href}>{HEADER_ACTIONS.signIn.label}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={HEADER_ACTIONS.getStarted.href}>{HEADER_ACTIONS.getStarted.label}</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={cn(
              "lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors",
            )}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
