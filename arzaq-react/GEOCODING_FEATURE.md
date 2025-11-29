# Automatic Address Geocoding Feature

## Overview
The restaurant creation form now automatically converts addresses to coordinates using the Yandex Geocoder API. Users no longer need to manually enter latitude and longitude values.

## How It Works

### User Flow
1. User fills in the restaurant creation form
2. User enters a full address (e.g., "Al-Farabi Avenue 77, Almaty, Kazakhstan")
3. **Option 1**: User clicks "Verify Address" button to pre-verify the address
4. **Option 2**: User submits the form directly, and geocoding happens automatically
5. The system converts the address to coordinates in the background
6. The restaurant is created with the geocoded coordinates

### Technical Implementation

#### Files Created
- `/src/utils/geocoding.js` - Geocoding utility functions

#### Files Modified
- `/src/pages/RestaurantDashboard/RestaurantDashboard.jsx` - Updated form logic
- `/src/pages/RestaurantDashboard/RestaurantDashboard.module.css` - New UI styles

#### Key Features
1. **Automatic Geocoding**: Converts addresses to coordinates using Yandex Geocoder API
2. **Address Validation**: Validates address format before geocoding
3. **Pre-verification Option**: "Verify Address" button to check address before submission
4. **Loading States**: Clear feedback during geocoding process
5. **Error Handling**: User-friendly error messages for invalid addresses

## API Usage

### Environment Variables
The feature uses the existing Yandex Maps API key:
```
VITE_YANDEX_MAPS_API_KEY=de714e5f-b399-43a6-8db2-acedcf0f624d
```

### Geocoding Function
```javascript
import { geocodeAddress } from '../utils/geocoding';

const coordinates = await geocodeAddress('Al-Farabi Avenue 77, Almaty, Kazakhstan');
// Returns: { latitude: 43.238949, longitude: 76.889709 }
```

## User Interface Changes

### What Was Removed
- Manual latitude input field
- Manual longitude input field

### What Was Added
- Address hint: "Enter complete address including street number, city, and country"
- "Verify Address" button - optional pre-verification
- Address verification indicator (checkmark when verified)
- Coordinates preview after verification
- Dynamic submit button states:
  - "Converting address to coordinates..." during geocoding
  - "Creating restaurant..." during submission
  - "Create Restaurant Profile" default state

## Error Handling

### Address Validation
The system validates:
- Address is not empty
- Address is at least 10 characters
- Address contains street numbers (digits)

### Geocoding Errors
User-friendly error messages for:
- Address not found
- Missing API key
- Network errors
- Invalid coordinates

### Example Error Messages
- "Address is too short. Please provide a full address including street, city, and country."
- "Address not found. Please enter a more specific address (e.g., 'Al-Farabi Avenue 77, Almaty, Kazakhstan')"
- "Failed to convert address to coordinates. Please check your internet connection and try again."

## Best Practices for Users

### Good Address Format
✅ "Al-Farabi Avenue 77, Almaty, Kazakhstan"
✅ "Dostyk Avenue 162, Almaty, Kazakhstan"
✅ "Satpaev Street 90, Almaty, Kazakhstan"

### Poor Address Format
❌ "Almaty" (too vague)
❌ "My restaurant" (not an address)
❌ "Al-Farabi" (missing street number)

## Developer Notes

### How to Test
1. Start the development server: `npm run dev`
2. Navigate to Restaurant Dashboard
3. Try creating a restaurant with various addresses
4. Verify that coordinates are correctly generated

### API Rate Limits
- Yandex Geocoder API has rate limits
- If you encounter "429 Too Many Requests", wait a few minutes
- Consider implementing request throttling for production

### Future Improvements
1. Add address autocomplete suggestions
2. Show map preview with marker at geocoded location
3. Cache geocoding results to reduce API calls
4. Add reverse geocoding (coordinates to address)
5. Support multiple address formats/languages

## Troubleshooting

### "Geocoding API request failed"
- Check internet connection
- Verify API key is valid
- Check Yandex API status

### "Address not found"
- Make sure address is specific enough
- Include street number, city, and country
- Try using the "Verify Address" button first

### Coordinates seem wrong
- Verify the address is correct
- Check if the address exists in Yandex Maps
- Try a more specific address format

## Backend Compatibility

### No Backend Changes Required
The geocoding happens entirely on the frontend. The backend still receives:
```json
{
  "name": "Restaurant Name",
  "address": "Full Address String",
  "latitude": 43.238949,
  "longitude": 76.889709,
  "phone": "+7 XXX XXX XXXX",
  "email": "email@example.com",
  "description": "Description..."
}
```

The backend API remains unchanged - it still expects latitude and longitude fields.
