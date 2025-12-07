# app/utils/geocoding.py
import requests
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)


def geocode_address(address: str) -> Optional[Tuple[float, float]]:
    """
    Convert address to latitude/longitude using OpenStreetMap Nominatim API

    Args:
        address: Address string to geocode

    Returns:
        Tuple of (latitude, longitude) or None if geocoding fails
    """
    if not address or not address.strip():
        return None

    try:
        # Use OpenStreetMap Nominatim API (free, no API key required)
        url = "https://nominatim.openstreetmap.org/search"

        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1
        }

        headers = {
            'User-Agent': 'ARZAQ-FoodRescue/1.0'  # Required by Nominatim
        }

        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()

        data = response.json()

        if data and len(data) > 0:
            result = data[0]
            latitude = float(result['lat'])
            longitude = float(result['lon'])

            logger.info(f"Successfully geocoded address: {address} -> ({latitude}, {longitude})")
            return (latitude, longitude)
        else:
            logger.warning(f"No geocoding results found for address: {address}")
            return None

    except requests.exceptions.RequestException as e:
        logger.error(f"Geocoding request failed for address '{address}': {str(e)}")
        return None
    except (KeyError, ValueError, IndexError) as e:
        logger.error(f"Error parsing geocoding response for address '{address}': {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error during geocoding for address '{address}': {str(e)}")
        return None
