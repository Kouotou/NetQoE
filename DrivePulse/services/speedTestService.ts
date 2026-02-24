export interface SpeedTestResult {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  technology: string;
  timestamp: string;
}

export interface SpeedTestProgress {
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  progress: number; // 0-100
  currentSpeed?: number;
}

class SpeedTestService {
  private isRunning = false;

  async runSpeedTest(
    technology: string,
    onProgress: (progress: SpeedTestProgress) => void
  ): Promise<SpeedTestResult> {
    if (this.isRunning) {
      throw new Error('Speed test already running');
    }

    this.isRunning = true;
    
    try {
      // Simulate ping test
      onProgress({ phase: 'ping', progress: 10 });
      await this.delay(1000);
      const pingMs = this.simulatePing(technology);

      // Simulate download test
      onProgress({ phase: 'download', progress: 20 });
      const downloadMbps = await this.simulateDownload(technology, onProgress);

      // Simulate upload test
      onProgress({ phase: 'upload', progress: 70 });
      const uploadMbps = await this.simulateUpload(technology, onProgress);

      // Calculate jitter
      const jitterMs = Math.random() * 10 + 1;

      onProgress({ phase: 'complete', progress: 100 });

      const result: SpeedTestResult = {
        downloadMbps: Math.round(downloadMbps * 100) / 100,
        uploadMbps: Math.round(uploadMbps * 100) / 100,
        pingMs: Math.round(pingMs),
        jitterMs: Math.round(jitterMs * 100) / 100,
        technology,
        timestamp: new Date().toISOString()
      };

      return result;
    } finally {
      this.isRunning = false;
    }
  }

  private async simulateDownload(
    technology: string,
    onProgress: (progress: SpeedTestProgress) => void
  ): Promise<number> {
    const maxSpeed = this.getMaxSpeed(technology, 'download');
    let currentSpeed = 0;
    
    // Simulate gradual speed increase
    for (let i = 20; i <= 60; i += 5) {
      currentSpeed = maxSpeed * (Math.random() * 0.4 + 0.6); // 60-100% of max
      onProgress({ 
        phase: 'download', 
        progress: i, 
        currentSpeed 
      });
      await this.delay(300);
    }

    return currentSpeed;
  }

  private async simulateUpload(
    technology: string,
    onProgress: (progress: SpeedTestProgress) => void
  ): Promise<number> {
    const maxSpeed = this.getMaxSpeed(technology, 'upload');
    let currentSpeed = 0;
    
    // Simulate gradual speed increase
    for (let i = 70; i <= 95; i += 5) {
      currentSpeed = maxSpeed * (Math.random() * 0.4 + 0.6); // 60-100% of max
      onProgress({ 
        phase: 'upload', 
        progress: i, 
        currentSpeed 
      });
      await this.delay(300);
    }

    return currentSpeed;
  }

  private simulatePing(technology: string): number {
    const basePing = {
      '5G': 15,
      '4G': 30,
      '3G': 80,
      '2G': 200
    };

    const base = basePing[technology as keyof typeof basePing] || 50;
    return base + (Math.random() * 20 - 10); // ±10ms variation
  }

  private getMaxSpeed(technology: string, type: 'download' | 'upload'): number {
    const speeds = {
      '5G': { download: 100, upload: 50 },
      '4G': { download: 50, upload: 20 },
      '3G': { download: 10, upload: 2 },
      '2G': { download: 0.5, upload: 0.1 }
    };

    const techSpeeds = speeds[technology as keyof typeof speeds] || speeds['4G'];
    return techSpeeds[type];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopTest(): void {
    this.isRunning = false;
  }

  isTestRunning(): boolean {
    return this.isRunning;
  }
}

export const speedTestService = new SpeedTestService();