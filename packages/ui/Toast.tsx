"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

// Thin wrapper, not a reimplementation — sonner already covers the real
// need (stacking, swipe-to-dismiss, promise-based toasts). Re-exported
// under the Design System's own name so consumers import from @ui, never
// sonner directly, keeping the door open to swap the underlying library
// later without touching call sites.
export { toast };

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "bg-card! border-border! text-foreground!",
          description: "text-muted-foreground!",
          actionButton: "bg-primary! text-primary-foreground!",
          cancelButton: "bg-secondary! text-secondary-foreground!",
        },
      }}
    />
  );
}
