# Changelog

## Admin Dashboard & Operations Tool

### Global Audit & Activity Logging

- **Implemented `AdminOpsProvider`** with centralized logging functions:
  - `pushAudit` - records admin actions with context
  - `pushActivity` - updates activity feed
  - `pushNotification` - triggers toast notifications
- **Wired all admin actions** to emit logs:
  - Bookings: create, update, delete, print, export
  - Packages: create, update, delete
  - Blogs: save, publish/unpublish, delete
  - Customers: view profile, send message/email, save notes
  - Revenue: export reports

### Layout & Shell Improvements

- **AdminShell component**: Conditionally renders sidebar/topbar only on admin routes
- **PublicShell component**: Hides Header/Footer on admin routes
- **Print-friendly routes**: Clean layout without admin chrome for booking forms

### UI/UX Fixes

- **Fixed AdminDrawer/AdminTopbar stacking**: Resolved z-index conflicts with proper portal rendering
- **AdminSidebar positioning**: Fixed sidebar to be properly scrollable and responsive
- **Tailwind grid updates**: Applied user-requested `!important` classes across admin pages
- **Responsive behavior**: Improved mobile/tablet layouts for admin components

## Content Management

### Blogs Editor Migration

- **Replaced TipTap with Quill editor** for React 19 compatibility
- **Content storage**: Switched from TipTap JSON to Quill Delta JSON
- **Removed react-quill dependency**: Used Quill core with ref-based initialization
- **Features maintained**: Rich toolbar, formatting options, and content preview

### Blog Operations

- **Publish/Unpublish**: Toggle blog status with audit logging
- **Delete**: Remove blogs with confirmation and logging
- **Save drafts**: Auto-save functionality with activity tracking

## Exports & Print System

### Branded XLSX Exports

- **Upgraded to ExcelJS** for professional spreadsheet generation
- **Features**:
  - Company logo embedding
  - Styled headers with background colors
  - Frozen panes at header row
  - Export metadata (date, exported by, period)
  - Professional formatting and borders

**Implemented for**:

- **Bookings**: Export selected or filtered bookings with full details
- **Customers**: Export selected or all customers with contact info
- **Revenue**: Period-based revenue reports with totals

### CSV Exports

- **Maintained alongside XLSX** for compatibility
- **Same data sources** as XLSX exports
- **Quick download** option for basic data needs

### Print Booking Forms

- **New route**: `/admin/bookings/print/[id]` with branded layout
- **Features**:
  - Company logo and details
  - Complete booking information
  - Customer and package details
  - Auto-print on load (`?auto=1` parameter)
  - Print-optimized CSS styling
- **Access points**: Table row actions and drawer print button
- **Audit logging**: All print actions tracked

### Export Infrastructure

- **Row selection**: Enabled for customers table
- **Smart export logic**: Export selected rows if any, otherwise filtered data
- **Download helpers**: Consistent file naming and browser downloads
- **Ops integration**: All export actions logged with context

## Technical Fixes & Improvements

### React 19 Compatibility

- **Fixed ReactQuill issues**: Replaced with Quill core to avoid `findDOMNode` deprecation
- **SSR hydration**: Proper editor initialization to prevent hydration mismatches
- **Component lifecycle**: Correct handling of editor mounting/unmounting

### Development Environment

- **Turbopack panic fix**: Resolved Windows symlink privilege error (os error 1314)
- **Dev script update**: Changed from `next dev --no-turbo` to `next dev --webpack`
- **Supported opt-out**: Using Next.js 16's official Webpack fallback

### TypeScript Improvements

- **AuditAction union**: Extended to include `"export"` and `"print"` actions
- **Type safety**: Removed `@ts-ignore` comments by properly typing actions
- **Component props**: Improved type definitions for editor and export components

## File Structure Changes

### New Files

- `app/components/admin/export/brandedXlsx.ts` - ExcelJS export helper
- `app/admin/bookings/print/[id]/page.tsx` - Printable booking form
- `app/components/admin/AdminShell.tsx` - Admin layout wrapper
- `app/components/PublicShell.tsx` - Public layout wrapper

### Modified Files

- `app/admin/blogs/page.tsx` - Quill editor integration, ops logging
- `app/admin/bookings/page.tsx` - Print actions, ExcelJS exports
- `app/admin/customers/page.tsx` - Row selection, ExcelJS exports
- `app/admin/revenue/page.tsx` - ExcelJS exports, period logic
- `app/components/admin/AdminOpsProvider.tsx` - Audit actions union
- `app/components/admin/AdminDrawer.tsx` - Portal rendering, z-index fixes
- `app/components/admin/AdminTopbar.tsx` - Stacking behavior
- `app/components/admin/AdminSidebar.tsx` - Fixed positioning
- `app/layout.tsx` - Shell integration, CSS imports
- `package.json` - Dependencies, dev script fix

## Dependencies

### Added

- `exceljs` - Professional Excel file generation
- `quill` - Rich text editor core

### Removed

- `react-quill` - Replaced with Quill core for React 19 compatibility

## Optional Next Steps

### Server-side PDF Generation

- **Endpoint for branded PDFs**: Invoice, itinerary, booking form PDFs
- **Template system**: Reusable PDF templates with company branding
- **Print-to-PDF**: Server-side generation for consistent formatting

### Additional Export Formats

- **Google Sheets integration**: Direct export to Google Workspace
- **Report scheduling**: Automated export delivery
- **Advanced filtering**: More granular export options

---

_Last updated: December 2025_
