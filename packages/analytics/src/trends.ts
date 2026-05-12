import { subDays, subMonths, format } from 'date-fns'

export interface TrendPoint {
  date: string
  value: number
}

export class TrendAnalyzer {
  generateDateRange(days: number): Date[] {
    const dates: Date[] = []
    for (let i = days - 1; i >= 0; i--) {
      dates.push(subDays(new Date(), i))
    }
    return dates
  }

  formatTrendData(dates: Date[], values: number[]): TrendPoint[] {
    return dates.map((date, index) => ({
      date: format(date, 'dd/MM'),
      value: values[index] || 0,
    }))
  }

  detectAnomaly(value: number, average: number, stdDev: number): boolean {
    return Math.abs(value - average) > 2 * stdDev
  }

  calculateStandardDeviation(values: number[]): number {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - avg, 2))
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(variance)
  }
}
