'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { optimizeVacation, formatVacationPeriod } from '@/lib/optimizer'
import { VacationPeriod } from '@/types'
import { Calendar, TrendingUp, Clock, Sparkles, X, Info } from 'lucide-react'

export function VacationOptimizer() {
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [availableDays, setAvailableDays] = useState('')
  const [minDaysOff, setMinDaysOff] = useState('')
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [suggestions, setSuggestions] = useState<VacationPeriod[]>([])
  const [message, setMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleAddBlockedDate = () => {
    if (newBlockedDate) {
      const date = new Date(newBlockedDate)
      if (!blockedDates.some(d => d.getTime() === date.getTime())) {
        setBlockedDates([...blockedDates, date])
      }
      setNewBlockedDate('')
    }
  }

  const handleRemoveBlockedDate = (index: number) => {
    setBlockedDates(blockedDates.filter((_, i) => i !== index))
  }

  const handleOptimize = () => {
    setIsLoading(true)
    setMessage(undefined)
    setValidationErrors([])
    const errors: string[] = []

    // Validation des champs obligatoires
    if (!rangeStart || !rangeEnd || !availableDays) {
      setMessage("Veuillez remplir tous les champs obligatoires")
      setIsLoading(false)
      return
    }

    const start = new Date(rangeStart)
    const end = new Date(rangeEnd)
    const days = parseInt(availableDays)
    const minDays = minDaysOff ? parseInt(minDaysOff) : 0

    // Validations
    if (isNaN(days) || days <= 0) {
      errors.push("Le nombre de jours de congés doit être un nombre positif")
    }

    if (start >= end) {
      errors.push("La date de début doit être avant la date de fin")
    }

    if (minDays < 0 || (minDaysOff && isNaN(minDays))) {
      errors.push("Le nombre minimum de jours off doit être un nombre positif ou vide")
    }

    // Validation: La période doit être assez longue pour le minimum de jours off souhaités
    if (minDays > 0) {
      const totalDaysInRange = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      if (minDays > totalDaysInRange) {
        errors.push(`La période sélectionnée (${totalDaysInRange} jours) est trop courte pour obtenir ${minDays} jours off minimum`)
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      setIsLoading(false)
      return
    }

    // Simuler un petit délai pour l'UX
    setTimeout(() => {
      const result = optimizeVacation({
        rangeStart: start,
        rangeEnd: end,
        availableDays: days,
        minDaysOff: minDays,
        blockedDates: blockedDates
      })

      setSuggestions(result.suggestions)
      setMessage(result.message)
      setIsLoading(false)
    }, 500)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Optimiseur de Congés</h1>
          </div>
          <p className="text-lg text-gray-600">
            Maximisez vos jours de repos en minimisant vos jours de congés
          </p>
        </div>

        {/* Guide d'utilisation - Onboarding */}
        <Card className="mb-8 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Comment utiliser cet outil ?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Définissez votre période</h3>
                  <p className="text-sm text-gray-600">
                    Choisissez les dates pendant lesquelles vous souhaitez prendre des congés
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Indiquez vos contraintes</h3>
                  <p className="text-sm text-gray-600">
                    Nombre de jours de congés disponibles et jours off minimum souhaités
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Obtenez les meilleures options</h3>
                  <p className="text-sm text-gray-600">
                    L'outil calcule les périodes optimales incluant weekends et jours fériés
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-blue-200">
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Astuce :</strong> Plus votre période est flexible, meilleures seront les suggestions.
                  L'algorithme prend en compte tous les jours fériés français.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulaire */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Paramètres de recherche</CardTitle>
              <CardDescription>
                Définissez votre période souhaitée et vos contraintes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Période souhaitée */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">Période souhaitée</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Jours disponibles et minimum */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="available-days">Jours de congés disponibles</Label>
                  <Input
                    id="available-days"
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={availableDays}
                    onChange={(e) => setAvailableDays(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Jours que vous pouvez poser</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-days-off">Jours off minimum souhaités</Label>
                  <Input
                    id="min-days-off"
                    type="number"
                    min="1"
                    placeholder="Ex: 7 (optionnel)"
                    value={minDaysOff}
                    onChange={(e) => setMinDaysOff(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Total de jours de repos</p>
                </div>
              </div>

              {/* Dates bloquées */}
              <div className="space-y-2">
                <Label htmlFor="blocked-date">Dates à bloquer (optionnel)</Label>
                <div className="flex gap-2">
                  <Input
                    id="blocked-date"
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddBlockedDate}
                    disabled={!newBlockedDate}
                  >
                    Ajouter
                  </Button>
                </div>
                {blockedDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blockedDates.map((date, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {formatDate(date)}
                        <button
                          onClick={() => handleRemoveBlockedDate(index)}
                          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Erreurs de validation */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="text-red-600 font-semibold text-sm">Erreurs de validation :</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-red-700 list-disc list-inside">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bouton optimiser */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleOptimize}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Optimisation en cours...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Optimiser mes congés
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-4">
            {message && !suggestions.length && (
              <Card className="shadow-lg border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-800">{message}</p>
                </CardContent>
              </Card>
            )}

            {suggestions.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Meilleures suggestions</h2>
                </div>

                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className={`shadow-lg transition-all hover:shadow-xl ${
                      index === 0 ? 'border-primary border-2 ring-2 ring-primary/20' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant={index === 0 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {index === 0 ? '🏆 Meilleure option' : `Option #${index + 1}`}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {formatVacationPeriod(suggestion)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Jours à poser</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {suggestion.workDaysToTake}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">jours de congés</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Jours off totaux</p>
                          <p className="text-3xl font-bold text-green-600">
                            {suggestion.totalDaysOff}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">jours de repos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {!suggestions.length && !message && (
              <Card className="shadow-lg border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Remplissez le formulaire et cliquez sur "Optimiser" pour voir les suggestions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
