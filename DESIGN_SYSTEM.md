# The Daily Vroom — Design System

A reference document for applying the **Speedform** visual identity across all Daily Vroom products and any related apps.

---

## Concept

**Speedform** — clean motorsport-data aesthetic. High contrast, zero decoration, every element earns its place. Feels like a professional timing screen or a well-kept spec sheet: immediate, legible, authoritative.

---

## Color Palette

| Role | Hex | Usage |
|---|---|---|
| Page background | `#FAFAF8` | Main page surface |
| Card / Input background | `#FFFFFF` | Form fields, result cards |
| Ink (primary text) | `#111111` | Headlines, labels, masthead background |
| Body text | `#3A3A3A` | Paragraphs, descriptions |
| Secondary text | `#55595E` | Microcopy, hints, meta labels |
| Placeholder text | `#8A8E93` | Input placeholders |
| Hairline divider | `#D9D9D4` | Horizontal rules, subtle borders |
| **Accent — Electric Red** | `#E63312` | Primary buttons, active states, totals, highlights |
| Accent hover | `#C52A0D` | Button hover state |
| Error / Warning | `#B21E00` | Error messages |
| Positive / Go | `#1E7A45` | Confirmation states |

**Rules:**
- Never use light-gray text on a white background — minimum body text is `#3A3A3A`
- White text is only used on `#111111` or `#E63312` backgrounds
- The accent red is for **one thing per screen** — the primary action or the most important number

---

## Typography

