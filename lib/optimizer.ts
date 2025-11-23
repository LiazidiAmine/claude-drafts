import { VacationPeriod, VacationRequest, OptimizationResult } from '@/types'
import { isWorkDay, countWorkDays, countTotalDays } from './holidays'

/**
 * Vérifie si une date est bloquée par l'utilisateur
 */
function isDateBlocked(date: Date, blockedDates: Date[]): boolean {
  return blockedDates.some(blocked =>
    blocked.getDate() === date.getDate() &&
    blocked.getMonth() === date.getMonth() &&
    blocked.getFullYear() === date.getFullYear()
  )
}

/**
 * Compte le nombre de jours ouvrables dans une période, en excluant les dates bloquées
 */
function countWorkDaysExcludingBlocked(
  startDate: Date,
  endDate: Date,
  blockedDates: Date[]
): number {
  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    if (isWorkDay(current) && !isDateBlocked(current, blockedDates)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Vérifie si une période contient des dates bloquées
 */
function periodContainsBlockedDates(
  startDate: Date,
  endDate: Date,
  blockedDates: Date[]
): boolean {
  const current = new Date(startDate)

  while (current <= endDate) {
    if (isDateBlocked(current, blockedDates)) {
      return true
    }
    current.setDate(current.getDate() + 1)
  }

  return false
}

/**
 * Trouve toutes les périodes possibles qui maximisent l'efficacité des congés
 * Stratégie: chercher les périodes qui incluent des weekends et jours fériés
 */
export function optimizeVacation(request: VacationRequest): OptimizationResult {
  const { rangeStart, rangeEnd, availableDays, minDaysOff, blockedDates } = request
  const suggestions: VacationPeriod[] = []

  // Validation
  if (availableDays <= 0) {
    return {
      suggestions: [],
      message: "Vous devez avoir au moins 1 jour de congé disponible."
    }
  }

  if (rangeStart > rangeEnd) {
    return {
      suggestions: [],
      message: "La date de début doit être antérieure à la date de fin."
    }
  }

  // Stratégie 1: Trouver les périodes autour des jours fériés
  // On va chercher toutes les combinaisons possibles de périodes continues

  const maxDuration = 30 // Maximum 30 jours consécutifs à analyser
  const current = new Date(rangeStart)

  while (current <= rangeEnd) {
    // Pour chaque date de départ possible
    for (let duration = 1; duration <= maxDuration; duration++) {
      const periodEnd = new Date(current)
      periodEnd.setDate(periodEnd.getDate() + duration - 1)

      // Vérifier que la période ne dépasse pas la plage demandée
      if (periodEnd > rangeEnd) break

      // Vérifier que la période ne contient pas de dates bloquées
      if (periodContainsBlockedDates(current, periodEnd, blockedDates)) {
        continue
      }

      // Calculer les métriques
      const workDaysNeeded = countWorkDaysExcludingBlocked(current, periodEnd, blockedDates)
      const totalDaysOff = countTotalDays(current, periodEnd)

      // Vérifier si on a assez de jours de congés disponibles
      if (workDaysNeeded > 0 && workDaysNeeded <= availableDays) {
        // Vérifier le minimum de jours off si spécifié
        if (minDaysOff && totalDaysOff < minDaysOff) {
          continue
        }

        const efficiency = totalDaysOff / workDaysNeeded

        suggestions.push({
          startDate: new Date(current),
          endDate: new Date(periodEnd),
          workDaysToTake: workDaysNeeded,
          totalDaysOff: totalDaysOff,
          efficiency: efficiency
        })
      }
    }

    // Avancer d'un jour
    current.setDate(current.getDate() + 1)
  }

  // Trier par efficacité décroissante
  suggestions.sort((a, b) => {
    // D'abord par efficacité
    if (b.efficiency !== a.efficiency) {
      return b.efficiency - a.efficiency
    }
    // Ensuite par nombre total de jours off
    return b.totalDaysOff - a.totalDaysOff
  })

  // Filtrer pour éviter les doublons et périodes très similaires
  const filteredSuggestions: VacationPeriod[] = []
  const minDifference = 3 // jours minimum de différence entre suggestions

  for (const suggestion of suggestions) {
    const isSimilar = filteredSuggestions.some(existing => {
      const startDiff = Math.abs(
        suggestion.startDate.getTime() - existing.startDate.getTime()
      ) / (1000 * 60 * 60 * 24)
      return startDiff < minDifference
    })

    if (!isSimilar && filteredSuggestions.length < 5) {
      filteredSuggestions.push(suggestion)
    }
  }

  // Si aucune suggestion trouvée
  if (filteredSuggestions.length === 0) {
    let message = "Aucune période optimale trouvée avec vos critères."
    if (minDaysOff && minDaysOff > 0) {
      message += ` Essayez de réduire le nombre minimum de jours off (actuellement ${minDaysOff}) ou d'élargir votre plage de dates.`
    } else {
      message += " Essayez d'élargir votre plage de dates ou de débloquer certaines dates."
    }
    return {
      suggestions: [],
      message: message
    }
  }

  return {
    suggestions: filteredSuggestions.slice(0, 5) // Top 5 suggestions
  }
}

/**
 * Formatte une période de congés pour l'affichage
 */
export function formatVacationPeriod(period: VacationPeriod): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  const start = period.startDate.toLocaleDateString('fr-FR', options)
  const end = period.endDate.toLocaleDateString('fr-FR', options)

  return `${start} au ${end}`
}

/**
 * Calcule le ratio d'efficacité en pourcentage
 */
export function getEfficiencyPercentage(efficiency: number): number {
  return Math.round((efficiency - 1) * 100)
}
