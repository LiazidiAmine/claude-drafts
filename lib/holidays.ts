/**
 * Calcule les jours fériés français pour une année donnée
 * Inclut les jours fériés fixes et mobiles (Pâques, Ascension, Pentecôte)
 */

// Calcul de la date de Pâques (algorithme de Meeus)
function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(year, month - 1, day)
}

// Ajoute des jours à une date
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Retourne tous les jours fériés français pour une année donnée
 */
export function getFrenchHolidays(year: number): Date[] {
  const holidays: Date[] = []

  // Jours fériés fixes
  holidays.push(new Date(year, 0, 1))   // Jour de l'an
  holidays.push(new Date(year, 4, 1))   // Fête du travail
  holidays.push(new Date(year, 4, 8))   // Victoire 1945
  holidays.push(new Date(year, 6, 14))  // Fête nationale
  holidays.push(new Date(year, 7, 15))  // Assomption
  holidays.push(new Date(year, 10, 1))  // Toussaint
  holidays.push(new Date(year, 10, 11)) // Armistice 1918
  holidays.push(new Date(year, 11, 25)) // Noël

  // Jours fériés mobiles basés sur Pâques
  const easter = getEasterDate(year)
  holidays.push(addDays(easter, 1))  // Lundi de Pâques
  holidays.push(addDays(easter, 39)) // Ascension
  holidays.push(addDays(easter, 50)) // Lundi de Pentecôte

  return holidays
}

/**
 * Vérifie si une date est un jour férié français
 */
export function isFrenchHoliday(date: Date): boolean {
  const year = date.getFullYear()
  const holidays = getFrenchHolidays(year)

  return holidays.some(holiday =>
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  )
}

/**
 * Vérifie si une date est un weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Dimanche ou Samedi
}

/**
 * Vérifie si une date est un jour ouvrable (pas weekend, pas férié)
 */
export function isWorkDay(date: Date): boolean {
  return !isWeekend(date) && !isFrenchHoliday(date)
}

/**
 * Compte le nombre de jours ouvrables entre deux dates (inclusif)
 */
export function countWorkDays(startDate: Date, endDate: Date): number {
  let count = 0
  const current = new Date(startDate)

  while (current <= endDate) {
    if (isWorkDay(current)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Compte le nombre total de jours entre deux dates (inclusif)
 */
export function countTotalDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // +1 pour inclure le dernier jour
}
