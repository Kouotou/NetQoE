const API_BASE_URL = 'http://192.168.88.126:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  university: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  university: string;
  created_at: string;
}

export interface SessionResponse {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
}

export interface MeasurementData {
  technology: string;
  rssi?: number;
  rsrp?: number;
  sinr?: number;
  cell_id?: number;
  frequency?: number;
  bandwidth?: number;
  pci?: number;
  latitude: number;
  longitude: number;
  recorded_at: string;
}

export interface MosFeedbackData {
  rating: number;
  emotion?: string;
  comment?: string;
  technology?: string;
  latitude: number;
  longitude: number;
}

export interface EventData {
  id: string;
  event_type: string;
  latitude: number;
  longitude: number;
  signal_strength?: number;
  recorded_at: string;
}

export interface SessionData {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  avg_rssi?: number;
  total_distance_km: number;
  drops_count: number;
  handovers_count: number;
  speedtest_count: number;
  error_count: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(error.detail || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Request failed:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Cannot connect to server. Make sure the backend is running.');
      }
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async startSession(): Promise<SessionResponse> {
    return this.request<SessionResponse>('/sessions/start', {
      method: 'POST',
    });
  }

  async uploadMeasurement(sessionId: string, measurement: MeasurementData): Promise<any> {
    return this.request('/upload/batch', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        measurements: [measurement],
        speed_tests: [],
        events: [],
        mos_feedback: []
      }),
    });
  }

  async uploadMosFeedback(sessionId: string, feedback: MosFeedbackData): Promise<any> {
    return this.request('/upload/batch', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        measurements: [],
        speed_tests: [],
        events: [],
        mos_feedback: [feedback]
      }),
    });
  }

  async uploadSpeedTest(sessionId: string, speedTest: any): Promise<any> {
    return this.request('/upload/batch', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        measurements: [],
        speed_tests: [{
          download_mbps: speedTest.downloadMbps,
          upload_mbps: speedTest.uploadMbps,
          ping_ms: speedTest.pingMs,
          jitter_ms: speedTest.jitterMs,
          latitude: 0,
          longitude: 0,
          recorded_at: speedTest.timestamp
        }],
        events: [],
        mos_feedback: []
      }),
    });
  }

  async getUserSessions(): Promise<SessionData[]> {
    return this.request<SessionData[]>('/sessions/user');
  }

  async getSessionEvents(sessionId: string): Promise<EventData[]> {
    return this.request<EventData[]>(`/sessions/${sessionId}/events`);
  }

  async deleteSession(sessionId: string): Promise<any> {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();