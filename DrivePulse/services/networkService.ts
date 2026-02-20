import { MeasurementData } from './api';

export interface NetworkData {
  rssi: number;
  rsrp: number;
  sinr: number;
  cellId: string;
  frequency: number;
  bandwidth: number;
  pci: number;
  quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

class NetworkService {
  private intervalId: NodeJS.Timeout | null = null;
  private currentTechnology: string = '4G';

  // Simulate network measurements based on technology
  generateMeasurement(technology: string): NetworkData {
    let baseRssi: number;
    let baseRsrp: number;
    let baseSinr: number;
    let frequency: number;
    let bandwidth: number;

    switch (technology) {
      case '5G':
        baseRssi = -70;
        baseRsrp = -85;
        baseSinr = 25;
        frequency = 3500;
        bandwidth = 100;
        break;
      case '4G':
        baseRssi = -80;
        baseRsrp = -95;
        baseSinr = 15;
        frequency = 2600;
        bandwidth = 20;
        break;
      case '3G':
        baseRssi = -85;
        baseRsrp = -105;
        baseSinr = 5;
        frequency = 2100;
        bandwidth = 5;
        break;
      case '2G':
        baseRssi = -90;
        baseRsrp = -110;
        baseSinr = 0;
        frequency = 900;
        bandwidth = 0.2;
        break;
      default:
        baseRssi = -80;
        baseRsrp = -95;
        baseSinr = 15;
        frequency = 2600;
        bandwidth = 20;
    }

    // Add some random variation
    const rssi = baseRssi + (Math.random() - 0.5) * 20;
    const rsrp = baseRsrp + (Math.random() - 0.5) * 20;
    const sinr = Math.max(0, baseSinr + (Math.random() - 0.5) * 10);

    // Generate other values
    const cellId = `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`;
    const pci = Math.floor(Math.random() * 504);

    // Determine quality based on RSSI
    let quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    if (rssi > -70) quality = 'Excellent';
    else if (rssi > -85) quality = 'Good';
    else if (rssi > -100) quality = 'Fair';
    else quality = 'Poor';

    return {
      rssi: Math.round(rssi),
      rsrp: Math.round(rsrp),
      sinr: Math.round(sinr),
      cellId,
      frequency: Math.round(frequency),
      bandwidth,
      pci,
      quality
    };
  }

  // Convert to API format
  toMeasurementData(networkData: NetworkData, technology: string): MeasurementData {
    return {
      technology,
      rssi: networkData.rssi,
      rsrp: networkData.rsrp,
      sinr: networkData.sinr,
      cell_id: parseInt(networkData.cellId, 16),
      frequency: networkData.frequency,
      bandwidth: networkData.bandwidth,
      pci: networkData.pci,
      latitude: 0, // Will be set by location service
      longitude: 0, // Will be set by location service
      recorded_at: new Date().toISOString()
    };
  }

  startMeasurements(technology: string, callback: (data: NetworkData) => void, intervalMs: number = 5000) {
    this.currentTechnology = technology;
    this.stopMeasurements();
    
    this.intervalId = setInterval(() => {
      const measurement = this.generateMeasurement(technology);
      callback(measurement);
    }, intervalMs);

    // Send initial measurement
    const initialMeasurement = this.generateMeasurement(technology);
    callback(initialMeasurement);
  }

  stopMeasurements() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateTechnology(technology: string, callback: (data: NetworkData) => void) {
    if (this.intervalId) {
      this.currentTechnology = technology;
      // Send immediate measurement with new technology
      const measurement = this.generateMeasurement(technology);
      callback(measurement);
    }
  }
}

export const networkService = new NetworkService();