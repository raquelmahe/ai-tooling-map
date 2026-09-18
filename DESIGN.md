---
name: Product Design AI Tooling System
description: A calm, evidence-led workspace for accountable capability portfolio decisions.
colors:
  workspace: "#fbfbfa"
  surface: "#ffffff"
  border: "#d8d8d8"
  border-soft: "#e7e7e7"
  ink: "#111111"
  ink-muted: "#5a5a5a"
  evidence-violet-subtle: "#f1e9ff"
  evidence-violet: "#5b2a9e"
  evidence-violet-border: "#7c3aed"
  evidence-violet-hover: "#4a2180"
  evidence-violet-active: "#35145f"
  on-accent: "#ffffff"
  rail: "#151515"
  rail-surface: "#2a2a2a"
  rail-muted: "#a6a6a6"
  positive-surface: "#e3f3e8"
  positive-ink: "#146c2e"
  caution-surface: "#fdf1dc"
  caution-ink: "#8a5a00"
  info-surface: "#e5eefb"
  info-ink: "#1a4a8a"
  negative-surface: "#fbe6e6"
  negative-ink: "#a02323"
  neutral-surface: "#ececee"
  neutral-ink: "#4a4f5c"
  workstream-delivery-surface: "#e1f2ec"
  workstream-delivery-ink: "#146c5a"
  workstream-practice-surface: "#fbe6f0"
  workstream-practice-ink: "#a02362"
typography:
  display:
    fontFamily: "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.0625rem"
  headline:
    fontFamily: "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 900
    lineHeight: 1.25
    letterSpacing: "-0.0625rem"
  title:
    fontFamily: "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Skyscanner Relative, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  pill: "9999px"
spacing:
  2xs: "0.125rem"
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.evidence-violet}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.evidence-violet-hover}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  chip-positive:
    backgroundColor: "{colors.positive-surface}"
    textColor: "{colors.positive-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
---

# Design System: Product Design AI Tooling System

## Overview

**Creative North Star: "The Evidence Workbench"**

This system is a calm, rigorous, accountable workspace for inspecting capability evidence and making portfolio decisions. Its compact dark rail acts as a stable tool rack beside an off-white working plane; white records, tables, and drawers hold the evidence without competing with it.

The visual language is deliberately operational rather than promotional. Dense information is made navigable through strong type hierarchy, consistent spacing, quiet borders, explicit semantic states, and selective depth. Interaction color is scarce and meaningful, while status color always preserves its data meaning.

**Key Characteristics:**
- Compact monochrome application chassis with a dark icon rail.
- Off-white workspace and white evidence surfaces.
- Backpack-derived typography with strong, compact headings.
- Evidence Violet reserved for interaction, focus, and illustrative evidence.
- Semantic status colors that never become decoration.
- Right-docked drawers for detail and creation work.

## Colors

The palette is predominantly neutral, with one controlled interaction family and clearly separated semantic tones.

### Primary
- **Evidence Violet:** Used for primary interaction, focus, selected emphasis, and explicitly illustrative evidence.
- **Evidence Violet Mist:** Used only as a quiet background for illustrative or capability emphasis.

### Neutral
- **Workbench Paper:** The slightly warm application workspace that separates the product from its white evidence surfaces.
- **Evidence Surface:** The base for cards, tables, controls, and drawers.
- **Primary Ink:** The default text and high-commitment action color.
- **Secondary Ink:** Supporting copy, metadata, and explanatory labels.
- **Structural Border / Soft Divider:** Borders establish containment; softer dividers organize content within a surface.
- **Tool Rail / Rail Surface / Rail Muted:** The compact navigation chassis and its inactive states.

### Tertiary
- **Positive, Caution, Information, Negative, and Neutral pairs:** Paired surface and ink colors communicate approval, evidence, risk, and portfolio state. Each pair retains its assigned meaning.

### Named Rules

**The One Interaction Voice Rule.** Evidence Violet is the only chromatic interaction accent; do not introduce competing section or navigation colors.

**The Status Is Data Rule.** Positive, caution, information, negative, and neutral colors communicate state only. Never reuse them for decorative card edges, page sections, or generic emphasis.

## Typography

**Display Font:** Skyscanner Relative with the established system sans-serif fallbacks  
**Body Font:** Skyscanner Relative with the established system sans-serif fallbacks

**Character:** The single-family system is direct, legible, and operational. Heavy headings establish decisive hierarchy while regular body copy supports sustained reading and dense tables.