Three fonts, each with a dedicated role. All available free from [Google Fonts](https://fonts.google.com).

### Archivo — Headlines & Labels
```
font-family: 'Archivo', sans-serif;
```
| Use | Weight | Style |
|---|---|---|
| Page headline (H1) | 900 | UPPERCASE, tight tracking (`letter-spacing: -0.02em`) |
| Section labels | 700–800 | UPPERCASE, moderate tracking (`letter-spacing: 0.06em`) |
| Button text | 800 | UPPERCASE |
| Masthead wordmark | 800 | Mixed case, `em` accent in red |

### Inter — Body & UI
```
font-family: 'Inter', sans-serif;
```
| Use | Weight |
|---|---|
| Paragraphs, descriptions | 400 |
| Strong body copy, form values | 600 |
| Minimum size | 14px |

### IBM Plex Mono — Data & Numbers
```
font-family: 'IBM Plex Mono', monospace;
font-variant-numeric: tabular-nums;
```
| Use | Weight |
|---|---|
| All numeric outputs (prices, totals, distances) | 500 |
| Data labels, status chips | 600 |
| Minimum size | 11px |

**Google Fonts import (one request for all three):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Shape & Borders

- **Zero border-radius everywhere.** No rounded corners on any element.
- **Inputs:** 2px solid `#111111` border. On focus: 2px solid `#E63312`.
- **Cut-corner button:** Primary buttons use a clipped corner (bottom-right) instead of a rounded corner:
  ```css
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
  ```
- **Hairline dividers:** `1px solid #D9D9D4`
- **Section borders:** `2px solid #111111` (tab strips, table headers)

---

## Component Patterns

### Masthead / Header
```
Background:  #111111
Height:      ~60px (padding: 16px 32px)
Wordmark:    Archivo 800, white, "THE DAILY VROOM" — em/italic word in #E63312
Right side:  Secondary label in IBM Plex Mono 11px, rgba(255,255,255,0.75)
Border:      none (ink background is the border)
```

### Navigation Tabs
```
Font:           IBM Plex Mono 600, 11px, 0.08em tracking, UPPERCASE
Inactive:       color #55595E
Active:         color #111111 + 3px bottom border #E63312
Tab strip:      2px solid #111111 bottom border
Padding:        13px 20px
```

### Form Fields
```
Background:  #FFFFFF
Border:      2px solid #111111
Focus:       2px solid #E63312
Font:        Inter 400, 16px (16px on mobile prevents iOS auto-zoom)
Placeholder: #8A8E93
Min height:  44px (mobile tap target)
Labels:      Archivo 700 11px UPPERCASE, #55595E, letter-spacing 0.08em
```

### Primary Button
```
Background:  #E63312
Hover:       #C52A0D
Text:        #FFFFFF, Archivo 800, 14px UPPERCASE, letter-spacing 0.06em
Min height:  48px
Width:       100% (full-width within its container)
Cut corner:  clip-path as above
Border:      none
```

### Section Labels
```
Font:    Archivo 700–800, 11–12px, UPPERCASE, letter-spacing 0.08em
Color:   #111111
Style:   followed by a 2px solid #111 rule extending to the right edge
```

### Data / Result Rows
```
Label:    Inter 400 15px, #3A3A3A, flex: 1
Value:    IBM Plex Mono 500, 15px, #111111, tabular-nums, right-aligned
Border:   1px solid #D9D9D4 bottom
Left accent bar (optional): 3px solid #E63312 on the left edge of each row
```

### Total / Grand Total Row
```
Background:  #111111 (ink band)
Label:       Archivo 800 UPPERCASE, white
Value:       IBM Plex Mono 600, large (22–28px), #E63312
Cut corner:  same clip-path as button
```

### Status / Signal Chips
All chips: `border-radius: 0`, `font: IBM Plex Mono 700 12px uppercase`, `2px border`, `padding: 4px 10px`

| Status | Background | Text | Border |
|---|---|---|---|
| Exceptional / Go | `rgba(30,122,69,0.12)` | `#145C34` | `rgba(30,122,69,0.4)` |
| Good | `rgba(100,180,130,0.1)` | `#1E6640` | `rgba(100,180,130,0.35)` |
| Caution / Amber | `rgba(200,160,40,0.12)` | `#7A5C00` | `rgba(200,160,40,0.4)` |
| Warning | `rgba(200,100,30,0.12)` | `#7A3500` | `rgba(200,100,30,0.4)` |
| High Risk | `rgba(196,50,50,0.12)` | `#8A0000` | `rgba(196,50,50,0.4)` |

### Loading State
```
Text:  "CALCULATING" — Archivo 800 16px UPPERCASE #111111
Bar:   140px wide, 2px tall, #D9D9D4 background
       Animated sweep: 3px #E63312 line, infinite left-to-right
```

### Error Messages
```
Background:  rgba(178,30,0,0.07)
Border-left: 3px solid #B21E00
Text:        IBM Plex Mono 500 12px, #B21E00
Padding:     10px 12px
```

---

## Responsive Behavior

**Breakpoint: 560px (mobile)**
- All multi-column form grids collapse to single column
- Masthead collapses to wordmark + essential badge only
- Input font-size stays at 16px (prevents iOS zoom)
- All tap targets ≥ 44px height
- Full-width buttons remain full-width
- Data row values wrap below their labels on small screens

---

## Spacing Scale

| Token | Value | Use |
|---|---|---|
| `xs` | 6px | Between inline elements |
| `sm` | 12px | Between form fields |
| `md` | 20px | Between form sections |
| `lg` | 32px | Section padding (vertical) |
| `xl` | 56px | Hero / page-top padding |
| Max content width | 680px | All main content columns |

---

## Voice & Copy Style

- **Labels:** UPPERCASE, 2–3 words max — "THE ROUTE", "THE CAR", "YOUR RESULT"
- **Buttons:** Active verb + object — "CALCULATE TOTAL LANDED COST", "GET INSTANT SHIPPING QUOTE"
- **Body copy:** Short, plain sentences. No padding phrases. Specific over vague.
- **Numbers:** Always formatted with locale separators (e.g. `1,234.00`), currency symbol before the number, currency code after where needed

---

## What to Avoid

- ❌ Rounded corners
- ❌ Drop shadows or gradients
- ❌ Text below `#55595E` on white backgrounds
- ❌ More than one use of `#E63312` as a focal point per screen
- ❌ Italic or serif fonts (the old Playfair Display look is intentionally retired)
- ❌ Decorative dividers — if a line is there, it has a structural purpose
- ❌ Font sizes below 11px at any screen size
