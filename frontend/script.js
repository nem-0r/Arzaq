// ========================================
// ARZAQ - Main JavaScript with i18n Support
// ========================================

// Global variables
let currentTranslations = {};
let currentLanguage = 'en';

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    initializePage();
    setupLanguageSwitcher();
});

// ========================================
// INTERNATIONALIZATION (i18n)
// ========================================

/**
 * Initialize language on page load
 * Loads the last selected language from localStorage or defaults to English
 */
function initializeLanguage() {
    // Get saved language from localStorage, default to 'en'
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    loadLanguage(savedLang);
}

/**
 * Load language JSON file and update all text on the page
 * @param {string} lang - Language code ('en', 'ru', 'kz')
 */
function loadLanguage(lang) {
    // Validate language code
    if (!['en', 'ru', 'kz'].includes(lang)) {
        console.error('Invalid language code:', lang);
        lang = 'en';
    }
    
    // Show loading state
    document.body.classList.add('lang-loading');
    
    // Fetch translation file
    fetch(`locales/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            currentTranslations = translations;
            currentLanguage = lang;
            
            // Update all translatable elements
            updatePageTranslations();
            
            // Update active language button
            updateLanguageButtons(lang);
            
            // Save language preference
            localStorage.setItem('selectedLanguage', lang);
            
            // Remove loading state
            document.body.classList.remove('lang-loading');
        })
        .catch(error => {
            console.error('Error loading language file:', error);
            // Fallback to English if error
            if (lang !== 'en') {
                loadLanguage('en');
            }
            document.body.classList.remove('lang-loading');
        });
}

/**
 * Update all text elements on the page with translations
 */
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTranslations[key]) {
            element.textContent = currentTranslations[key];
        }
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (currentTranslations[key]) {
            element.placeholder = currentTranslations[key];
        }
    });
}

/**
 * Update active state of language buttons
 * @param {string} activeLang - Currently active language code
 */
function updateLanguageButtons(activeLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === activeLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Setup click handlers for language switcher buttons
 */
function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            loadLanguage(lang);
        });
    });
}

/**
 * Get translated text by key
 * @param {string} key - Translation key
 * @returns {string} Translated text or key if not found
 */
function t(key) {
    return currentTranslations[key] || key;
}

// ========================================
// PAGE INITIALIZATION
// ========================================
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize based on current page
    if (currentPage === 'map.html') {
        initializeMap();
    } else if (currentPage === 'register.html') {
        initializeRegisterForm();
    } else if (currentPage === 'login.html') {
        initializeLoginForm();
    } else if (currentPage === 'profile.html') {
        initializeProfile();
    }
}

// ========================================
// MAP FUNCTIONALITY (Yandex Maps)
// ========================================
function initializeMap() {
    // Wait for Yandex Maps API to load
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API not loaded');
        return;
    }
    
    ymaps.ready(function() {
        // Center map on Almaty, Kazakhstan
        const map = new ymaps.Map('map', {
            center: [43.238949, 76.889709], // Almaty coordinates
            zoom: 13,
            controls: ['zoomControl', 'geolocationControl']
        });

        // Food locations data (static for now)
        // BACKEND NOTE: Replace this with API call to fetch dynamic locations
        const foodLocations = [
            {
                coords: [43.245, 76.895],
                nameKey: 'map_location_apples',
                descKey: 'map_desc_apples',
                icon: '🍎',
                quantity: 5
            },
            {
                coords: [43.235, 76.880],
                nameKey: 'map_location_bread',
                descKey: 'map_desc_bread',
                icon: '🍞',
                quantity: 5
            },
            {
                coords: [43.242, 76.892],
                nameKey: 'map_location_broccoli',
                descKey: 'map_desc_broccoli',
                icon: '🥦',
                quantity: 3
            },
            {
                coords: [43.232, 76.888],
                nameKey: 'map_location_milk',
                descKey: 'map_desc_milk',
                icon: '🥛',
                quantity: 0
            },
            {
                coords: [43.248, 76.898],
                nameKey: 'map_location_restaurant',
                descKey: 'map_desc_restaurant',
                icon: '🍽️',
                quantity: 0
            }
        ];

        // Add markers to the map
        foodLocations.forEach(function(location) {
            const name = t(location.nameKey);
            const desc = t(location.descKey);
            const footer = location.quantity 
                ? `${location.quantity} ${t('map_quantity_available')}` 
                : t('map_contact_details');
            
            const placemark = new ymaps.Placemark(
                location.coords,
                {
                    balloonContentHeader: location.icon + ' ' + name,
                    balloonContentBody: desc,
                    balloonContentFooter: footer,
                    hintContent: name
                },
                {
                    preset: 'islands#icon',
                    iconColor: location.quantity ? '#9DB896' : '#E89A6F'
                }
            );
            
            map.geoObjects.add(placemark);
        });

        // Add user location marker (blue dot)
        const userLocation = new ymaps.Placemark(
            [43.238949, 76.889709],
            {
                hintContent: t('map_your_location')
            },
            {
                preset: 'islands#circleDotIcon',
                iconColor: '#4A9FD8'
            }
        );
        
        map.geoObjects.add(userLocation);
    });
}

// ========================================
// REGISTRATION VALIDATION & LOGIC
// ========================================
function initializeRegisterForm() {
    const form = document.getElementById('registerForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateRegister();
        });
    }
}

function validateRegister() {
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Reset error messages
    clearErrors();
    
    let isValid = true;
    
    // Validate Full Name
    if (fullName === '') {
        showError('nameError', t('error_name_required'));
        isValid = false;
    }
    
    // Validate Email
    if (email === '') {
        showError('emailError', t('error_email_required'));
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', t('error_email_invalid'));
        isValid = false;
    }
    
    // Validate Password
    if (password === '') {
        showError('passwordError', t('error_password_required'));
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', t('error_password_length'));
        isValid = false;
    }
    
    // Validate Confirm Password
    if (confirmPassword === '') {
        showError('confirmPasswordError', t('error_password_confirm'));
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', t('error_password_mismatch'));
        isValid = false;
    }
    
    // If all validations pass
    if (isValid) {
        // Check if email already exists
        const existingUser = localStorage.getItem('user_' + email);
        if (existingUser) {
            showError('emailError', t('error_email_exists'));
            return;
        }
        
        // Save user data to localStorage
        const userData = {
            fullName: fullName,
            email: email,
            password: password, // In production, this should be hashed!
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('user_' + email, JSON.stringify(userData));
        
        // Show success message
        alert(t('alert_register_success'));
        
        // Redirect to login page
        window.location.href = 'login.html';
        
        // ===== BACKEND INTEGRATION TEMPLATE =====
        // When backend is ready, replace the localStorage logic above with:
        /*
        fetch('YOUR_API_URL/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(t('alert_register_success'));
                window.location.href = 'login.html';
            } else {
                showError('emailError', data.message || t('error_email_exists'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
        */
    }
}

// ========================================
// LOGIN VALIDATION & LOGIC
// ========================================
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateLogin();
        });
    }
}

function validateLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    clearErrors();
    
    let isValid = true;
    
    if (email === '') {
        showError('loginEmailError', t('error_email_required'));
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmailError', t('error_email_invalid'));
        isValid = false;
    }
    
    if (password === '') {
        showError('loginPasswordError', t('error_password_required'));
        isValid = false;
    }
    
    if (isValid) {
        const userDataString = localStorage.getItem('user_' + email);
        
        if (!userDataString) {
            showError('loginEmailError', t('error_email_notfound'));
            return;
        }
        
        const userData = JSON.parse(userDataString);
        
        if (userData.password !== password) {
            showError('loginPasswordError', t('error_password_incorrect'));
            return;
        }
        
        // Login successful
        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            loggedInAt: new Date().toISOString()
        }));
        
        alert(t('alert_login_success'));
        
        // Redirect to home page
        window.location.href = 'index.html';
        
        // ===== BACKEND INTEGRATION TEMPLATE =====
        // When backend is ready, replace the localStorage logic above with:
        /*
        fetch('YOUR_API_URL/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store authentication token
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                alert(t('alert_login_success'));
                window.location.href = 'index.html';
            } else {
                showError('loginPasswordError', data.message || t('error_password_incorrect'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
        */
    }
}

// ========================================
// PROFILE PAGE LOGIC
// ========================================
function initializeProfile() {
    // Check if user is logged in
    const currentUserString = localStorage.getItem('currentUser');
    
    if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        
        // Update profile information (don't use data-i18n for user data)
        const nameElement = document.getElementById('profileName');
        const emailElement = document.getElementById('profileEmail');
        
        if (nameElement) {
            nameElement.textContent = currentUser.fullName;
            nameElement.removeAttribute('data-i18n');
        }
        
        if (emailElement) {
            emailElement.textContent = currentUser.email;
            emailElement.removeAttribute('data-i18n');
        }
        
        // Show logout button, hide login link
        const authLink = document.getElementById('authLink');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (authLink) authLink.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'flex';
            
            // Add logout functionality
            logoutBtn.addEventListener('click', function() {
                if (confirm(t('alert_logout_confirm'))) {
                    localStorage.removeItem('currentUser');
                    // In production, also clear auth token:
                    // localStorage.removeItem('authToken');
                    
                    // BACKEND NOTE: Call logout endpoint
                    /*
                    fetch('YOUR_API_URL/api/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                        }
                    })
                    .then(() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('currentUser');
                        window.location.reload();
                    });
                    */
                    
                    window.location.reload();
                }
            });
        }
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean} 
 */
function isValidEmail(email) {
    return email.includes('@') && email.includes('.') && email.indexOf('@') < email.lastIndexOf('.');
}

/**
 * Display error message for a form field
 * @param {string} elementId - ID of the error message element
 * @param {string} message - Error message to display
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}


function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(element) {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// ========================================
// FUTURE BACKEND INTEGRATION NOTES
// ========================================

/*
BACKEND INTEGRATION CHECKLIST:

1. REGISTRATION (register.html):
   - Replace localStorage.setItem() with fetch() POST to YOUR_API_URL/api/register
   - Send: { fullName, email, password }
   - Receive: { success: boolean, message: string, userId: string }
   - Error messages should use t() function for translations

2. LOGIN (login.html):
   - Replace localStorage.getItem() with fetch() POST to YOUR_API_URL/api/login
   - Send: { email, password }
   - Receive: { success: boolean, token: string, user: { id, fullName, email } }
   - Store token in localStorage as 'authToken'
   - All alerts should use t() function: alert(t('alert_login_success'))

3. AUTHENTICATION:
   - Add Authorization header to all API requests
   - Format: 'Authorization': 'Bearer ' + localStorage.getItem('authToken')
   - Example:
     headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('authToken')
     }

4. MAP DATA (map.html):
   - Replace static foodLocations array with fetch() GET to YOUR_API_URL/api/locations
   - Receive: { locations: [{ coords, name, description, quantity, icon }] }
   - Update markers dynamically based on user's language preference
   - Example:
     fetch('YOUR_API_URL/api/locations?lang=' + currentLanguage)

5. PROFILE (profile.html):
   - Fetch user data from YOUR_API_URL/api/user/:id
   - Update profile with real-time data
   - GET request with Authorization header

6. LOGOUT:
   - Call YOUR_API_URL/api/logout endpoint (POST)
   - Clear authToken and currentUser from localStorage
   - Example:
     fetch('YOUR_API_URL/api/logout', {
         method: 'POST',
         headers: {
             'Authorization': 'Bearer ' + localStorage.getItem('authToken')
         }
     })

7. MULTILINGUAL BACKEND SUPPORT:
   - Send current language with requests: ?lang=en or ?lang=ru or ?lang=kz
   - Backend should return translated content based on language parameter
   - Error messages from backend should also support multiple languages

8. COMMUNITY POSTS (community.html):
   - Fetch posts from YOUR_API_URL/api/posts?lang=currentLanguage
   - POST new content with language metadata
   - Update UI dynamically without page reload

EXAMPLE FETCH TEMPLATE WITH MULTILINGUAL SUPPORT:

fetch('YOUR_API_URL/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        'Accept-Language': currentLanguage
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
    }
    return response.json();
})
.then(data => {
    if (data.success) {
        // Success handling
        alert(t('success_message_key'));
    } else {
        // Error handling with translation
        showError('errorElementId', data.message || t('error_default'));
    }
})
.catch(error => {
    console.error('Error:', error);
    alert(t('error_network'));
});

TRANSLATION KEYS FOR COMMON BACKEND ERRORS:
- Add these to your locale JSON files:
  "error_network": "Network error. Please check your connection.",
  "error_server": "Server error. Please try again later.",
  "error_unauthorized": "Unauthorized. Please login again.",
  "error_forbidden": "Access forbidden.",
  "error_notfound": "Resource not found.",
  "success_saved": "Successfully saved!",
  "success_deleted": "Successfully deleted!",
  "success_updated": "Successfully updated!"

TESTING CHECKLIST:
□ Test all forms with different languages
□ Test language switching on all pages
□ Test localStorage persistence
□ Test responsive design on all screen sizes (320px to 1440px+)
□ Test navigation between pages
□ Test login/logout flow
□ Test map markers with translations
□ Verify all buttons and links work
□ Check browser console for errors
□ Test on multiple browsers (Chrome, Firefox, Safari, Edge)
□ Test on actual mobile devices
*/

// ========================================
// ADDITIONAL HELPER FUNCTIONS
// ========================================

/**
 * Format date based on current language
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const locales = {
        'en': 'en-US',
        'ru': 'ru-RU',
        'kz': 'kk-KZ'
    };
    
    return date.toLocaleDateString(locales[currentLanguage] || 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get current language code
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

/**
 * Get current user data
 * @returns {Object|null} User object or null if not logged in
 */
function getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
}

// Export functions for testing (if using modules)
// export { loadLanguage, t, isAuthenticated, getCurrentUser, getCurrentLanguage };

console.log('ARZAQ App initialized with language:', currentLanguage);