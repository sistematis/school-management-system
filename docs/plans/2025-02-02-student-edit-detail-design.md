# Student Edit & Enhanced Detail View Design

**Date:** 2025-02-02
**Status:** Design Approved
**Related Tasks:** Update Student Details View, Implement Edit Flow, Create Shared Components

---

## Overview

This design document outlines the implementation of:

1. **Enhanced Student Detail View** - Maintain current structure with improvements
2. **Tab-Based Edit Flow** - Full-page edit interface with 4 tabs
3. **Shared Form Components** - Reusable components for Add and Edit flows

---

## Requirements Summary

| Requirement | Decision |
|-------------|----------|
| Detail View Structure | Keep current (Business Partner, Contacts, Locations) |
| Edit UI Type | Full page at `/academic/students/[id]/edit` |
| Component Strategy | Create new shared components |
| Save Behavior | Single save button at end of form |
| Entity Scope | Edit all entities (C_BPartner, AD_User, C_BPartner_Location) |
| Student ID Field | `c_bpartner_id` is read-only (URL param), `value` is editable |

---

## Architecture & File Structure

### New Files

```
src/
├── components/students/form-sections/
│   ├── index.ts
│   ├── basic-info-section.tsx       # Step 1 fields
│   ├── address-section.tsx          # Step 2 fields
│   ├── account-section.tsx          # Step 3 fields
│   └── role-section.tsx             # Step 4 fields
│
├── app/(main)/academic/students/
│   └── [id]/
│       └── edit/
│           └── page.tsx             # New edit page with tabs
│
└── lib/
    └── schemas/
        └── student-update.schema.ts # Update validation schema
```

### Modified Files

```
src/
├── app/(main)/academic/students/
│   ├── page.tsx                     # Update "Edit" action
│   └── new/page.tsx                 # Refactor to use shared components
│
└── components/students/
    └── student-detail-drawer.tsx    # Enhance detail view
```

---

## Edit Page Implementation

### Page: `/academic/students/[id]/edit/page.tsx`

**URL Pattern:** `/academic/students/[id]/edit`
- `id` = `c_bpartner_id` (read-only identifier)

**Features:**
1. Fetch student data using `getStudentByIdWithExpand`
2. Initialize form with fetched data
3. Tab-based navigation (4 tabs)
4. Single submit handler with sequential API calls
5. Stay on page after successful submit with toast notification

**Component Structure:**
```tsx
export default function EditStudentPage({ params }: { params: { id: string } }) {
  const { data: student, isLoading } = useStudentData(params.id);
  const form = useForm<StudentFormData>({
    defaultValues: transformToFormValues(student),
    resolver: zodResolver(studentUpdateSchema),
  });

  const onSubmit = async (values: StudentFormData) => {
    // Sequential API calls
    await updateCPartner(params.id, values);
    await updateADUser(values.userId, values);
    await updateLocation(values.locationId, values);
    toast.success('Student updated successfully');
  };

  return (
    <Tabs defaultValue="basic">
      <TabsList>
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="address">Address & Location</TabsTrigger>
        <TabsTrigger value="account">Account Setup</TabsTrigger>
        <TabsTrigger value="role">Role Assignment</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicInfoSection form={form} mode="edit" />
      </TabsContent>
      {/* Other tabs... */}

      <Button onSubmit={form.handleSubmit(onSubmit)}>Save Changes</Button>
    </Tabs>
  );
}
```

### Submit Handler Details

**API Calls (Sequential):**

```
PUT /api/v1/models/C_BPartner/:id
Body: {
  value: "STU001",          // EDITABLE
  name: "John Doe",
  name2: "Smith",
  bpGroupId: "...",
  taxId: "...",
  description: "..."
  // Note: c_bpartner_id NOT in body (it's the URL param)
}

PUT /api/v1/models/AD_User/:userId
Body: {
  username: "...",
  email: "...",
  phone: "...",
  phone2: "...",
  title: "...",
  birthday: "...",
  comments: "..."
}

PUT /api/v1/models/C_BPartner_Location/:locationId
Body: {
  locationName: "...",
  address1: "...",
  address2: "...",
  address3: "...",
  address4: "...",
  city: "...",
  postal: "...",
  countryId: "..."
}
```

---

## Shared Form Components

### Component Interface

All form sections follow the same pattern:

```tsx
interface FormSectionProps {
  form: UseFormReturn<StudentFormData>;
  mode?: 'create' | 'edit';
}
```

### 1. BasicInfoSection (`basic-info-section.tsx`)

**Fields (Step 1):**
| Field | Type | Required |
|-------|------|----------|
| value | string | Yes |
| name | string | Yes |
| name2 | string | No |
| bpGroupId | string (dropdown) | Yes |
| taxId | string | No |
| description | string (textarea) | No |

### 2. AddressSection (`address-section.tsx`)

**Fields (Step 2):**
| Field | Type |
|-------|------|
| locationName | string |
| address1 | string |
| address2 | string |
| address3 | string |
| address4 | string |
| city | string |
| postal | string |
| countryId | string (dropdown) |

### 3. AccountSection (`account-section.tsx`)

