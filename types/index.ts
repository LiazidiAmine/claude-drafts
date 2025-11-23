export interface VacationPeriod {
  startDate: Date
  endDate: Date
  workDaysToTake: number
  totalDaysOff: number
  efficiency: number // ratio: totalDaysOff / workDaysToTake
}

export interface VacationRequest {
  rangeStart: Date
  rangeEnd: Date
  availableDays: number
  blockedDates: Date[]
}

export interface OptimizationResult {
  suggestions: VacationPeriod[]
  message?: string
}
