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

  // States API
  async getStates(params?: {
    region?: string;
    isUT?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    search?: string;
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
    const endpoint = `/states${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getState(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/states/${id}`);
  }

  async getStatesByRegion(region: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/states/region/${region}`);
  }

  async getTopStatesByPopulation(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/states/top/population?limit=${limit}`);
  }

  async getTopStatesByArea(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/states/top/area?limit=${limit}`);
  }

  async getUnionTerritories(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/states/union-territories`);
  }

  // Topics API
  async getTopics(params?: {
    category?: string;
    active?: boolean;
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
    const endpoint = `/topics${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getTopic(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/topics/${id}`);
  }

  async getTopicsByCategory(category: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/topics/category/${category}`);
  }

  // Statistics API
  async getStatistics(params?: {
    state_id?: string;
    topic_id?: string;
    year?: number;
    metric_name?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint) as Promise<PaginatedResponse<any[]>>;
  }

  async getLatestStatistics(topicId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/statistics/latest/${topicId}`);
  }

  async getTopPerformers(topicId: string, metricName: string, year?: number, limit?: number): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics/top-performers/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getTrendData(stateId: string, topicId: string, metricName: string, startYear?: number, endYear?: number): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (startYear) queryParams.append('startYear', startYear.toString());
    if (endYear) queryParams.append('endYear', endYear.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics/trend/${stateId}/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getNationalAverage(topicId: string, metricName: string, year?: number): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics/national-average/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any>(endpoint);
  }

  async compareStates(topicId: string, metricName: string, year?: number, stateIds?: string[]): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (stateIds) queryParams.append('stateIds', stateIds.join(','));
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics/compare/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any>(endpoint);
  }

  async getStateStatistics(stateId: string, year?: number, topicId?: string): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (topicId) queryParams.append('topic_id', topicId);
    
    const queryString = queryParams.toString();
    const endpoint = `/statistics/state/${stateId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  // Fun Facts API
  async getFunFacts(params?: {
    topic_id?: string;
    category?: string;
    featured?: boolean;
    limit?: number;
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
    const endpoint = `/fun-facts${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getFeaturedFunFacts(limit?: number): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/fun-facts/featured${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getRandomFunFact(topicId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (topicId) queryParams.append('topic_id', topicId);
    // Add cache-busting parameter to ensure fresh data on each request
    queryParams.append('_t', Date.now().toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/fun-facts/random?${queryString}`;
    
    return this.request<any>(endpoint);
  }

  async getFunFactsByTopic(topicId: string, limit?: number): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/fun-facts/topic/${topicId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  // Comparisons API
  async getComparison(topicId: string, metricName: string, year?: number, stateIds?: string[]): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year.toString());
    if (stateIds) queryParams.append('stateIds', stateIds.join(','));
    
    const queryString = queryParams.toString();
    const endpoint = `/comparisons/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any>(endpoint);
  }

  // Trends API
  async getTrends(stateId: string, topicId: string, metricName: string, startYear?: number, endYear?: number): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (startYear) queryParams.append('startYear', startYear.toString());
    if (endYear) queryParams.append('endYear', endYear.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/trends/${stateId}/${topicId}/${encodeURIComponent(metricName)}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
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