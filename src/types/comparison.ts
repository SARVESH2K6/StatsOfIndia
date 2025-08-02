export interface ComparisonState {
  selectedStates: string[]
  selectedTopic: string
  selectedTimeRange: string
  viewMode: "absolute" | "normalized"
  chartType: "bar" | "line" | "area" | "radar"
}

export interface ComparisonResults {
  chartData: Array<{
    stateId: string
    state: string
    value: number
  }>
  bestPerformer: {
    state: string
    value: number
  }
  worstPerformer: {
    state: string
    value: number
  }
  nationalAverage: string
  primaryMetric: string
  trendData: Array<{
    year: string
    [stateId: string]: any
  }>
  multiMetricData?: Array<{
    metric: string
    [stateId: string]: any
  }>
  radarData?: Array<{
    metric: string
    [stateId: string]: any
  }>
}
