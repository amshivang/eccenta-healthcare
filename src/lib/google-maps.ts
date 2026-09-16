export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  types?: string[];
}

export interface PlaceDetails extends PlaceResult {
  phoneNumber?: string;
  website?: string;
  openingHours?: {
    openNow: boolean;
    weekdayText: string[];
  };
  photos?: string[];
  reviews?: Array<{
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

export interface DistanceResult {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  status: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';

export async function searchNearbyDoctors(lat: number, lng: number, radius: number = 10000, keyword: string = 'doctor'): Promise<PlaceResult[]> {
  if (!API_KEY) return [];

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Places API Error:', data.status, data.error_message);
      return [];
    }

    return data.results.map((result: any) => ({
      placeId: result.place_id,
      name: result.name,
      address: result.vicinity,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      rating: result.rating,
      userRatingsTotal: result.user_ratings_total,
      types: result.types,
    }));
  } catch (error) {
    console.error('Failed to search nearby doctors:', error);
    return [];
  }
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  if (!API_KEY) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Geocoding API Error:', data.status, data.error_message);
      return null;
    }

    const result = data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error('Failed to geocode address:', error);
    return null;
  }
}

export async function getDistanceMatrix(originLat: number, originLng: number, destinations: Array<{lat: number, lng: number}>): Promise<DistanceResult[]> {
  if (!API_KEY || destinations.length === 0) return [];

  try {
    const originsStr = `${originLat},${originLng}`;
    const destinationsStr = destinations.map(d => `${d.lat},${d.lng}`).join('|');
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsStr}&destinations=${destinationsStr}&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Distance Matrix API Error:', data.status, data.error_message);
      return [];
    }

    const elements = data.rows[0].elements;
    return elements.map((element: any) => ({
      distance: element.distance,
      duration: element.duration,
      status: element.status,
    }));
  } catch (error) {
    console.error('Failed to get distance matrix:', error);
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!API_KEY) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,website,opening_hours,photos,reviews,vicinity,geometry,type,user_ratings_total&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Place Details API Error:', data.status, data.error_message);
      return null;
    }

    const result = data.result;
    
    // Process photos if available
    const photoUrls = result.photos 
      ? result.photos.slice(0, 5).map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`)
      : undefined;

    return {
      placeId,
      name: result.name,
      address: result.vicinity,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      rating: result.rating,
      userRatingsTotal: result.user_ratings_total,
      types: result.types,
      phoneNumber: result.formatted_phone_number,
      website: result.website,
      openingHours: result.opening_hours ? {
        openNow: result.opening_hours.open_now,
        weekdayText: result.opening_hours.weekday_text || [],
      } : undefined,
      photos: photoUrls,
      reviews: result.reviews ? result.reviews.map((r: any) => ({
        authorName: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.time,
      })) : undefined,
    };
  } catch (error) {
    console.error('Failed to get place details:', error);
    return null;
  }
}

export function getDirectionsUrl(destLat: number, destLng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
}

export function getStaticMapUrl(lat: number, lng: number, zoom: number = 15, width: number = 600, height: number = 300): string {
  if (!API_KEY) return '';
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${lat},${lng}&key=${API_KEY}`;
}

export function calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;
  const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);
  
  const RADIUS_OF_EARTH_IN_KM = 6371;
  const dLat = distance(lat2, lat1);
  const dLon = distance(lng2, lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
  const c = 2 * Math.asin(Math.sqrt(a));
  
  return RADIUS_OF_EARTH_IN_KM * c;
}
