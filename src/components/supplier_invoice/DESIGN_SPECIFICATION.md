# 🧾 SUPPLIER INVOICES – LIST

UI / UX DESIGN DESCRIPTION (XS DENSITY)

## 1. Overall UI Purpose

An enterprise accounting interface for managing supplier invoices.
The UI prioritizes speed, clarity, and compactness, designed for power users who handle large invoice volumes.

Design style:

Clean

Flat

Data-centric

Minimal decoration

Extra-small spacing

## 2. Global Layout Structure
Top Navigation Bar
├── Primary Tabs (Module Navigation)
│
├── Page Header
│   ├── Page Title
│   ├── Search Input
│   ├── Extended Search Link
│   └── Primary CTA Button
│
└── Utility Action Bar
    ├── Email Info
    ├── Secondary Actions (Icons + Labels)

## 3. Top Navigation Bar
Purpose

Switch between major accounting modules.

Height

48px

Tabs (Left aligned)

Supplier invoices (active)

Payments out

Invoices received

Send for interpretation

Active Tab Indicator

Bottom border: 2px solid

Color: #0F9D58 (green)

Colors

Background: #FFFFFF

Text (inactive): #374151

Text (active): #111827

Typography

Font size: 13px

Font weight: 500

Alignment

Tabs: Left aligned

Reports / Register: Right aligned

## 4. Page Header Section
Height

64px

Alignment

Horizontal layout

Left: Title + Search

Right: Primary action button

Page Title

Text: SUPPLIER INVOICES – LIST

Font size: 16px

Font weight: 600

Color: #1F2937

Letter spacing: slight (+0.3px)

Search Input

Placeholder text:

Serial no., Supplier no., Name, OCR/Invoice…

Size (XS)

Height: 32px

Width: 320px

Padding: 0 8px

Styling

Border: 1px solid #D1D5DB

Border radius: 4px

Background: #FFFFFF

Text color: #374151

Placeholder color: #9CA3AF

Icon

Search icon (left inside input)

Size: 14px

Color: #9CA3AF

Extended Search Link

Font size: 12px

Color: #2563EB

Alignment: inline, right of search

Hover: underline

Cursor: pointer

Primary CTA – Create Supplier Invoice
Size

Height: 32px

Padding: 0 14px

Border radius: 16px (pill)

Colors

Background: #FFC107

Text: #000000

Icon

Plus (+)

Icon size: 14px

Positioned left of text

## 5. Utility Action Bar
Height

40px

Background

#FFFFFF

Border

Bottom border: 1px solid #E5E7EB

Elements (Left to Right)
Email Information
📧 Email documents: inbox.lev.1520105@arkivplats.se


Font size: 12px

Color: #374151

Icon size: 14px

Alignment: left

Secondary Actions (Right Aligned)

Each action consists of:

Icon + text label

Inline horizontal layout

Actions:

Download linked pictures

Print list

Process payment files

Styling:

Font size: 12px

Icon size: 14px

Text color: #374151

Hover color: #2563EB

Gap between items: 16px

## 6. Alignment Rules

Vertical centering for all icons & text

Consistent baseline alignment

No unnecessary vertical padding

Text always left-aligned

Actions grouped visually

## 7. Color Palette (HEX)
Primary

Yellow (CTA): #FFC107

Green (active tab): #0F9D58

Blue (links): #2563EB

Neutral

Text primary: #1F2937

Text secondary: #374151

Muted text: #9CA3AF

Border: #E5E7EB

Background: #FFFFFF

Page background: #F9FAFB

## 8. Typography System (XS)
Usage	Size	Weight
Page title	16px	600
Navigation tabs	13px	500
Input text	12px	400
Action labels	12px	400
Links	12px	500

Font family:

Inter, Roboto, Helvetica, Arial, sans-serif

## 9. Spacing & Density

Horizontal padding: 16px

Vertical padding: 8px

Icon-text gap: 6px

Section gaps: 12px

Design density: Extra Small (XS)
→ Maximum information, minimum whitespace.

## 10. Responsiveness
Desktop (≥1024px)

Full horizontal layout

Search input fixed width

All actions visible

Tablet (768–1023px)

Search input shrinks

Utility actions wrap to second line if needed

Mobile (≤767px)

Tabs become horizontal scroll

Search becomes full width

Primary CTA becomes floating button

Utility actions collapse into overflow menu (⋮)

## 11. Accessibility

Contrast ratio ≥ 4.5:1

Focus outline: #2563EB

Click targets ≥ 28px

Keyboard navigation supported

Icons have ARIA labels