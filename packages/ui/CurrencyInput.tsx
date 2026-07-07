import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  /** ISO currency code or symbol shown as a fixed prefix (e.g. "GHS", "$") —
   * never hardcoded to one currency, always a prop. */
  currency: string;
  value: string;
  onChange: (value: string) => void;
}

// UI/UX shell only — no fee/exchange-rate calculation lives here. This is
// exactly the kind of primitive kept from the TGA audit (WEB-CALC-2 plan):
// the input affordance, not the Quote Engine behind it.
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, currency, value, onChange, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center rounded-md border border-input bg-secondary transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className,
      )}
    >
      <span className="pl-3 pr-2 text-sm font-medium text-muted-foreground select-none">{currency}</span>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        className="h-10 w-full rounded-r-md bg-transparent pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
        {...props}
      />
    </div>
  ),
);
CurrencyInput.displayName = "CurrencyInput";
