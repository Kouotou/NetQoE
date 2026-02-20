import * as Location from 'expo-location';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  rssi: number;
  quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private signalPath: LocationPoint[] = [];

  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  startTracking(onLocationUpdate: (point: LocationPoint) => void) {
    this.requestPermissions().then(async (hasPermission) => {
      if (!hasPermission) return;

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // Update every 2 seconds
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          // This would normally get real signal data, but we'll simulate it
          const rssi = -80 + (Math.random() - 0.5) * 40; // -100 to -60 range
          let quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
          
          if (rssi > -70) quality = 'Excellent';
          else if (rssi > -85) quality = 'Good';
          else if (rssi > -100) quality = 'Fair';
          else quality = 'Poor';

          const point: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            rssi: Math.round(rssi),
            quality
          };

          this.signalPath.push(point);
          onLocationUpdate(point);
        }
      );
    });
  }

  stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  getSignalPath(): LocationPoint[] {
    return this.signalPath;
  }

  clearPath() {
    this.signalPath = [];
  }

  // Generate mock path for demo
  generateMockPath(centerLat: number, centerLng: number): LocationPoint[] {
    const mockPath: LocationPoint[] = [];
    const numPoints = 20;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = 0.01 * Math.random(); // Random radius up to ~1km
      
      const lat = centerLat + radius * Math.cos(angle);
      const lng = centerLng + radius * Math.sin(angle);
      
      // Simulate varying signal strength
      const rssi = -60 - (Math.random() * 50); // -60 to -110 range
      let quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
      
      if (rssi > -70) quality = 'Excellent';
      else if (rssi > -85) quality = 'Good';
      else if (rssi > -100) quality = 'Fair';
      else quality = 'Poor';

      mockPath.push({
        latitude: lat,
        longitude: lng,
        timestamp: Date.now() - (numPoints - i) * 10000,
        rssi: Math.round(rssi),
        quality
      });
    }
    
    this.signalPath = mockPath;
    return mockPath;
  }
}

export const locationService = new LocationService();