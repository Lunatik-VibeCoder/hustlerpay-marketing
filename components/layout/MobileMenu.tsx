"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";
import { HEADER_NAV, HEADER_ACTIONS, isMegaMenu, type NavLink } from "./navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MobileNavLink({ link, onClose }: { link: NavLink; onClose: () => void }) {
  if (link.comingSoon) {
    return (
      <span className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground select-none">
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
      onClick={onClose}
      className="block px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
    >
      {link.label}
    </Link>
  );
}

// Reusable, built to last — not a throwaway drawer. Radix Dialog gives
// focus-trap/Escape/scroll-lock for free, same accessibility guarantees
// as packages/ui/Dialog, just laid out as a full-height side sheet
// instead of a centered modal.
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-card border-l border-border p-4 overflow-y-auto lg:hidden focus-visible:outline-none"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">Menu de navigation</DialogPrimitive.Title>
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-foreground">HustlerPay</span>
            <DialogPrimitive.Close className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer</span>
            </DialogPrimitive.Close>
          </div>

          <nav className="space-y-4">
            {HEADER_NAV.map((entry) =>
              isMegaMenu(entry) ? (
                <div key={entry.label}>
                  <p className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    {entry.label}
                  </p>
                  <div className="space-y-0.5">
                    {entry.items.map((item) => (
                      <MobileNavLink key={item.label} link={item} onClose={onClose} />
                    ))}
                  </div>
                </div>
              ) : (
                <MobileNavLink key={entry.label} link={entry} onClose={onClose} />
              ),
            )}
          </nav>

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            <Button variant="secondary" className="w-full" asChild onClick={onClose}>
              <Link href={HEADER_ACTIONS.signIn.href}>{HEADER_ACTIONS.signIn.label}</Link>
            </Button>
            <Button className="w-full" asChild onClick={onClose}>
              <Link href={HEADER_ACTIONS.getStarted.href}>{HEADER_ACTIONS.getStarted.label}</Link>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
