# ARZAQ - Food Sharing Web Application

A fully responsive, multilingual food-sharing web application with map integration for Kazakhstan. Built with vanilla HTML, CSS, and JavaScript, ready for backend integration.

## 🌟 Features

- ✅ **Fully Responsive Design** - Works on all devices (320px - 1440px+)
- ✅ **Multilingual Support** - English, Russian, and Kazakh
- ✅ **Yandex Maps Integration** - Interactive map with food location markers
- ✅ **User Authentication** - Register, login, and profile management
- ✅ **Community Feed** - Social features for food sharing
- ✅ **Modern UI/UX** - Clean design with Poppins font
- ✅ **Backend Ready** - Structured for easy API integration

## 📁 Project Structure

```
frontend/
├── index.html              # Home page
├── map.html                # Map with food locations
├── community.html          # Community feed
├── profile.html            # User profile
├── register.html           # Registration page
├── login.html              # Login page
├── style.css               # Global responsive styles
├── script.js               # Main JavaScript with i18n
├── locales/
│   ├── en.json            # English translations
│   ├── ru.json            # Russian translations
│   └── kz.json            # Kazakh translations
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Setup

1. Clone or download the project files
2. Ensure all files are in the correct structure as shown above
3. Get a Yandex Maps API key from: https://developer.tech.yandex.com/

### 2. Configuration

Open `map.html` and replace the API key on line 8:

```html
<script src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=en_US"></script>
```

### 3. Run Locally

**Option 1: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Using Node.js**
```bash
npx serve
```

**Option 3: Using VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 4. Open in Browser

Navigate to `http://localhost:8000` (or your server's port)

## 🌐 Multilingual Support

### How It Works

1. **Language Selection**: Users can switch languages using buttons in the top-right corner (EN / RU / KZ)
2. **Automatic Persistence**: Selected language is saved in `localStorage`
3. **Dynamic Loading**: Translations are loaded from JSON files without page reload
4. **Smooth Transitions**: Language changes have smooth fade effects

### Adding New Languages

1. Create a new JSON file in `locales/` (e.g., `de.json` for German)
2. Copy the structure from `en.json`
3. Translate all values
4. Update `loadLanguage()` function in `script.js` to include the new language
5. Add a new language button in HTML files

### Translation Keys

All translatable text uses `data-i18n` attributes:

```html
<!-- For text content -->
<h2 data-i18n="home_welcome_title">Welcome to ARZAQ</h2>

<!-- For placeholders -->
<input data-i18n-placeholder="search_placeholder" placeholder="Find nearby food">
```

## 🎨 Design System

### Colors

```css
--primary-green: #9DB896      /* Main brand color */
--primary-green-dark: #7FA078 /* Hover states */
--primary-green-light: #B8C9B3 /* Backgrounds */
--accent-orange: #E89A6F      /* Active states, CTAs */
--accent-peach: #F4B08C       /* Secondary accents */
--background-white: #FFFFFF   /* Main backgrounds */
--background-gray: #F5F5F5    /* Section backgrounds */
--text-dark: #333333          /* Primary text */
--text-gray: #666666          /* Secondary text */
--text-light: #999999         /* Tertiary text */
```

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Responsive Breakpoints

```css
--mobile-sm: 320px   /* Small phones */
--mobile: 480px      /* Phones */
--tablet: 768px      /* Tablets */
--desktop: 1024px    /* Desktop */
--desktop-lg: 1440px /* Large desktop */
```

## 📱 Responsive Features

### Mobile First Approach

- Optimized for mobile devices first
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Bottom navigation for easy thumb access

### Tested Screen Sizes

- ✅ iPhone SE (320px)
- ✅ iPhone 12/13/14 (390px)
- ✅ Samsung Galaxy (360px - 412px)
- ✅ iPad (768px)
- ✅ iPad Pro (1024px)
- ✅ Laptop (1366px)
- ✅ Desktop (1920px)

## 🔐 Authentication Flow

### Current Implementation (localStorage)

**Register:**
1. User fills registration form
2. Client-side validation
3. Data saved to `localStorage` as `user_{email}`
4. Redirect to login page

**Login:**
1. User enters credentials
2. Validation against `localStorage` data
3. Create session in `localStorage` as `currentUser`
4. Redirect to home page

