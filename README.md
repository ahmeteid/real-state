# Real State - React Application

A real estate website built with React and Vite, featuring property listings for sale, rentals, and car sales.

## Features

- 🏠 Property listings for sale
- 🏘️ Rental property listings
- 🚗 Car sales listings
- 📧 Contact form
- ℹ️ About page
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run two servers:

1. **Start JSON Server** (for API data):
```bash
npm run server
```
This will start JSON Server on `http://localhost:3001`

2. **Start the React development server** (in a new terminal):
```bash
npm run dev
```
This will start the Vite dev server, typically on `http://localhost:5173`

### Data Structure

All data is stored in `data/db.json` with the following endpoints:
- `/propertiesForSale` - Properties available for purchase
- `/propertiesForRent` - Properties available for rent
- `/cars` - Vehicles for sale

### Available Scripts

- `npm run dev` - Start the React development server
- `npm run server` - Start JSON Server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
real-state/
├── data/
│   └── db.json          # JSON Server database
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── style/           # CSS modules
│   └── App.jsx          # Main app component
└── package.json
```

## Technologies Used

- React 19
- React Router DOM
- Vite
- JSON Server
- React Icons
- CSS Modules

## Notes

- Make sure JSON Server is running before using the application
- The API runs on port 3001 by default
- Data can be modified directly in `data/db.json`
