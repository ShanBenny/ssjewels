# Design Guidelines for SS Imitation Jewels & Traditional Wear

## Design Approach: Reference-Based (E-Commerce Luxury)

**Primary References:** Etsy (authentic handmade feel), Shopify fashion stores (clean product grids), Indian jewelry e-commerce leaders (Tanishq, CaratLane)

**Design Philosophy:** Create an elegant, trustworthy shopping experience that elevates imitation jewelry to feel premium and traditional. Balance rich cultural aesthetics with modern e-commerce usability.

---

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- Deep Burgundy: 350 65% 25% (primary brand color - evokes richness and tradition)
- Warm Gold: 45 85% 55% (accent for highlights, borders, icons - traditional jewelry feel)
- Cream White: 40 20% 97% (background, cards)

**Supporting Colors:**
- Charcoal: 220 15% 20% (text, headers)
- Soft Grey: 220 10% 60% (secondary text)
- Success Green: 142 70% 45% (in-stock indicators)
- Alert Red: 0 70% 50% (out-of-stock, sale tags)

**Dark Mode:**
- Rich Black: 220 20% 10% (background)
- Dark Burgundy: 350 50% 15% (cards, surfaces)
- Muted Gold: 45 60% 50% (accents maintain warmth)

### B. Typography

**Font Families:**
- Headlines: 'Playfair Display' (serif, elegant, traditional)
- Body: 'Inter' (clean, modern readability)
- Accent/Prices: 'Poppins' (medium weight for emphasis)

**Type Scale:**
- Hero Headline: text-5xl md:text-7xl font-bold
- Section Headers: text-3xl md:text-4xl font-semibold
- Product Titles: text-xl font-medium
- Body: text-base leading-relaxed
- Captions/Meta: text-sm text-gray-600

### C. Layout System

**Spacing Units:** Use Tailwind spacing of 4, 6, 8, 12, 16, 20, 24 units
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-4

**Grid System:**
- Product Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Category Tiles: grid-cols-2 md:grid-cols-3 lg:grid-cols-6
- Featured Products: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Navigation:**
- Sticky top navigation with logo, category mega-menu, search, wishlist icon, cart icon, user menu
- Bottom navigation for mobile with Home, Categories, Wishlist, Cart, Profile
- Breadcrumbs for product pages

**Product Cards:**
- 3:4 aspect ratio image with subtle hover zoom
- Wishlist heart icon (top-right absolute)
- Product name, category tag
- Price with original price strikethrough if on sale
- Stock indicator badge (green dot + "In Stock" / red "Out of Stock")
- Quick "Add to Cart" button on hover (desktop)

**Buttons:**
- Primary CTA: bg-burgundy text-white rounded-lg px-6 py-3
- Secondary: border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white
- Icon buttons: Gold accent color with burgundy on hover
- Outline on images: backdrop-blur-md bg-white/10 border border-white/20

**Forms:**
- Clean input fields with gold focus ring
- Label above input styling
- Error states in red with helper text
- Checkbox/radio with gold accent

**Cart & Checkout:**
- Line item cards with thumbnail, quantity selector, remove option
- Sticky order summary card (desktop) or bottom bar (mobile)
- Progress stepper for checkout flow

**Admin Dashboard:**
- Sidebar navigation with icon + label
- Data tables with search, filters, pagination
- Modal forms for add/edit products
- Image upload with preview

### E. Images Strategy

**Hero Section:**
- Full-width banner showcasing jewelry collections (1920x800px)
- Overlay with translucent burgundy gradient for text readability
- Call-to-action with "Shop Collections" button

**Product Images:**
- High-quality jewelry photography on neutral backgrounds
- Multiple angles in product detail view with thumbnail gallery
- Zoom on hover/tap functionality
- Lifestyle images showing jewelry worn (optional secondary images)

**Category Tiles:**
- Styled product photography for each category
- Circular or hexagonal crop for traditional aesthetic
- Gold border accent on hover

**Additional Images:**
- Trust badges/payment icons in footer
- Customer review avatars (if testimonials added)
- Empty state illustrations for cart/wishlist

**Image Placements:**
- Hero: Large banner with model wearing jewelry collection
- Categories: 6 circular category images in grid
- Products: 3:4 ratio product shots
- About/Story: Craftmanship images showing tradition

### F. Unique E-Commerce Elements

**Product Filters:**
- Sidebar with category, price range slider, material, occasion filters
- Active filter chips with remove option
- Sort dropdown: Featured, Price Low-High, New Arrivals

**Trust Indicators:**
- "100% Quality Checked" badge
- "Free Shipping Over ₹500" banner
- Customer review stars on products
- Secure payment icons

**Promotional Elements:**
- Sale ribbon/tag on product cards (top-left, red)
- "New Arrival" badge (gold)
- Homepage promotional banner carousel

**Mobile Considerations:**
- Swipeable product image galleries
- Bottom sheet for filters (mobile)
- Floating "Add to Cart" button (product detail)
- Hamburger menu with category accordion

### G. Animations

**Minimal & Purposeful:**
- Card hover lift (translate-y-1 shadow-lg)
- Image zoom on hover (scale-105)
- Smooth cart item add animation (slide-in)
- Category tile scale on tap/hover (scale-102)
- Page transitions: Fade-in only, no complex animations

---

## Admin Dashboard Styling

- Clean, data-focused interface using same color palette
- Table-heavy layouts with burgundy header rows
- Action buttons: Edit (gold), Delete (red), Add New (burgundy)
- Upload zone with dashed border and gold accent
- Status badges: Processing (yellow), Shipped (blue), Delivered (green), Cancelled (red)

---

**Design Principles:** Elegance over flashiness, clarity in product presentation, trust-building through traditional aesthetics, seamless mobile shopping experience, premium feel despite imitation jewelry positioning.