**Logout:**
1. Confirm logout
2. Remove `currentUser` from `localStorage`
3. Reload page

### Backend Integration (Ready to implement)

See detailed backend integration notes in `script.js` (lines 380-480)

**Required Endpoints:**
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/user/:id` - Get user profile
- `GET /api/locations` - Get food locations
- `GET /api/posts` - Get community posts

**Authentication:**
- Use JWT tokens
- Store in `localStorage` as `authToken`
- Include in headers: `Authorization: Bearer {token}`

## 🗺️ Map Integration

### Yandex Maps Setup

1. The map is centered on Almaty, Kazakhstan (43.238949, 76.889709)
2. Static markers show food locations with:
   - Name and description
   - Quantity available
   - Icon representation
   - Color coding (green = available, orange = contact for details)

### Adding Dynamic Markers

Replace the static `foodLocations` array with API call:

```javascript
fetch('YOUR_API_URL/api/locations?lang=' + currentLanguage)
    .then(response => response.json())
    .then(data => {
        data.locations.forEach(location => {
            // Add marker to map
        });
    });
```

## 🧪 Testing Checklist

### Functionality
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout from profile
- [ ] Switch between all pages
- [ ] Change language (EN/RU/KZ)
- [ ] View map markers
- [ ] Click on map markers (balloons)
- [ ] Search bar (UI only)

### Responsive Design
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Check bottom navigation on all sizes
- [ ] Verify text readability at all sizes
- [ ] Test landscape and portrait orientations

### Multilingual
- [ ] Switch to Russian - verify all text changes
- [ ] Switch to Kazakh - verify all text changes
- [ ] Switch to English - verify all text changes
- [ ] Refresh page - verify language persists
- [ ] Test form validation messages in all languages
- [ ] Test alert messages in all languages

### Browser Compatibility
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 🔧 Customization

### Adding New Pages

1. Create new HTML file
2. Include the header with language switcher
3. Include the bottom navigation
4. Add translations to all locale JSON files
5. Link from existing pages

### Modifying Styles

All styles are in `style.css` with clear sections:
- Global variables (lines 1-30)
- Header & Navigation (lines 50-100)
- Responsive breakpoints (lines 500+)

Use CSS custom properties for consistency:
```css
color: var(--primary-green);
font-family: 'Poppins', sans-serif;
```

### Adding New Translations

1. Open all three locale files (`en.json`, `ru.json`, `kz.json`)
2. Add the same key to each file
3. Translate the values
4. Use in HTML: `<element data-i18n="your_key">Default Text</element>`

## 📦 Deployment

### Static Hosting (Recommended)

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
1. Drag and drop the folder
2. Or connect to Git repository

**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Enable
3. Select branch and folder

### Server Requirements

- No server-side processing needed
- Static file hosting only
- HTTPS recommended
- CORS configured for API calls

## 🚀 Production Checklist

- [ ] Replace Yandex Maps API key
- [ ] Remove console.log statements
- [ ] Minify CSS and JavaScript
- [ ] Optimize images (if added)
- [ ] Configure backend API URLs
- [ ] Set up HTTPS
- [ ] Test on real devices
- [ ] Enable caching headers
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up analytics (optional)

## 🔗 Backend Integration Guide

### Step 1: Update API URLs

Find all comments marked with `BACKEND NOTE:` in `script.js`

### Step 2: Replace localStorage

Replace localStorage calls with fetch() API calls

### Step 3: Add Authorization

Include JWT token in headers for protected routes

### Step 4: Handle Errors

Use translation keys for error messages:
```javascript
alert(t('error_network'));
```

### Step 5: Test

Test all flows with real backend endpoints

## 📄 License

This project is created for ARZAQ food-sharing platform.

## 👥 Support

For questions or issues:
- Check `script.js` comments for implementation details
- Review translation files for text modifications
- Test responsive design on actual devices

## 🎯 Future Enhancements

- [ ] Add user profile photo upload
- [ ] Implement real-time chat
- [ ] Add push notifications
- [ ] Create admin dashboard
- [ ] Add food categories filter
- [ ] Implement rating system
- [ ] Add social sharing
- [ ] Create mobile app version

---

**Built with ❤️ for Kazakhstan's food-sharing community**