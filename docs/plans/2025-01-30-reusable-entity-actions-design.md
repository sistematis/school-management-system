# Reusable Entity Actions Design

**Date:** 2025-01-30
**Status:** Implementation Complete
**Type:** Architecture Enhancement

## Overview

Design a reusable and dynamic UI/UX system for entity actions (CRUD + document workflow) that can be used across multiple pages in the School Management System.

## Problem Statement

Current implementation of `ActionsColumnConfig` is coupled per entity, leading to:
- Repetitive code across multiple entity pages
- Inconsistent action handling
- Difficulty managing document workflow actions (Draft → Prepare → In Progress → Completed)

## Solution: Action Registry + Entity Config Pattern

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Entity Page                                  │
│                    (Students, PO, Products, etc.)                     │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     v
┌─────────────────────────────────────────────────────────────────────┐
│                    Entity Action Config                              │
│  - MasterDataActionConfig (Product, User, BP)                       │
│  - DocumentActionConfig (PO, Invoice, MR)                           │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     v
┌─────────────────────────────────────────────────────────────────────┐
│                        Action Builder                                │
│  - buildMasterDataActions()                                         │
│  - buildDocumentActions()                                           │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     v
┌─────────────────────────────────────────────────────────────────────┐
│                      Action Registry                                 │
│  - Master Data Actions (View, Edit, Delete)                         │
│  - Document Actions (AP, CL, CO, IN, PO, PR, RA, RC, RE, RJ, VO, WC, XL)│
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     v
┌─────────────────────────────────────────────────────────────────────┐
│                      ActionItem[]                                    │
│                         (filtered by status)                         │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     v
┌─────────────────────────────────────────────────────────────────────┐
│                    ActionsColumnConfig                               │
│                         (Dropdown Menu)                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Type Definitions

### Document Status (iDempiere)

```typescript
export type DocumentStatus =
  | "??"   // Unknown
  | "AP"   // Approved
  | "CL"   // Closed
  | "CO"   // Completed
  | "DR"   // Drafted
  | "IN"   // Invalid
  | "IP"   // In Progress
  | "NA"   // Not Approved
  | "RE"   // Reversed
  | "VO"   // Voided
  | "WC"   // Waiting Confirmation
  | "WP";  // Waiting Payment
```

### Document Action (iDempiere)

```typescript
export type DocumentAction =
  | "--"   // None
  | "AP"   // Approve
  | "CL"   // Close
  | "CO"   // Complete
  | "IN"   // Invalidate
  | "PO"   // Post
  | "PR"   // Prepare
  | "RA"   // Reverse - Accrual
  | "RC"   // Reverse - Correct
  | "RE"   // Re-activate
  | "RJ"   // Reject
  | "VO"   // Void
  | "WC"   // Wait Complete
  | "XL";  // Unlock
```

### Config Types

```typescript
// Master Data Entity (Product, User, Business Partner)
export interface MasterDataActionConfig<T = any> {
  entityName: string;
  enableView?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onView?: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  copyId?: { getId: (entity: T) => string; label?: string };
  customActions?: ActionItemConfig<T>[];
}

// Document Entity (PO, Invoice, Material Receipt)
export interface DocumentActionConfig<T extends DocumentEntity = any> {
  entityName: string;
  enableView?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  workflowActions: (DocumentAction | "separator")[];
  onView?: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  onWorkflowAction?: (entity: T, action: DocumentAction) => void;
  copyId?: { getId: (entity: T) => string; label?: string };
  customActions?: ActionItemConfig<T>[];
}
```

## Document Action Registry

| Action | Label | Description | Allowed From Statuses |
|--------|-------|-------------|----------------------|
| AP | Approve | Approve this transaction | DR, IP, NA, WC, WP |
| CL | Close | Finally close this transaction | CO |
| CO | Complete | Generate documents and complete | DR, IP, WC, WP |
| IN | Invalidate | Invalidate Document | DR, IP, WC, WP |
| PO | Post | Post transaction | DR, IP |
| PR | Prepare | Check Document consistency | DR, WC, WP |
| RA | Reverse - Accrual | Reverse by switching Dr/Cr with current date | CO, CL |
| RC | Reverse - Correct | Reverse Transaction with same date | CO |
| RE | Re-activate | Reopen Document and Reverse generated docs | CO, CL, RE, VO, IN |
| RJ | Reject | Reject the approval | AP, WC, WP |
| VO | Void | Set all quantities to zero | DR, IP, WC, WP, CO |
| WC | Wait Complete | Wait Condition ok Complete | DR, IP, WC, WP |
| XL | Unlock | Unlock Transaction (process error) | Any (when processing=true) |

