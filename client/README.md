# Japanese Property Listing System

A full-stack application for searching and listing Japanese real estate properties. This system includes a PostgreSQL database, Node.js/Express backend, and React frontend.

## Project Structure

```
project-root/
├── api/
│   └── propertyRoutes.js         # API routes for property data
├── components/
│   └── PropertySearch.jsx        # React component for property search
├── contexts/
│   └── (Context files)
├── data/
│   ├── properties.js             # Sample property data
│   ├── propertyModel.js          # Data model for property operations
│   └── property_schema.sql       # SQL schema for property database
├── images/
│   └── (Property images)
├── utils/
│   ├── db.js                     # Database connection configuration
│   └── setupDatabase.js          # Database initialization script
├── server.js                     # Main server file
├── .env                          # Environment variables
└── README.md                     # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database:

```bash
createdb property_database
```

2. Configure database connection:
   
   Edit the `.env` file and update the database credentials:

```
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=property_database
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

The database will be automatically initialized when starting the server, but you can also run it manually:

```bash
node utils/setupDatabase.js
```

### 4. Start the Server

```bash
npm start
```

The server will run on http://localhost:3000 (or the port specified in your .env file).

## API Endpoints

### Properties

- `GET /api/properties` - Get all properties (with optional filtering)
- `GET /api/properties/:id` - Get a specific property by ID
- `POST /api/properties` - Create a new property
- `PUT /api/properties/:id` - Update a property
- `DELETE /api/properties/:id` - Delete a property

### Filter Options

- `GET /api/layouts` - Get all available layouts
- `GET /api/property-types` - Get all available property types

## Frontend Features

The PropertySearch component provides a user interface with the following features:

- Advanced search with multiple filter criteria
- Property listings with details
- Interactive map display
- Detailed property view with images and specifications

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: React, Leaflet (for maps)
- **Styling**: TailwindCSS

## Environment Variables

The following environment variables can be configured in the `.env` file:

- `DB_USER` - PostgreSQL username
- `DB_HOST` - Database host (default: localhost)
- `DB_NAME` - Database name (default: property_database)
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port (default: 5432)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret for JWT tokens (if authentication is implemented)
- `MAPBOX_API_KEY` - API key for Mapbox (if used)
- `GOOGLE_MAPS_API_KEY` - API key for Google Maps (if used)
- `CORS_ORIGIN` - Allowed CORS origin

CREATE USER real_estate_user WITH PASSWORD 'Zhao@2025!';
CREATE DATABASE real_estate_db;
GRANT ALL PRIVILEGES ON DATABASE real_estate_db TO real_estate_user;

GRANT ALL ON SCHEMA public TO real_estate_user;

## License

MIT