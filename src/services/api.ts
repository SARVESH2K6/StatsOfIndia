// API Service for StatsOfIndia Backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pages: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    console.log('API Service initialized with base URL:', this.baseURL);
  }

  // Getter for baseURL
  get apiBaseURL(): string {
    return this.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('Making API request to:', url);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('API request failed:', response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing API connection...');
      const healthCheck = await this.healthCheck();
      console.log('Health check successful:', healthCheck);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Authentication API
  async register(userData: { fullName: string; email: string; password: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Datasets API
  async getDatasets(params?: {
    category?: string;
    state?: string;
    year?: number;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/datasets${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getDataset(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/datasets/${id}`);
  }

  async getDatasetsByCategory(category: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/datasets/categories/${category}`);
  }

  async getDatasetsByState(state: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/datasets/states/${state}`);
  }

  async getPopularDatasets(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/datasets/popular');
  }

  async getRecentDatasets(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/datasets/recent');
  }

  async searchDatasets(query: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/datasets/search?q=${encodeURIComponent(query)}`);
  }

  async downloadDatasetFile(datasetId: string, fileId: string, token: string): Promise<Blob> {
    const url = `${this.baseURL}/datasets/${datasetId}/download/${fileId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    return response.blob();
  }

  async uploadDataset(formData: FormData, token: string): Promise<ApiResponse<any>> {
    const url = `${this.baseURL}/datasets/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Upload failed');
    }
    
    return response.json();
  }

  async deleteDataset(datasetId: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/datasets/${datasetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string; environment: string }> {
    const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
    return response.json();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 