## Action Flow Examples

### Master Data (Product)
```
Dropdown: View details → Edit → Delete
```

### Document (Purchase Order)

**Status: Draft (DR)**
```
View details → Edit → ───────── → Prepare → Complete → ───────── → Void
```

**Status: In Progress (IP)**
```
View details → Edit → ───────── → Complete → ───────── → Re-activate → Void → Reject
```

**Status: Completed (CO)**
```
View details → ───────── → Re-activate → Void → Close → Reverse - Accrual → Reverse - Correct
```

**Status: Voided (VO)**
```
View details → ───────── → Re-activate
```

## File Structure

```
src/
├── types/
│   └── entity-actions.ts                    # Type definitions
│
├── lib/
│   └── actions/
│       ├── document-action-registry.ts      # Document action definitions
│       ├── build-master-data-actions.ts     # Builder for master data
│       ├── build-document-actions.ts        # Builder for documents
│       └── action-utils.ts                  # Toast, error handling
│
├── config/
│   └── actions/
│       ├── product-actions.ts               # Master data example
│       ├── business-partner-actions.ts      # Master data example
│       ├── purchase-order-actions.ts        # Document example
│       └── invoice-actions.ts               # Document example
│
└── components/
    └── data-table/
        └── generic-columns.tsx              # Update ActionsColumnConfig if needed
```

## Usage Example

### Master Data (Product)

```typescript
// config/actions/product-actions.ts
export const productActionConfig: MasterDataActionConfig<Product> = {
  entityName: "product",
  enableView: true,
  enableEdit: true,
  enableDelete: true,
  onView: (product) => { /* navigate to detail */ },
  onEdit: (product) => { window.location.href = `/products/${product.id}/edit`; },
  onDelete: async (product) => { await deleteProduct(product.id); },
  copyId: { getId: (p) => p.value, label: "Copy Product ID" },
};

// columns.tsx
const actionsColumn: ActionsColumnConfig<Product> = {
  items: (product) => buildMasterDataActions(productActionConfig, product),
  copyId: productActionConfig.copyId,
};
```

### Document (Purchase Order)

```typescript
// config/actions/purchase-order-actions.ts
export const purchaseOrderActionConfig: DocumentActionConfig<PurchaseOrder> = {
  entityName: "purchaseOrder",
  enableView: true,
  enableEdit: true,
  enableDelete: true,
  workflowActions: ["PR", "AP", "CO", "separator", "RE", "VO", "RJ", "separator", "CL", "RA", "RC"],
  onView: (po) => { /* open drawer */ },
  onEdit: (po) => { window.location.href = `/po/${po.id}/edit`; },
  onDelete: async (po) => { await deletePO(po.id); },
  copyId: { getId: (po) => po.documentNo },
};

// columns.tsx
const actionsColumn: ActionsColumnConfig<PurchaseOrder> = {
  items: (po) => buildDocumentActions(purchaseOrderActionConfig, po),
  copyId: purchaseOrderActionConfig.copyId,
};
```

## UX Enhancements

1. **Error Handling**: Toast notifications for success/error states
2. **Loading States**: Show loading indicator during async actions
3. **Keyboard Shortcuts**: Ctrl+E (Edit), Ctrl+D (Delete), Ctrl+Enter (Complete)
4. **Confirm Dialogs**: Better UX than browser confirm()
5. **Bulk Actions**: Support for multi-row actions (optional)

## Implementation Checklist

- [x] Create `src/types/entity-actions.ts`
- [x] Create `src/lib/actions/document-action-registry.ts`
- [x] Create `src/lib/actions/build-master-data-actions.ts`
- [x] Create `src/lib/actions/build-document-actions.ts`
- [x] Create `src/lib/actions/action-utils.ts`
- [x] Create example configs in `src/config/actions/`
- [x] Update `StudentsPage` to use new system
- [ ] Test with Product (master data) - Future work
- [ ] Test with Purchase Order (document workflow) - Future work

## Related Files

- `src/app/(main)/academic/students/page.tsx` - Current student page implementation
- `src/app/(main)/academic/students/columns.tsx` - Current column definitions
- `src/components/data-table/generic-columns.tsx` - Existing column builders