### Hierarchy
- **Display:** Page-level identity and first-level workspace headings; heavy, compact, and tightly tracked.
- **Headline:** Major section headings; heavy enough to anchor long operational views.
- **Title:** Drawer records and subsection headings; strong without competing with page titles.
- **Body:** Explanations, records, and form content; readable measures generally stay within 68-78 characters where the layout allows.
- **Label:** Metadata, table descriptors, and tags; bold and compact, with uppercase and tracking reserved for structural labels.

### Named Rules

**The One Family Rule.** Use Skyscanner Relative across display, body, labels, tables, and controls; hierarchy comes from role, weight, size, and spacing rather than decorative type changes.

## Layout

The desktop shell uses a sticky compact icon rail beside a fluid content canvas. Content is full-width for evidence-heavy tables, while explanatory headers and prose use constrained reading measures. A shared spacing scale controls component padding and vertical rhythm, with parent stacks owning the space between related blocks.

Wide matrices and registers remain honest data tables and scroll horizontally rather than compressing into unreadable columns. At the mobile breakpoint, the rail becomes a sticky horizontal bar; form rows and drawer detail grids collapse to a single column. Page gutters use a fluid inline value so the canvas remains usable between phone and desktop widths.

## Elevation & Depth

The system is layered by purpose. Borders and tonal contrast provide the default structure; restrained ambient shadows distinguish interactive cards and control groups, stronger shadows mark hover or raised state, and the largest shadow is reserved for transient docked drawers and confirmation feedback.

### Shadow Vocabulary
- **Quiet Surface:** A barely visible ambient shadow for cards, callouts, and filter groups at rest.
- **Raised Surface:** A firmer shadow for hovered cards and tooltips.
- **Transient Layer:** The strongest shadow, reserved for drawers and floating confirmation feedback.

### Named Rules

**The Earned Elevation Rule.** Depth must indicate containment, interaction, or transience; static page sections do not receive shadows merely for decoration.

## Shapes

Corners are gently curved and compact. Small controls use the tightest radius, cards use the middle radius, larger field containers and data tables use the largest radius, and pills are reserved for status tags and circular navigation controls. Borders remain thin and quiet; dashed borders identify unknown or illustrative states rather than generic decoration.

## Components

Components are restrained and dependable: familiar in behavior, compact in density, and explicit in state.

### Buttons
- **Shape:** Compact rectangular controls with gently curved corners.
- **Primary:** Evidence Violet is the default action treatment; register and creation contexts may use Primary Ink when the surrounding surface is deliberately monochrome.
- **Hover / Focus:** Hover deepens the assigned action color. Keyboard focus uses a clearly offset Evidence Violet ring; dark-rail focus uses white.
- **Ghost:** Transparent with a structural border, shifting toward interaction color on hover.

### Chips
- **Style:** Compact pill labels use paired semantic surface and text colors.
- **State:** Dashed borders distinguish unknown and illustrative records. Selected state is not inferred through color alone.

### Cards / Containers
- **Corner Style:** Gently curved corners with thin soft borders.
- **Background:** Evidence Surface on Workbench Paper.
- **Shadow Strategy:** Quiet at rest and raised on interactive hover.
- **Internal Padding:** The base spacing step is the default inset.

### Inputs / Fields
- **Style:** White fields with structural borders, large gentle corners, and inset labels for the creation flow.
- **Focus:** A visible Evidence Violet outline sits outside the field border.
- **Error / Disabled:** No durable visual treatment is established yet; future states must remain distinct from unknown evidence styling.

### Navigation
- **Style:** A dark compact icon rail with circular controls. Inactive icons are muted, hover adds a quiet tonal surface, and the active state combines a darker surface with a pale violet icon. Labels appear as tooltips on desktop and are replaced by accessible names on mobile.

### Docked Drawers

Detail and creation tasks use a full-height white surface docked to the right, with a sticky translucent top bar, circular close control, and the strongest elevation in the system. On narrow screens the drawer takes the full width and detail grids become single-column.

## Do's and Don'ts

### Do:
- **Do** preserve the dark-rail, off-white-workspace, white-surface hierarchy.
- **Do** use semantic tone pairs consistently and keep unknown states explicitly labelled.
- **Do** let borders, spacing, and typography carry most of the hierarchy.
- **Do** keep evidence tables horizontally scrollable when their information model requires width.
- **Do** use right-docked drawers for contextual detail and creation work.

### Don't:
- **Don't** use decorative gradients or mixed accents within a section.
- **Don't** repurpose semantic status colors as navigation, card-edge, or section decoration.
- **Don't** introduce editorial serif typography into the application system.
- **Don't** import public marketing graphics or illustrated empty states into this evidence workspace.
- **Don't** imply that visual polish makes illustrative or unknown data confirmed.
