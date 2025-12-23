# Quick Start Guide

## 1. Database Setup
Ensure your PostgreSQL database has the required tables:

```sql
-- Create brands table
CREATE TABLE public.brands (
    id serial NOT NULL PRIMARY KEY,
    name character varying(255) NULL,
    url character varying(255) NULL,
    campaigns_slug character varying(255) NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Create processed_urls table
CREATE TABLE public.processed_urls (
    id serial NOT NULL PRIMARY KEY,
    url character varying(255) NULL,
    result jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    modified_at timestamp without time zone NOT NULL,
    brand integer NULL REFERENCES public.brands(id),
    screenshot character varying(255) NULL,
    active boolean NOT NULL DEFAULT true
);
```

## 2. Automated Setup
Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

## 3. Configure Database
Edit `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=3001
```

## 4. Start Backend
```bash
cd backend
npm start
```

## 5. Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

## 6. Access the Application
Open your browser to: http://localhost:5173

## Manual Setup (if setup.sh doesn't work)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `backend/.env`
- Check database exists: `psql -l`

### "Port 3001 already in use"
- Change PORT in `backend/.env`
- Kill existing process: `lsof -ti:3001 | xargs kill -9`

### "Port 5173 already in use"
- Vite will automatically try the next available port
- Or specify a different port in `vite.config.js`

### Frontend shows no data
- Check backend is running on http://localhost:3001
- Check browser console for errors
- Verify database has records with `active = true`

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh in browser
- Backend: Use `npm run dev` with nodemon

### Database Changes
After changing database schema:
1. Update backend/server.js query transformations
2. Update frontend/src/components/Dashboard.vue display logic

### Styling Changes
Edit `frontend/src/assets/index.css` for theme changes.
TailwindCSS classes can be used directly in Vue components.

## Production Build

### Frontend
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

### Backend
Set environment variables and use a process manager:
```bash
NODE_ENV=production pm2 start backend/server.js
```
