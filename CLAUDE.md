# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Express.js + PostgreSQL)
- **Development**: `cd backend && npm run dev` (uses nodemon for hot reload)
- **Production**: `cd backend && npm start`
- **Dependencies**: `cd backend && npm install`

### Frontend (Vue 3 + Vite)
- **Development**: `cd frontend && npm run dev` (runs on http://localhost:5173)
- **Production Build**: `cd frontend && npm run build` (outputs to `frontend/dist/`)
- **Preview Build**: `cd frontend && npm run preview`
- **Dependencies**: `cd frontend && npm install`

### Database Requirements
- PostgreSQL with tables: `brands` and `processed_urls`
- Backend requires `.env` file with database credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)

## Architecture Overview

This is a full-stack dashboard application for visualizing campaign data from PostgreSQL:

### Backend Architecture (`backend/`)
- **Entry Point**: `server.js` - Express server with REST API
- **Database**: `db.js` - PostgreSQL connection pool configuration
- **Main API**: `/api/processed-urls` - transforms JSONB `result` field into flat structure
- **Data Flow**: PostgreSQL JSONB → Express transformation → JSON API response

### Frontend Architecture (`frontend/`)
- **Framework**: Vue 3 with Composition API
- **UI Library**: shadcn-vue components (based on Radix Vue)
- **Styling**: TailwindCSS with custom design system
- **Entry Point**: `src/main.js`
- **Main Component**: `src/App.vue` - contains table view and detail sheet
- **UI Components**: `src/components/ui/` - reusable shadcn-vue components

### Key Design Patterns
- **Data Transformation**: Backend flattens complex JSONB into simple key-value pairs for frontend consumption
- **Component Composition**: Uses Vue 3 Composition API for state management
- **Progressive Enhancement**: Table view with expandable detail sheet for complete record information
- **Utility-First CSS**: TailwindCSS classes with custom CSS variables for theming

### Data Structure
The `processed_urls.result` JSONB field contains nested campaign data that gets transformed into flat structure:
- `result.car.brand/model/version` → `brand/model/version` fields
- `result.campaign.*` → campaign-related fields (recipients, financial_product, pvp_campaign, etc.)

### Styling System
- **Theme**: Dark theme optimized for data viewing
- **Typography**: IBM Plex Sans (body), IBM Plex Mono (data), DM Serif Display (headings)
- **Colors**: Deep dark background with cyan accents
- **Layout**: Card-based sections with slide-in detail panel

### Environment Configuration
- Backend: Requires `.env` file with database credentials
- Frontend: Optional `.env` for API URL override (defaults to /api)

## Vercel Deployment

This project is configured as a monorepo for Vercel deployment:

### Structure
- `frontend/` - Vue 3 SPA (builds to `frontend/dist/`)
- `api/` - Vercel Serverless Functions (PostgreSQL API endpoints)
- `backend/` - Express server (for local development only)

### Serverless Functions (`api/`)
- `api/processed-urls/index.js` - GET all processed URLs
- `api/processed-urls/[id].js` - GET single processed URL by ID
- `api/processed-urls/export/csv.js` - Export data as CSV
- `api/health.js` - Health check endpoint
- `api/_lib/db.js` - Shared database connection pool

### Vercel Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_SSL` - Set to "true" for SSL connections

### Deployment
1. Connect repository to Vercel
2. Set environment variables in Vercel Dashboard
3. Deploy (Vercel auto-detects `vercel.json` configuration)

## Key Files to Understand
- `backend/server.js:35-59` - Data transformation logic for API responses
- `frontend/src/App.vue` - Complete dashboard interface with table and sheet
- `frontend/src/assets/index.css` - Custom theme and styling variables
- `backend/db.js` - Database connection configuration