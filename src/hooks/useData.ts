import { useState, useEffect } from 'react'
import apiService from '../services/api'

// Hook for getting all states
export function useStates(params?: {
  region?: string;
  isUT?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  search?: string;
}) {
  const [states, setStates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getStates(params)
        setStates(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load states')
        console.error('Error loading states:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStates()
  }, [params])

  return { states, loading, error }
}

// Hook for getting a specific state
export function useStateById(stateId: string) {
  const [state, setState] = useState<any | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadState = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getState(stateId)
        setState(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load state')
        console.error('Error loading state:', err)
      } finally {
        setLoading(false)
      }
    }

    if (stateId) {
      loadState()
    }
  }, [stateId])

  return { state, loading, error }
}

// Hook for getting all topics
export function useTopics(params?: {
  category?: string;
  active?: boolean;
}) {
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getTopics(params)
        setTopics(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topics')
        console.error('Error loading topics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [params])

  return { topics, loading, error }
}

// Hook for getting a specific topic
export function useTopic(topicId: string) {
  const [topic, setTopic] = useState<any | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getTopic(topicId)
        setTopic(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic')
        console.error('Error loading topic:', err)
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadTopic()
    }
  }, [topicId])

  return { topic, loading, error }
}

// Hook for getting fun facts
export function useFunFacts(params?: {
  topic_id?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  const [funFacts, setFunFacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFunFacts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getFunFacts(params)
        setFunFacts(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fun facts')
        console.error('Error loading fun facts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFunFacts()
  }, [params])

  return { funFacts, loading, error }
}

// Hook for getting statistics
export function useStatistics(params?: {
  state_id?: string;
  topic_id?: string;
  year?: number;
  metric_name?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const [statistics, setStatistics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  })

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getStatistics(params)
        setStatistics(response.data)
        setPagination({
          total: response.total || 0,
          page: response.page || 1,
          pages: response.pages || 1
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics')
        console.error('Error loading statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params?.topic_id) {
      loadStatistics()
    }
  }, [params])

  return { statistics, loading, error, pagination }
}

// Hook for getting top performing states
export function useTopStates(topicId: string, metric: string, limit: number = 5, year?: number) {
  const [topStates, setTopStates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopStates = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getTopPerformers(topicId, metric, year, limit)
        setTopStates(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load top states')
        console.error('Error loading top states:', err)
      } finally {
        setLoading(false)
      }
    }

    if (topicId && metric) {
      loadTopStates()
    }
  }, [topicId, metric, limit, year])

  return { topStates, loading, error }
}

// Hook for getting state comparisons
export function useStateComparison(stateIds: string[], topicId: string, year: number = 2023, metricName?: string) {
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComparison = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (metricName) {
          const response = await apiService.compareStates(topicId, metricName, year, stateIds)
          setComparisonData(response.data || [])
        } else {
          // If no specific metric, get all statistics for the states and topic
          const response = await apiService.getStatistics({
            topic_id: topicId,
            year,
            state_id: stateIds.join(',')
          })
          setComparisonData(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparison data')
        console.error('Error loading comparison data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (stateIds.length > 0 && topicId) {
      loadComparison()
    }
  }, [stateIds, topicId, year, metricName])

  return { comparisonData, loading, error }
}

// Hook for getting national averages
export function useNationalAverage(topicId: string, metric: string, year?: number) {
  const [nationalAverage, setNationalAverage] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNationalAverage = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getNationalAverage(topicId, metric, year)
        setNationalAverage(response.data?.average || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load national average')
        console.error('Error loading national average:', err)
      } finally {
        setLoading(false)
      }
    }

    if (topicId && metric) {
      loadNationalAverage()
    }
  }, [topicId, metric, year])

  return { nationalAverage, loading, error }
}

// Hook for getting trend data
export function useTrendData(stateId: string, topicId: string, metric: string, years: number[] = [2020, 2021, 2022, 2023]) {
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        setLoading(true)
        setError(null)
        const startYear = Math.min(...years)
        const endYear = Math.max(...years)
        const response = await apiService.getTrendData(stateId, topicId, metric, startYear, endYear)
        setTrendData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trend data')
        console.error('Error loading trend data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (stateId && topicId && metric) {
      loadTrendData()
    }
  }, [stateId, topicId, metric, years])

  return { trendData, loading, error }
}

// Hook for getting state details with statistics
export function useStateDetails(stateId: string) {
  const { state, loading: stateLoading, error: stateError } = useStateById(stateId)
  const { topics, loading: topicsLoading } = useTopics()
  const [stateStats, setStateStats] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStateStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const stats: Record<string, any> = {}
        
        for (const topic of topics) {
          const response = await apiService.getStateStatistics(stateId, undefined, topic.id)
          stats[topic.id] = response.data
        }
        
        setStateStats(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load state statistics')
        console.error('Error loading state statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    if (stateId && topics.length > 0) {
      loadStateStats()
    }
  }, [stateId, topics])

  return { 
    state, 
    stateStats, 
    loading: stateLoading || topicsLoading || loading,
    error: stateError || error
  }
}

// Hook for getting topic details with statistics
export function useTopicDetails(topicId: string) {
  const { topic, loading: topicLoading, error: topicError } = useTopic(topicId)
  const { states, loading: statesLoading } = useStates()
  const [topicStats, setTopicStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopicStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiService.getStatistics({ topic_id: topicId })
        setTopicStats(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic statistics')
        console.error('Error loading topic statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    if (topicId && states.length > 0) {
      loadTopicStats()
    }
  }, [topicId, states])

  return { 
    topic, 
    topicStats, 
    loading: topicLoading || statesLoading || loading,
    error: topicError || error
  }
}

// Hook for getting featured fun facts
export function useFeaturedFunFacts(limit?: number) {
  const [funFacts, setFunFacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedFunFacts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getFeaturedFunFacts(limit)
        setFunFacts(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured fun facts')
        console.error('Error loading featured fun facts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedFunFacts()
  }, [limit])

  return { funFacts, loading, error }
}

// Hook for getting random fun fact
export function useRandomFunFact(topicId?: string) {
  const [funFact, setFunFact] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Set a new refresh key on component mount to ensure fresh data on page refresh
    setRefreshKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    const loadRandomFunFact = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getRandomFunFact(topicId)
        setFunFact(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load random fun fact')
        console.error('Error loading random fun fact:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRandomFunFact()
  }, [topicId, refreshKey]) // Include refreshKey to trigger on page refresh

  return { funFact, loading, error }
} 