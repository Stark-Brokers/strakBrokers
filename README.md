<div align="center">

# ✨ Stark Brokers Real Estate ✨

<img src="src/assets/logo-nav.jpg" alt="Stark Brokers Logo" width="200"/>

*A modern, bilingual (Arabic/English) real estate platform built with React and Tailwind CSS. Our platform offers a seamless experience for browsing properties with full support for both Arabic and English languages.*

</div>

---

## 🌟 Features

- 🌐 **Bilingual Support**
  - Full Arabic and English language support
  - RTL/LTR layout switching
  
- 🏠 **Advanced Property Search**
  - Dynamic filtering system
  - Property type categorization
  - Room and bathroom filters
  - City/neighborhood filtering
  - Price range selection
  
- 🗺️ **Interactive Map View**
  - Real-time property location display
  - Dynamic map filtering
  - Seamless property navigation
  
- 📱 **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
  - Consistent experience across devices
  
- 🎨 **Modern UI/UX**
  - Clean and intuitive interface
  - Smooth animations
  - User-friendly navigation
  - Brand-consistent styling

## 💻 Tech Stack

<div align="left">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

## 🚀 Quick Start

```bash
# Clone the repository
git clone git@github.com:Stark-Brokers/strakBrokers.git

# Navigate to project directory
cd strakBrokers

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🔧 Environment Setup

The project uses environment variables for configuration. A `.env.example` file is provided as a template.

1. Copy the example file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
# Firebase Configuration (Phone Authentication)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Configuration
VITE_APP_ENV=development
VITE_APP_NAME="Stark Brokers"
```

You'll need to obtain:
- Firebase credentials (for phone authentication) from your [Firebase Console](https://console.firebase.google.com)
- Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com)

## 📦 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── map/             # Map view components
│   ├── owner/           # Property owner features
│   ├── properties/      # Property-related components
│   ├── renter/          # Property renter features
│   ├── shared/          # Shared components
│   ├── CustomerService.jsx  # Customer support component
│   ├── FeaturedProperties.jsx  # Featured properties showcase
│   ├── Footer.jsx          # Application footer
│   ├── Hero.jsx           # Hero/Landing section
│   ├── Home.jsx           # Home page component
│   ├── Navbar.jsx         # Navigation bar
│   └── Partners.jsx       # Partners/Sponsors section
├── contexts/            # React context providers
├── services/            # API and service integrations
├── types/               # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main application component
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by **Stark Brokers Team**

</div>
