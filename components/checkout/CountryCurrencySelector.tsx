"use client";

import { CountryDropdown, type Country } from "@/components/ui/country-dropdown";
import { Label } from "@/components/ui/label";
import { countries } from "country-data-list";
import { CURRENCY_SYMBOLS, getCurrencyForCountry } from "@/utils/pppPricing";

interface CountryCurrencySelectorProps {
  countryCode: string | null;
  onChange: (countryCode: string) => void;
  disabled?: boolean;
}

// A visible, explicit country/currency control — country detection
// elsewhere (useCountryTier) is best-effort (URL param, saved choice,
// browser locale; never IP geolocation), and the spec this implements
// requires a customer always be able to see and directly change it rather
// than relying only on that inference. Locked (disabled) once checkout
// moves past the form stage, per "don't silently change price mid-checkout."
export function CountryCurrencySelector({ countryCode, onChange, disabled }: CountryCurrencySelectorProps) {
  const defaultValue = countryCode
    ? countries.all.find((c: Country) => c.alpha2 === countryCode)?.alpha3
    : undefined;
  const currency = countryCode ? getCurrencyForCountry(countryCode) : null;

  return (
    <div>
      <Label htmlFor="checkout-country">Billing country</Label>
      <div className="mt-1">
        <CountryDropdown
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(country) => onChange(country.alpha2)}
          placeholder="Select your country"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Sets your currency{currency ? ` (${CURRENCY_SYMBOLS[currency]} ${currency})` : ""} and regional pricing —
        locked once you continue to payment.
      </p>
    </div>
  );
}
