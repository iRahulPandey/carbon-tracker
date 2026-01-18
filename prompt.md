## ACT AS:
A Senior Full-Stack Developer (Awwwards-level) specializing in Next.js, TypeScript, Framer Motion, and modern UI/UX design with expertise in creating clean, minimal, performant web applications.

---

## THE TASK:
Build a minimal, elegant web application that allows users to check the carbon footprint of any website by entering a URL. The app should display real-time CO2 emissions data, relatable equivalents (to help users understand the environmental impact), and use the Website Carbon API to calculate emissions based on data transfer and energy consumption.

---

## TECH STACK:
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Mode)
- **Components:** Shadcn UI (or similar modern library) for clean UI elements
- **Animation:** Framer Motion
- **API:** Website Carbon API (https://api.websitecarbon.com)
- **HTTP Client:** Native Fetch API
- **Icons:** Lucide React

---

## API REFERENCE & UNDERSTANDING

### Base URL:
```
https://api.websitecarbon.com
```

### Important Note:
As of July 14, 2025, the public `/site` endpoint is **no longer available**. The only public endpoint is `/data` which requires manual calculation of bytes transferred.

### Available Public Endpoint:

#### `/data` - Calculate emissions from bytes
```
GET /data?bytes={bytes}&green={0|1}
```

**Parameters:**
- `bytes` (required): Number of bytes transferred by the page on load
- `green` (required): Whether the site uses green hosting (1 = yes, 0 = no)

**Example Request:**
```
https://api.websitecarbon.com/data?bytes=1234567&green=1
```

**Example Response:**
```json
{
  "bytes": 1234567,
  "green": true,
  "gco2e": 0.105,
  "rating": "B",
  "statistics": {
    "adjustedBytes": 932098.689,
    "energy": 0.00260425,
    "co2": {
      "grid": {
        "grams": 1.286,
        "litres": 0.715
      },
      "renewable": {
        "grams": 1.050,
        "litres": 0.584
      }
    }
  },
  "cleanerThan": 0.73
}
```

### Response Fields Explained:

- **bytes**: The number of bytes you passed to the endpoint
- **green**: The green hosting flag (true/false)
- **gco2e**: CO2 emissions in grams per page view
- **rating**: Digital Carbon Rating (A+ to F scale)
  - A+: Extremely efficient
  - A-E: Better than global average
  - F: Exceeds global average
- **statistics**: Detailed breakdown
  - `adjustedBytes`: Bytes after accounting for caching and compression
  - `energy`: Energy consumed in kWh
  - `co2.grid.grams`: CO2 if using standard grid electricity
  - `co2.renewable.grams`: CO2 if using renewable energy
- **cleanerThan**: Percentage (0-1) of websites this result is cleaner than

### Implementation Strategy:

Since the `/site` endpoint is no longer public, we need to:
1. Accept a URL from the user
2. Use a client-side method to estimate page size (or provide a manual input option)
3. Call the `/data` endpoint with the estimated bytes
4. Display the results with equivalents

**Alternative Approach (Recommended):**
- Provide an input for users to enter the page size in KB/MB manually
- Or use browser APIs to fetch the URL and calculate transfer size on the client
- Then call the `/data` API with calculated bytes

---

## DESIGN & UX REQUIREMENTS

### Visual Style:
- **Minimal & Clean:** Inspired by websitecarbon.com's simple interface
- **Dark Mode:** Default dark theme with smooth transitions
- **Typography:** Clean sans-serif (Inter or Geist Sans from next/font)
- **Global Background:** Dark (#0a0a0a or #121212) for modern aesthetic
- **Color Palette:**
  - A+ Rating: Deep Green (#059669)
  - A-E Ratings: Gradient from green to yellow (#84cc16 to #eab308)
  - F Rating: Red (#ef4444)
  - Accent: Eco-friendly green (#10b981)
- **Animations:** Smooth transitions using Framer Motion
  - Fade-in on mount
  - Slide-up for results card
  - Number counter animation for CO2 value
  - Stagger children for equivalents list
  - Micro-interactions on hover

### Layout:

1. **Hero Section:**
   - Title with gradient text: "Calculate Your Website's Carbon Footprint"
   - Subtitle: "Every website produces CO2. Find out how much yours generates and how to reduce it."
   - Large URL input field (centered, glassmorphism effect)
   - Optional: Toggle for "Green Hosting" checkbox
   - Submit button with hover animation
   - **Framer Motion:** Fade in from top on page load

2. **Results Section (conditionally rendered after calculation):**
   - **Framer Motion:** Slide up from bottom with spring animation
   
   - **Main Card (Glassmorphism styling):**
     - Large CO2 value display with animated counter (e.g., "0.52g CO2")
     - Digital Carbon Rating badge (A+ to F) with color coding
     - "Cleaner than X% of websites tested" statistic
     - Bytes transferred display
     - Green hosting indicator (checkmark or X icon)
   
   - **Environmental Impact Section:**
     - **Framer Motion:** Stagger children animation
     - Show 3-4 relatable comparisons:
       - Trees needed to absorb annual emissions
       - Equivalent car miles driven
       - Phone charges equivalent
       - Cups of tea boiled
     - Use lucide-react icons for visual engagement
     - Each item with subtle hover scale effect

   - **Energy Breakdown (Optional):**
     - Simple visualization showing:
       - Data center energy
       - Network transmission energy
       - End-user device energy
     - Animated progress bars with Framer Motion

   - **Recommendations Section:**
     - Quick tips to reduce emissions:
       - "Optimize images"
       - "Use green hosting"
       - "Minimize JavaScript"
       - "Enable caching"
     - Each with an icon and brief description

3. **Statistics Banner:**
   - Global average: "Average website produces 0.5g CO2 per view"
   - Show how user's result compares

4. **Footer:**
   - Credit to Website Carbon API and Wholegrain Digital
   - Link to methodology (Sustainable Web Design Model V4)
   - Disclaimer about estimates

---

## IMPLEMENTATION BLUEPRINT

### Directory Structure:
```
app/
├── page.tsx (Main landing page)
├── layout.tsx (Root layout with dark mode)
├── globals.css (Tailwind imports)
└── components/
    ├── UrlInputForm.tsx
    ├── ResultsCard.tsx
    ├── CarbonDisplay.tsx
    ├── RatingBadge.tsx
    ├── EquivalentsSection.tsx
    ├── RecommendationsSection.tsx
    └── EnergyBreakdown.tsx (Optional)
lib/
├── api.ts (API functions)
├── utils.ts (Equivalents calculation, formatting)
└── types.ts (TypeScript interfaces)
```

### Core Types:
```typescript
// lib/types.ts
interface CarbonData {
  bytes: number;
  green: boolean;
  gco2e: number;
  rating: string;
  statistics: {
    adjustedBytes: number;
    energy: number;
    co2: {
      grid: { grams: number; litres: number };
      renewable: { grams: number; litres: number };
    };
  };
  cleanerThan: number;
}
```

### Core Logic:

#### 1. URL Validation & Page Size Estimation:
```typescript
// Since /site endpoint is deprecated, we need to estimate page size
// Option 1: Manual input
// Option 2: Client-side fetch with size calculation

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// For client-side estimation (simplified)
const estimatePageSize = async (url: string): Promise<number> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : 500000; // Default 500KB
  } catch {
    return 500000; // Default estimate
  }
};
```

#### 2. API Call:
```typescript
// lib/api.ts
export const calculateCarbon = async (
  bytes: number,
  isGreen: boolean
): Promise<CarbonData> => {
  const green = isGreen ? 1 : 0;
  const response = await fetch(
    `https://api.websitecarbon.com/data?bytes=${bytes}&green=${green}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to calculate carbon emissions');
  }
  
  return await response.json();
};
```

#### 3. Framer Motion Animations:
```typescript
// Example for Results Card
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
  className="glassmorphism-card"
>
  {/* Results content */}
</motion.div>

// Animated counter for CO2 value
import { useSpring, animated } from 'framer-motion';

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30
  });
  
  return <animated.span>{spring}</animated.span>;
};

// Stagger children for equivalents
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};
```

#### 4. Error Handling:
- Invalid URL format
- API errors (400, 500)
- Network errors
- Show user-friendly error messages with toast notifications

#### 5. Equivalents Calculation:
```typescript
// lib/utils.ts
export const getEnvironmentalEquivalents = (gCO2: number, bytes: number) => {
  // Assuming 10,000 monthly page views
  const monthlyViews = 10000;
  const annualCO2Kg = (gCO2 * monthlyViews * 12) / 1000;
  
  return {
    trees: {
      value: Math.round(annualCO2Kg / 21), // 1 tree absorbs ~21kg CO2/year
      label: "trees needed to absorb annual CO2"
    },
    carMiles: {
      value: Math.round(gCO2 / 404 * 1000), // 404g CO2 per mile (average car)
      label: "miles driven in an average car"
    },
    phoneCharges: {
      value: Math.round(gCO2 / 8), // ~8g CO2 per phone charge
      label: "smartphone charges"
    },
    teaCups: {
      value: Math.round(gCO2 / 71), // ~71g CO2 to boil kettle for 1 cup
      label: "cups of tea boiled"
    },
    dataSize: {
      value: (bytes / 1024 / 1024).toFixed(2), // Convert to MB
      label: "MB of data transferred"
    }
  };
};

