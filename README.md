# Real State - React Application

A comprehensive real estate website built with React and Vite, featuring property listings for sale, rentals, and car sales with multi-language support and an admin dashboard.

## 🌟 Features

### Core Features

- 🏠 **Property Listings for Sale** - Browse and view properties available for purchase
- 🏘️ **Rental Property Listings** - Find properties available for rent
- 🚗 **Car Sales Listings** - Browse vehicles for sale
- 📧 **Contact Form** - Integrated contact form with Web3Forms
- ℹ️ **About Page** - Company information and statistics
- 📱 **Fully Responsive Design** - Works seamlessly on all devices

### Advanced Features

- 🌍 **Multi-Language Support** - Available in English, Turkish, and Arabic
- 🖼️ **Multiple Image Support** - Upload and display multiple images per listing
- 🎠 **Image Carousel** - Interactive image carousel with navigation controls
- 🎛️ **Admin Dashboard** - Complete CRUD operations for managing listings
- 📤 **File Upload** - Upload images directly from your device
- 🔄 **RTL Support** - Automatic right-to-left layout for Arabic
- 💾 **Local Storage** - Data persistence using localStorage
- 🎨 **Modern UI/UX** - Beautiful, modern design with smooth animations

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository** (or navigate to the project directory):

```bash
cd real-state
```

2. **Install dependencies**:

```bash
npm install
```

### Running the Application

The application uses localStorage for data storage, so you don't need to run a separate JSON server. Simply start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on `http://localhost:5173`

> **Note**: If you want to use JSON Server for development (optional), you can run `npm run server` in a separate terminal. However, the app works with localStorage by default.

## 📁 Project Structure

```
real-state/
├── public/
│   ├── database/
│   │   └── db.json          # Initial database template
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── PropertyManager.jsx    # Property CRUD management
│   │   │   └── CarManager.jsx          # Car CRUD management
│   │   ├── Footer.jsx                 # Footer component
│   │   ├── ImageCarousel.jsx          # Image carousel component
│   │   ├── LanguageSwitcher.jsx       # Language selector
│   │   ├── Navbar.jsx                 # Navigation bar
│   │   └── Services_Card.jsx          # Service cards
│   ├── i18n/
│   │   ├── config.js                  # i18n configuration
│   │   └── locales/
│   │       ├── en.json                # English translations
│   │       ├── tr.json                # Turkish translations
│   │       └── ar.json                # Arabic translations
│   ├── pages/
│   │   ├── About.jsx                  # About page
│   │   ├── Car_Sale.jsx               # Car listings page
│   │   ├── Contact.jsx                # Contact form page
│   │   ├── Dashboard.jsx              # Admin dashboard
│   │   ├── Home.jsx                   # Home page
│   │   ├── Rent_Home.jsx              # Rental properties page
│   │   └── Sale_Home.jsx              # Properties for sale page
│   ├── services/
│   │   └── database.js                # Database service (localStorage)
│   ├── style/
│   │   ├── About.modules.css
│   │   ├── Car.modules.css
│   │   ├── Contact.modules.css
│   │   ├── Dashboard.modules.css
│   │   ├── Footer.modules.css
│   │   ├── Home.modules.css
│   │   ├── ImageCarousel.modules.css
│   │   ├── LanguageSwitcher.modules.css
│   │   ├── Modal.modules.css
│   │   ├── Navbar.modules.css
│   │   ├── Property.modules.css
│   │   └── Services_Card.modules.css
│   ├── App.jsx                        # Main app component with routing
│   ├── main.jsx                       # Application entry point
│   └── index.css                      # Global styles
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Available Scripts

- `npm run dev` - Start the React development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run server` - Start JSON Server (optional, for development)

## 🌍 Multi-Language Support

The application supports three languages:

- **English (EN)** - Default language
- **Turkish (TR)** - Full translation support
- **Arabic (AR)** - Full translation with RTL layout

### Language Features:

- Language switcher in the navigation bar
- Automatic RTL layout for Arabic
- All UI text is translated
- Language preference saved in localStorage
- Persistent language selection across sessions

## 🖼️ Image Management

### Features:

- **Multiple Images**: Upload multiple images per property/car
- **Image Carousel**: Navigate between images with:
  - Previous/Next buttons
  - Dot indicators
  - Image counter (e.g., "1/3")
- **File Upload**: Direct upload from device (converted to base64)
- **Image Preview**: Grid preview in dashboard forms
- **Image Removal**: Remove individual images before saving

### Supported Formats:

