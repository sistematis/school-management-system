// src/components/students/form-sections/address-section.tsx

"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CountryOption } from "@/lib/api/idempiere/models";

// =============================================================================
// Types
// =============================================================================

export interface AddressSectionProps {
  /** Available countries for dropdown */
  countries?: CountryOption[];
  /** Whether fields should be disabled */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Address & Location Form Section
 * Step 2 fields: Location Name, Address Lines 1-4, City, Postal Code, Country
 *
 * Uses useFormContext to access the parent form state.
 * Expects form to have these fields: step2.locationName, step2.address1-4, step2.city, step2.postal, step2.countryId
 */
export function AddressSection({ countries = [], disabled = false }: AddressSectionProps) {
  const form = useFormContext();

  // Watch countryId for display purposes
  const selectedCountry = countries.find((c) => c.id === form.watch("step2.countryId"));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Location Name */}
      <FormField
        control={form.control}
        name="step2.locationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Home, Office" {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>A name to identify this address</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={form.control}
        name="step2.countryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country">
                    {selectedCountry?.label || "Select a country"}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 1 - spans full width */}
      <FormField
        control={form.control}
        name="step2.address1"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address Line 1 *</FormLabel>
            <FormControl>
              <Input placeholder="Street address, P.O. box, etc." {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 2 */}
      <FormField
        control={form.control}
        name="step2.address2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2</FormLabel>
            <FormControl>
              <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 3 */}
      <FormField
        control={form.control}
        name="step2.address3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 3</FormLabel>
            <FormControl>
              <Input placeholder="Additional address information" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 4 */}
      <FormField
        control={form.control}
        name="step2.address4"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 4</FormLabel>
            <FormControl>
              <Input placeholder="Additional address information" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="step2.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., New York" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={form.control}
        name="step2.postal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 10001" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