export const getRatingColor = (rating: string): string => {
  if (rating === 'A+') return 'text-green-500';
  if (['A', 'B', 'C', 'D', 'E'].includes(rating)) return 'text-yellow-500';
  return 'text-red-500'; // F rating
};
```

---

## EXECUTION RULES

1. **Next.js 14 App Router:**
   - Use Server Components where possible
   - Client Components for interactive elements (use 'use client')
   - Proper metadata setup in layout.tsx
   - Font optimization with next/font

2. **Framer Motion Integration:**
   - Spring animations for natural feel
   - Stagger animations for lists
   - Number counter animation for CO2 display
   - Micro-interactions on hover and tap
   - Layout animations for smooth transitions

3. **Styling with Tailwind:**
   - Dark mode as default (dark:bg-zinc-900, dark:text-white)
   - Glassmorphism: backdrop-blur-lg, bg-white/10, border border-white/20
   - Gradient text for title: bg-gradient-to-r from-green-400 to-emerald-600
   - Use only Tailwind core utility classes
   - Responsive: sm, md, lg, xl breakpoints

4. **Shadcn UI Components:**
   - Button, Card, Badge, Input, Label
   - Toast for notifications
   - Maintain consistent design system

5. **Performance:**
   - No localStorage or sessionStorage
   - Show loading states with skeleton loaders
   - Debounce input if adding auto-calculation
   - Error boundaries for graceful failures

6. **Accessibility:**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Focus states visible
   - Color contrast WCAG AA compliant

7. **User Experience:**
   - Clear loading indicators
   - Informative error messages
   - Example URLs as placeholder
   - Mobile-first responsive design
   - Smooth 60fps animations

8. **Code Quality:**
   - TypeScript strict mode
   - Modular components
   - Clear naming conventions
   - Comments for complex calculations
   - Type definitions in lib/types.ts

---

## USER INPUT OPTIONS

Since the `/site` endpoint is deprecated, provide users with:

**Option 1: URL + Manual Page Size**
- Input field for URL
- Input field for page size (in KB or MB)
- Checkbox for "Is this site using green hosting?"

**Option 2: URL + Automatic Estimation (Client-side)**
- Input field for URL
- Fetch the page client-side and calculate transfer size
- Detect if possible: green hosting via external check
- Note: This may have CORS limitations

**Option 3: Just Bytes Input (Simplest)**
- Input field: "Page size in bytes"
- Checkbox: "Green hosting"
- Calculate button
- Most reliable with current API

**Recommended:** Start with Option 3 (simplest) and add Option 1 later for better UX.

---

## EXAMPLE USER FLOW

1. User lands on page with dark, clean interface
2. Sees title "Calculate Your Website's Carbon Footprint"
3. Enters page size: "500000" bytes (or 500KB)
4. Checks/unchecks "Green Hosting" toggle
5. Clicks "Calculate Carbon Footprint" button
6. Loading animation appears (animated spinner with Framer Motion)
7. Results card slides up showing:
   - **"0.52g CO2"** (large, animated counter)
   - **Rating Badge: "B"** (green colored)
   - **"Cleaner than 73% of websites"**
   - **Equivalents:**
     - "12 trees needed to absorb annual CO2"
     - "Equivalent to driving 1.3 miles"
     - "Like charging your phone 65 times"
   - **Recommendations:**
     - "✓ Great! You're using green hosting"
     - "Consider optimizing images further"
     - "Enable browser caching"
8. User can calculate another website

---

## OPTIONAL ENHANCEMENTS

1. **URL Fetching Service:**
   - Create a simple serverless function to fetch page size
   - Bypass CORS issues
   - Return bytes + green hosting detection

2. **History:**
   - Store recent calculations in component state
   - Show comparison between tests
   - "Test again" button

3. **Sharing:**
   - Generate shareable result card image
   - Social media share buttons
   - Copy result to clipboard

4. **Detailed Breakdown:**
   - Expandable section showing:
     - Data center emissions
     - Network transmission emissions
     - End-user device emissions
   - Animated pie chart with recharts

5. **Badge Generator:**
   - Allow users to generate an embeddable badge
   - Shows live carbon rating on their site
   - Auto-updates via API

6. **Comparison Tool:**
   - Compare multiple URLs side-by-side
   - Show industry averages
   - Leaderboard of efficient sites

---

## REFERENCE WEBSITES

- https://www.websitecarbon.com/ (Main inspiration)
  - Clean, minimal design
  - Clear value proposition
  - Simple input → results flow
  - Effective use of comparisons

---

## DELIVERABLE CHECKLIST

- [ ] Functional page size input (bytes or KB/MB)
- [ ] Green hosting toggle
- [ ] Live API integration with /data endpoint
- [ ] CO2 value display with animated counter
- [ ] Digital Carbon Rating badge (A+ to F)
- [ ] At least 3 environmental equivalents
- [ ] Recommendations section
- [ ] Error handling for invalid inputs
- [ ] Responsive design (mobile + desktop)
- [ ] Loading states with animations
- [ ] Accessible markup
- [ ] Clean TypeScript code
- [ ] Tailwind dark mode styling
- [ ] Framer Motion animations throughout

---

## START:

Begin by scaffolding the Next.js 14 app directory structure with TypeScript. Set up the root layout.tsx with dark mode configuration, Inter font from next/font, and global styles. Create the main page.tsx with the hero section and title.

Then build the UrlInputForm component (or BytesInputForm for simplicity) with:
- Input for bytes/page size
- Green hosting checkbox
- Submit button
- Form validation
- API integration

Next, create the ResultsCard component with:
- Animated reveal (slide up + fade in)
- CarbonDisplay component showing animated CO2 value
- RatingBadge with color coding
- EquivalentsSection with staggered animations
- RecommendationsSection with icons

Use Shadcn UI components (Button, Input, Card, Badge) for consistent styling. Implement all Framer Motion animations for smooth, engaging interactions. Focus on making the core calculation flow work perfectly before adding optional enhancements.