**Fields (Step 3):**
| Field | Type |
|-------|------|
| username | string |
| email | string (email) |
| phone | string |
| phone2 | string |
| title | string |
| birthday | string (date) |
| comments | string (textarea) |

### 4. RoleSection (`role-section.tsx`)

**Fields (Step 4):**
| Field | Type |
|-------|------|
| roleId | string (dropdown) |

---

## Data Types & Validation

### Form Data Type

```typescript
// src/lib/types/students.ts

export interface StudentFormData {
  // C_BPartner fields
  value: string;
  name: string;
  name2?: string;
  bpGroupId: string;
  taxId?: string;
  description?: string;

  // C_BPartner_Location fields
  locationName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  city?: string;
  postal?: string;
  countryId?: string;
  locationId?: string;  // Only for edit

  // AD_User fields
  username?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  title?: string;
  birthday?: string;
  comments?: string;
  userId?: string;  // Only for edit

  // Role
  roleId?: string;
}
```

### Validation Schema

```typescript
// src/lib/schemas/student-update.schema.ts

import { z } from 'zod';

export const studentUpdateSchema = z.object({
  value: z.string().min(1, 'Student ID is required'),
  name: z.string().min(1, 'Full name is required'),
  name2: z.string().optional(),
  bpGroupId: z.string().min(1, 'Student group is required'),
  taxId: z.string().optional(),
  description: z.string().optional(),
  locationName: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  address4: z.string().optional(),
  city: z.string().optional(),
  postal: z.string().optional(),
  countryId: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  title: z.string().optional(),
  birthday: z.string().optional(),
  comments: z.string().optional(),
  roleId: z.string().optional(),
});

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;
```

---

## Error Handling

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| Student not found | Next.js `notFound()` |
| Fetch API error | Error state component |
| Validation error | Inline field errors via Zod |
| Submit API error | Toast notification, field-specific errors |
| No AD_User exists | Skip AD_User update |
| No location exists | Create new location |
| Network timeout | Retry option |
| Concurrent edit | Warning message |

### Example Error Handling

```tsx
const onSubmit = async (values: StudentFormData) => {
  try {
    await updateCPartner(params.id, cPartnerData);

    if (values.userId) {
      await updateADUser(values.userId, userData);
    }

    if (values.locationId) {
      await updateLocation(values.locationId, locationData);
    }

    toast.success('Student updated successfully');
  } catch (error) {
    if (error instanceof CPartnerUpdateError) {
      form.setError('value', { message: 'Student ID already exists' });
    }
    toast.error('Failed to update student');
  }
};
```

---

## Testing Strategy

### Unit Tests

- Each form section component
- Validation schema
- Data transformation functions

### Integration Tests

- Edit page data loading
- Tab navigation
- Form submission flow
- Error handling

### E2E Tests (Playwright)

1. Navigate to students page
2. Click edit on a student
3. Verify edit page loads with data
4. Switch between tabs
5. Modify fields
6. Submit form
7. Verify success toast
8. Verify staying on edit page

### Manual Testing Checklist

- [ ] Edit page loads with correct data
- [ ] All 4 tabs render correctly
- [ ] Form fields are prefilled
- [ ] Validation works on each tab
- [ ] Save updates all 3 entities
- [ ] Success toast appears
- [ ] Page stays on edit after save
- [ ] Error handling works
- [ ] Loading states display correctly

---

## Implementation Checklist

### Phase 1: Shared Components
- [ ] Create `form-sections` directory
- [ ] Implement `BasicInfoSection`
- [ ] Implement `AddressSection`
- [ ] Implement `AccountSection`
- [ ] Implement `RoleSection`
- [ ] Create `index.ts` barrel export
- [ ] Write component tests

### Phase 2: Edit Page
- [ ] Create edit page route
- [ ] Implement data fetching
- [ ] Set up form with react-hook-form
- [ ] Implement tab navigation
- [ ] Integrate form sections
- [ ] Implement submit handler
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications

### Phase 3: Update Existing Code
- [ ] Update students page "Edit" action
- [ ] Refactor new student page to use shared components
- [ ] Update detail drawer if needed

### Phase 4: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing

---

## API Dependencies

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/models/C_BPartner/:id` | GET | Fetch student data |
| `/api/v1/models/C_BPartner/:id` | PUT | Update C_BPartner |
| `/api/v1/models/AD_User/:id` | PUT | Update AD_User |
| `/api/v1/models/C_BPartner_Location/:id` | PUT | Update location |
| `/api/v1/models/C_BP_Group` | GET | Get BP groups dropdown |
| `/api/v1/models/C_Country` | GET | Get countries dropdown |
| `/api/v1/models/AD_Role` | GET | Get roles dropdown |

---

## UI/UX Considerations

1. **Tab Navigation**
   - Active tab highlighting
   - Disabled validation on non-active tabs
   - Warn on unsaved changes when switching tabs

2. **Form Layout**
   - Consistent field layout across tabs
   - Clear section headers
   - Appropriate input types (date, email, tel)

3. **Feedback**
   - Loading spinners during submit
   - Success/error toast notifications
   - Inline validation messages

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management
