// src/components/students/form-sections/account-section.tsx

"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GreetingOption } from "@/lib/api/idempiere/models";

// =============================================================================
// Types
// =============================================================================

export interface AccountSectionProps {
  /** Available greetings for dropdown */
  greetings?: GreetingOption[];
  /** Whether to show password fields (create mode only) */
  showPasswordFields?: boolean;
  /** Whether fields should be disabled */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Account Setup Form Section
 * Step 3 fields: Email, Greeting, Title, Phone, Phone2, Birthday, Comments, Username, Password, UserPIN
 *
 * Uses useFormContext to access the parent form state.
 * Expects form to have these fields: step3.email, step3.greetingId, step3.title, step3.phone, step3.phone2, step3.birthday, step3.comments, step3.username, step3.password, step3.userPin
 */
export function AccountSection({ greetings = [], showPasswordFields = true, disabled = false }: AccountSectionProps) {
  const form = useFormContext();

  // Watch greetingId for display purposes
  const selectedGreeting = greetings.find((g) => g.id === form.watch("step3.greetingId"));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Username */}
      <FormField
        control={form.control}
        name="step3.username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username *</FormLabel>
            <FormControl>
              <Input placeholder="Login username" {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>Used for system login</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="step3.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="student@example.com" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password - only shown in create mode */}
      {showPasswordFields && (
        <FormField
          control={form.control}
          name="step3.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Login password" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* User PIN - optional, only in create mode */}
      {showPasswordFields && (
        <FormField
          control={form.control}
          name="step3.userPin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User PIN</FormLabel>
              <FormControl>
                <Input placeholder="Optional PIN code" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Greeting */}
      <FormField
        control={form.control}
        name="step3.greetingId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Greeting *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select greeting" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {greetings.map((greeting) => (
                  <SelectItem key={greeting.id} value={greeting.id.toString()}>
                    {greeting.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Title */}
      <FormField
        control={form.control}
        name="step3.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mr., Ms., Dr." {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Primary Phone */}
      <FormField
        control={form.control}
        name="step3.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Phone</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 08123456789" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Secondary Phone */}
      <FormField
        control={form.control}
        name="step3.phone2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary Phone</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 08198765432" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Birthday */}
      <FormField
        control={form.control}
        name="step3.birthday"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birthday *</FormLabel>
            <FormControl>
              <Input type="date" {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>Format: YYYY-MM-DD</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Comments - spans full width */}
      <FormField
        control={form.control}
        name="step3.comments"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Comments</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional notes..."
                className="resize-none"
                rows={2}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
