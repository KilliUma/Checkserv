export interface MetricData {
  label: string
  value: number
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

export interface TimeSeriesData {
  timestamp: Date
  value: number
}

export class AnalyticsService {
  calculateTrend(current: number, previous: number): MetricData['trend'] {
    if (previous === 0) {
      return { direction: 'stable', percentage: 0 }
    }

    const percentage = ((current - previous) / previous) * 100
    
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
      percentage: Math.abs(percentage),
    }
  }

  aggregateByPeriod(
    data: TimeSeriesData[],
    period: 'day' | 'week' | 'month'
  ): TimeSeriesData[] {
    // Implementação simplificada
    return data
  }

  calculateAverage(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index]
  }
}