- All standard image formats (JPEG, PNG, GIF, WebP, etc.)
- Maximum file size: 5MB per image
- Images are stored as base64 strings in localStorage

## 🎛️ Admin Dashboard

Access the dashboard at `/dashboard` to manage:

### Property Management:

- Add new properties (sale or rent)
- Edit existing properties
- Delete properties
- Upload multiple images
- Manage property details (title, location, bedrooms, bathrooms, area, price, description)

### Car Management:

- Add new cars
- Edit existing cars
- Delete cars
- Upload multiple images
- Manage car details (title, year, mileage, fuel type, transmission, price, description)

### Statistics:

- View total properties for sale
- View total properties for rent
- View total cars available
- View total listings

## 📱 Pages

### Public Pages:

- **Home** (`/` or `/Home`) - Landing page with service cards
- **Properties for Sale** (`/Home_Sale`) - Browse properties for purchase
- **Properties for Rent** (`/Home_Rent`) - Browse rental properties
- **Cars for Sale** (`/Car_Sale`) - Browse vehicles
- **About** (`/About`) - Company information
- **Contact** (`/Contact`) - Contact form

### Admin Pages:

- **Dashboard** (`/dashboard`) - Admin management panel

## 🛠️ Technologies Used

### Core:

- **React 19** - UI library
- **React Router DOM 7** - Routing
- **Vite 7** - Build tool and dev server

### Internationalization:

- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next

### UI & Icons:

- **React Icons** - Icon library
- **CSS Modules** - Scoped styling

### Development:

- **ESLint** - Code linting
- **SWC** - Fast compiler

## 💾 Data Storage

The application uses **localStorage** for data persistence:

- Data is automatically saved when you add, edit, or delete listings
- Data persists across browser sessions
- Initial data can be loaded from `public/database/db.json`
- All changes are stored locally in the browser

### Data Structure:

```json
{
  "propertiesForSale": [
    {
      "id": 1,
      "title": "Property Title",
      "location": "Location",
      "bedrooms": 4,
      "bathrooms": 3,
      "area": "2500 sqft",
      "price": "$450,000",
      "description": "Description",
      "images": ["base64_image_1", "base64_image_2"]
    }
  ],
  "propertiesForRent": [...],
  "cars": [...]
}
```

## 🎨 Design Features

- **Modern Card Design**: Beautiful property/car cards with hover effects
- **Smooth Animations**: Fade-in and transition effects
- **Responsive Grid**: Adaptive grid layout for all screen sizes
- **Image Zoom**: Images zoom on hover
- **Badge System**: Property features displayed as badges
- **Modal Dialogs**: Detailed view modals for listings

## 🔧 Configuration

### Language Configuration:

Language settings are stored in `src/i18n/config.js`. The default language can be changed there.

### Database Configuration:

Database service is in `src/services/database.js`. You can modify the storage key or add additional features.

## 📝 Development Notes

- The application uses CSS Modules for scoped styling
- All components are functional components using React Hooks
- The dashboard requires no authentication (add authentication for production)
- Images are stored as base64 strings (consider using a cloud service for production)
- localStorage has size limitations (~5-10MB), consider alternatives for large datasets

## 🚀 Deployment

### Quick Deploy (Recommended: Vercel)

The easiest way to deploy is using **Vercel**:

1. **Push your code to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)** and sign up
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Vercel will auto-detect Vite settings** - just click "Deploy"
6. **Your site will be live in 2-3 minutes!** 🎉

### Build for Production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Free Hosting Options:

1. **Vercel** ⭐ (Recommended)

   - Zero configuration
   - Automatic deployments
   - Free custom domain
   - [Deploy Now →](https://vercel.com/new)

2. **Netlify**

   - Easy setup
   - Continuous deployment
   - [Deploy Now →](https://app.netlify.com)

3. **GitHub Pages**

   - Free for public repos
   - See `DEPLOYMENT.md` for setup

4. **Render**
   - Free static site hosting
   - [Deploy Now →](https://render.com)

### Configuration Files:

The project includes deployment configs:

- `vercel.json` - Vercel configuration
- `netlify.toml` - Netlify configuration
- `vite.config.js` - Build configuration

### Detailed Deployment Guide:

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions for all hosting platforms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Mohamed Darwish

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- i18next for internationalization support
- React Icons for the icon library

---

**Note**: This is a development version. For production use, consider:

- Adding authentication to the dashboard
- Using a proper backend API
- Implementing image hosting service (e.g., Cloudinary, AWS S3)
- Adding error boundaries
- Implementing proper error handling
- Adding loading states
- Optimizing images before upload
