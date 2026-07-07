import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryOption {
  code: string; // ISO 3166-1 alpha-2
  label: string;
}

export interface CountrySelectorProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  /** No default country list baked in — unlike the TGA original, which
   * hardcoded a West-Africa list. Always supplied by the consumer. */
  options: CountryOption[];
  value: string;
  onChange: (code: string) => void;
}

export const CountrySelector = React.forwardRef<HTMLSelectElement, CountrySelectorProps>(
  ({ className, options, value, onChange, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-input bg-secondary pl-3 pr-9 text-sm text-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  ),
);
CountrySelector.displayName = "CountrySelector";
