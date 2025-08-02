import { State, Topic, Statistic, Comparison } from './database-schema'

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export function formatNumber(value: number, unit: string = ''): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B${unit}`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M${unit}`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K${unit}`
  } else {
    return `${value.toFixed(1)}${unit}`
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatCurrency(value: number, currency: string = '₹'): string {
  if (value >= 1000000000) {
    return `${currency}${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${currency}${(value / 1000).toFixed(1)}K`
  } else {
    return `${currency}${value.toFixed(0)}`
  }
}

export function formatPopulation(population: number): string {
  return formatNumber(population)
}

export function formatArea(area: number): string {
  return `${formatNumber(area)} km²`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round((sum / values.length) * 100) / 100
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0
  
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  } else {
    return sorted[middle]
  }
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0
  
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

export function calculateRank(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => b - a)
  return sorted.findIndex(v => v <= value) + 1
}

export function calculateDensity(population: number, area: number): number {
  if (area === 0) return 0
  return Math.round((population / area) * 100) / 100
}

// ============================================================================
// FILTERING AND SORTING UTILITIES
// ============================================================================

export function filterStatesByRegion(states: State[], region: string): State[] {
  if (!region || region === 'all') return states
  return states.filter(state => state.region === region)
}

export function filterStatesByType(states: State[], isUT: boolean | null): State[] {
  if (isUT === null) return states
  return states.filter(state => state.isUT === isUT)
}

export function sortStatesByPopulation(states: State[], ascending: boolean = false): State[] {
  return [...states].sort((a, b) => {
    return ascending ? a.population - b.population : b.population - a.population
  })
}

export function sortStatesByArea(states: State[], ascending: boolean = false): State[] {
  return [...states].sort((a, b) => {
    return ascending ? a.area - b.area : b.area - a.area
  })
}

export function sortStatisticsByValue(stats: Statistic[], ascending: boolean = false): Statistic[] {
  return [...stats].sort((a, b) => {
    return ascending ? a.value - b.value : b.value - a.value
  })
}

export function getTopPerformers(stats: Statistic[], limit: number = 5): Statistic[] {
  return sortStatisticsByValue(stats).slice(0, limit)
}

export function getBottomPerformers(stats: Statistic[], limit: number = 5): Statistic[] {
  return sortStatisticsByValue(stats, true).slice(0, limit)
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

export function groupStatisticsByState(stats: Statistic[]): Record<string, Statistic[]> {
  return stats.reduce((groups, stat) => {
    if (!groups[stat.state_id]) {
      groups[stat.state_id] = []
    }
    groups[stat.state_id].push(stat)
    return groups
  }, {} as Record<string, Statistic[]>)
}

export function groupStatisticsByMetric(stats: Statistic[]): Record<string, Statistic[]> {
  return stats.reduce((groups, stat) => {
    if (!groups[stat.metric_name]) {
      groups[stat.metric_name] = []
    }
    groups[stat.metric_name].push(stat)
    return groups
  }, {} as Record<string, Statistic[]>)
}

export function transformToChartData(stats: Statistic[], groupBy: 'state' | 'metric' = 'state'): any[] {
  if (groupBy === 'state') {
    const grouped = groupStatisticsByState(stats)
    return Object.entries(grouped).map(([stateId, stateStats]) => {
      const dataPoint: any = { stateId }
      stateStats.forEach(stat => {
        dataPoint[stat.metric_name] = stat.value
      })
      return dataPoint
    })
  } else {
    const grouped = groupStatisticsByMetric(stats)
    return Object.entries(grouped).map(([metricName, metricStats]) => {
      const dataPoint: any = { metric: metricName }
      metricStats.forEach(stat => {
        dataPoint[stat.state_id] = stat.value
      })
      return dataPoint
    })
  }
}

export function createComparisonData(stats: Statistic[], primaryMetric: string): Comparison[] {
  const metricStats = stats.filter(stat => stat.metric_name === primaryMetric)
  const values = metricStats.map(stat => stat.value)
  const nationalAverage = calculateAverage(values)
  
  return metricStats.map(stat => {
    const rank = calculateRank(stat.value, values)
    const percentile = (rank / values.length) * 100
    
    return {
      id: `${stat.state_id}-${stat.topic_id}-${stat.year}`,
      state_id: stat.state_id,
      topic_id: stat.topic_id,
      year: stat.year,
      primary_value: stat.value,
      growth_rate: 0, // Would need historical data
      national_average: nationalAverage,
      rank,
      percentile: Math.round(percentile * 100) / 100
    }
  })
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function isValidStateId(stateId: string, states: State[]): boolean {
  return states.some(state => state.id === stateId)
}

export function isValidTopicId(topicId: string, topics: Topic[]): boolean {
  return topics.some(topic => topic.id === topicId)
}

export function isValidYear(year: number): boolean {
  return year >= 1950 && year <= new Date().getFullYear()
}

export function validateStatistic(stat: Partial<Statistic>): string[] {
  const errors: string[] = []
  
  if (!stat.state_id) errors.push('State ID is required')
  if (!stat.topic_id) errors.push('Topic ID is required')
  if (!stat.year || !isValidYear(stat.year)) errors.push('Valid year is required')
  if (typeof stat.value !== 'number' || isNaN(stat.value)) errors.push('Valid value is required')
  if (!stat.metric_name) errors.push('Metric name is required')
  if (!stat.unit) errors.push('Unit is required')
  
  return errors
}

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

export function searchStates(states: State[], query: string): State[] {
  if (!query.trim()) return states
  
  const searchTerm = query.toLowerCase()
  return states.filter(state => 
    state.name.toLowerCase().includes(searchTerm) ||
    state.capital.toLowerCase().includes(searchTerm) ||
    state.region.toLowerCase().includes(searchTerm)
  )
}

export function searchTopics(topics: Topic[], query: string): Topic[] {
  if (!query.trim()) return topics
  
  const searchTerm = query.toLowerCase()
  return topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm) ||
    topic.description.toLowerCase().includes(searchTerm) ||
    topic.category.toLowerCase().includes(searchTerm)
  )
}

export function filterStatisticsByYear(stats: Statistic[], year: number): Statistic[] {
  return stats.filter(stat => stat.year === year)
}

export function filterStatisticsByMetric(stats: Statistic[], metricName: string): Statistic[] {
  return stats.filter(stat => stat.metric_name === metricName)
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function exportToCSV(data: any[], filename: string = 'export.csv'): void {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any[], filename: string = 'export.json'): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast'] as const
export const METRIC_TYPES = ['percentage', 'currency', 'number', 'ratio'] as const
export const TIME_PERIODS = ['yearly', 'quarterly', 'monthly'] as const

export const DEFAULT_CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
]

export const CHART_COLORS_BY_TOPIC: Record<string, string> = {
  crime: '#EF4444',
  education: '#3B82F6',
  tourism: '#10B981',
  agriculture: '#F59E0B',
  health: '#8B5CF6',
  economy: '#F97316'
} 