# Brands Dashboard

A full-stack application for viewing and managing processed URLs and campaigns from a PostgreSQL database. Built with Vue.js, shadcn-vue components, TailwindCSS, and Express.js.

## Features

- 📊 Interactive data table displaying processed URLs with campaign information
- 🎨 Beautiful UI using shadcn-vue components and TailwindCSS
- 📱 Responsive design that works on all devices
- 🔍 Detailed side panel (Sheet) showing complete campaign and car information
- 🔗 Direct links to screenshots and original URLs
- ⚡ Fast and efficient API built with Express.js and PostgreSQL

## Project Structure

```
brands-dashboard/
├── backend/          # Express.js API server
│   ├── server.js     # Main server file with API endpoints
│   ├── db.js         # PostgreSQL connection configuration
│   └── package.json  # Backend dependencies
├── frontend/         # Vue.js application
│   ├── src/
│   │   ├── components/ui/  # shadcn-vue UI components
│   │   ├── services/       # API service layer
│   │   ├── assets/         # CSS and static assets
│   │   ├── App.vue         # Main application component
│   │   └── main.js         # Application entry point
│   └── package.json        # Frontend dependencies
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database with the required tables

## Database Setup

Your PostgreSQL database should have the following tables:

### brands table
```sql
CREATE TABLE public.brands (
    id serial NOT NULL,
    name character varying(255) NULL,
    url character varying(255) NULL,
    campaigns_slug character varying(255) NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
```

### processed_urls table
```sql
CREATE TABLE public.processed_urls (
    id serial NOT NULL,
    url character varying(255) NULL,
    result jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    modified_at timestamp without time zone NOT NULL,
    brand integer NULL,
    screenshot character varying(255) NULL,
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (id),
    FOREIGN KEY (brand) REFERENCES public.brands(id)
);
```

## Installation

### 1. Clone the repository

```bash
cd brands-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=3001
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory (optional):

```env
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## API Endpoints

### GET /api/processed-urls
Returns all active processed URLs with their associated brand information and parsed campaign data.

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "brand": "SEAT",
    "model": "Leon",
    "version": "Sportstourer 1.5 e-HYBRID 204cv",
    "recipients": "Empresas",
    "financialProduct": "Apoio ao PVP",
    "pvpCampaign": 27000,
    "monthlyFee": null,
    "dueDate": "31/12/2025",
    "modifiedAt": "2024-12-22T10:00:00.000Z",
    "createdAt": "2024-12-01T10:00:00.000Z",
    "screenshot": "https://example.com/screenshot.png",
    "active": true,
    "brandName": "SEAT",
    "brandUrl": "https://seat.com",
    "fullResult": { ... }
  }
]
```

### GET /api/processed-urls/:id
Returns a single processed URL by ID.

### GET /api/health
Health check endpoint.

## Features Explained

### Main Table View
- Displays all active processed URLs
- Columns: URL, Brand, Model, Recipients, Financial Product, Price, Due Date, Modified Date
- Clickable rows to view full details
- Price column shows PVP Campaign value or Monthly Fee based on the financial product type

### Detail Sheet (Side Panel)
Opens when clicking on any table row and displays:

1. **Car Information Card**
   - Brand, Model, Version
   - Fuel type
   - Kilometers limit

2. **Campaign Information Card**
   - Recipients
   - Financial Product type
   - Pricing details (PVP Campaign, Monthly Fees)
   - Entry fee
   - Number of monthly fees
   - Due date
   - Interest rates (TAN, TAEG)

3. **Screenshot Link**
   - Direct link to view the campaign screenshot

4. **Metadata Card**
   - Created and modified timestamps
   - Active status

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

### Backend

The backend is production-ready. Make sure to:
1. Set proper environment variables
2. Use a process manager like PM2 for running the server
3. Set up proper error logging
4. Configure CORS for your production domain

## Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **TailwindCSS** - Utility-first CSS framework
- **shadcn-vue** - High-quality UI components based on Radix Vue
- **Axios** - HTTP client for API requests
- **Lucide Icons** - Beautiful icon library

### Backend
- **Express.js** - Fast, minimalist web framework
- **PostgreSQL (pg)** - PostgreSQL client for Node.js
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## Customization

### Adding More Table Columns
Edit `frontend/src/App.vue` and add columns in the `<TableHeader>` and corresponding `<TableCell>` sections.

### Modifying the Sheet Layout
Edit the detail cards in the Sheet section of `frontend/src/App.vue`.

### Styling
- Global styles: `frontend/src/assets/index.css`
- TailwindCSS configuration: `frontend/tailwind.config.js`
- Component-specific styles: Use Tailwind utility classes in component templates

## Troubleshooting

### Backend not connecting to database
- Verify your `.env` file has correct database credentials
- Ensure PostgreSQL is running
- Check if the database and tables exist

### CORS errors
- Make sure the backend server is running on port 3001
- Check that CORS is enabled in `backend/server.js`

### Frontend not loading data
- Verify the backend is running
- Check browser console for errors
- Ensure the API URL is correct in the frontend `.env` file

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
