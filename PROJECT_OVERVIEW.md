# Brands Dashboard - Project Overview

## What You've Got

A complete, production-ready Vue 3 application for visualizing your PostgreSQL campaign data with:

✅ **Modern Tech Stack**
- Vue 3 with Composition API
- shadcn-vue UI components (based on Radix Vue)
- TailwindCSS with custom design system
- Node.js/Express backend with PostgreSQL

✅ **Key Features**
- Data table with campaign records
- Side sheet for detailed view
- Real-time database connection
- Dark theme optimized for data viewing
- Responsive design

✅ **Complete Project Structure**
```
brands-dashboard/
├── backend/          ← Express server + PostgreSQL
├── frontend/         ← Vue 3 + shadcn + TailwindCSS
├── README.md         ← Comprehensive documentation
├── QUICKSTART.md     ← Quick setup guide
├── setup.sh          ← Automated setup script
└── .gitignore        ← Git configuration
```

## Design Philosophy

The interface uses a **distinctive data-focused aesthetic**:

- **Typography**: IBM Plex Sans (professional sans-serif), IBM Plex Mono (for data/code), DM Serif Display (elegant headings)
- **Color Palette**: Deep dark background (HSL 220 15% 7%) with cyan accents (HSL 195 100% 65%)
- **Visual Hierarchy**: Clear separation of data sections with subtle borders and cards
- **Motion**: Smooth slide-in animations for the side sheet, fade-in for loading states

## What It Looks Like

### Main Table View
```
┌─────────────────────────────────────────────────────────────────┐
│ Brands Dashboard                          120 campaigns          │
│ Campaign tracking and analysis interface                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  URL         Brand  Model  Recipients  Product      Amount      │
│  ────────────────────────────────────────────────────────────── │
│  🔗 url1     SEAT   Leon   Empresas    Apoio PVP   €27,000     │
│  🔗 url2     VW     Golf   Empresas    Mensalidade €350        │
│  ...                                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Detail Side Sheet (slides in from right)
```
                    ┌────────────────────────────────────┐
                    │ ✕                                  │
                    │ Campaign Details                   │
                    │ Record #42                         │
                    ├────────────────────────────────────┤
                    │                                    │
                    │ 🔗 SOURCE URL                      │
                    │ https://example.com/campaign       │
                    │                                    │
                    │ 🚗 VEHICLE INFORMATION             │
                    │ ┌──────────────┬──────────────┐   │
                    │ │ Brand        │ Model        │   │
                    │ │ SEAT         │ Leon         │   │
                    │ └──────────────┴──────────────┘   │
                    │                                    │
                    │ 📈 CAMPAIGN DETAILS                │
                    │ ┌──────────────────────────────┐  │
                    │ │ Financial Product            │  │
                    │ │ [Apoio ao PVP]              │  │
                    │ │                              │  │
                    │ │ Amount: €27,000             │  │
                    │ └──────────────────────────────┘  │
                    │                                    │
                    │ 🎯 SCREENSHOT                      │
                    │ [View Screenshot →]               │
                    │                                    │
                    └────────────────────────────────────┘
```

## Data Flow

```
PostgreSQL Database
        ↓
   Express API (http://localhost:3001)
   ├─ GET /api/processed-urls (transforms JSONB to flat structure)
   ├─ GET /api/processed-urls/:id
   └─ GET /api/brands
        ↓
   Vue Frontend (http://localhost:5173)
   ├─ Dashboard.vue (main table)
   └─ Sheet components (detail view)
```

## Key Components

### Backend (`backend/server.js`)
- Connects to PostgreSQL using connection pool
- Transforms JSONB `result` field into flat structure
- Joins `processed_urls` with `brands` table
- Returns only active records (`active = true`)

### Frontend Components
1. **Dashboard.vue**: Main component with table and sheet state
2. **Sheet**: Base dialog component from shadcn-vue
3. **SheetContent**: Side panel with slide-in animation
4. **Button**: Styled button component
5. **Custom CSS**: Dark theme with data-focused styling

## Customization Points

### Colors
Edit `frontend/src/assets/index.css`:
```css
:root {
  --primary: 195 100% 65%;  /* Cyan accent */
  --background: 220 15% 7%; /* Dark background */
  /* ... more variables */
}
```

### Fonts
Edit `frontend/tailwind.config.js`:
```js
fontFamily: {
  sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
  display: ['DM Serif Display', 'serif'],
}
```

### Table Columns
Edit `frontend/src/components/Dashboard.vue`:
- Add/remove `<th>` elements in table header
- Add/remove `<td>` elements in table body
- Update data transformation in backend if needed

### Detail Sections
Add new sections in the Sheet content area of `Dashboard.vue`:
```vue
<div class="metric-card">
  <div class="section-label">New Section</div>
  <!-- Your content -->
</div>
```

## Next Steps

1. **Setup**: Run `./setup.sh` or follow manual setup in QUICKSTART.md
2. **Configure**: Edit `backend/.env` with your database credentials
3. **Customize**: Adjust colors, fonts, or add new features
4. **Deploy**: Build for production and deploy to your server

## Support Files Included

- **README.md**: Full documentation with API reference
- **QUICKSTART.md**: Step-by-step setup guide
- **setup.sh**: Automated installation script
- **.gitignore**: Ready for version control
- **.env.example**: Template for environment variables

## Technology Highlights

This project demonstrates modern web development patterns:
- **Composition API**: Vue 3's recommended API for better logic reuse
- **Component Isolation**: shadcn philosophy - components are yours to modify
- **Utility-First CSS**: TailwindCSS for rapid styling
- **Type Safety**: Clear prop definitions in Vue components
- **Performance**: Connection pooling, optimized queries, lazy loading

The design intentionally avoids "AI slop" aesthetics by using:
- Distinctive typography (not Inter/Roboto/Arial)
- Purpose-built color scheme (not purple gradients)
- Data-focused interface patterns
- Thoughtful micro-interactions

Enjoy building with your new dashboard! 🚀
