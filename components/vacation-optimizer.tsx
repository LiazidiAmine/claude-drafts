'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { optimizeVacation, formatVacationPeriod, getEfficiencyPercentage } from '@/lib/optimizer'
import { VacationPeriod } from '@/types'
import { Calendar, TrendingUp, Clock, Sparkles, X } from 'lucide-react'

export function VacationOptimizer() {
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [availableDays, setAvailableDays] = useState('')
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [suggestions, setSuggestions] = useState<VacationPeriod[]>([])
  const [message, setMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

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

    // Validation
    if (!rangeStart || !rangeEnd || !availableDays) {
      setMessage("Veuillez remplir tous les champs obligatoires")
      setIsLoading(false)
      return
    }

    const start = new Date(rangeStart)
    const end = new Date(rangeEnd)
    const days = parseInt(availableDays)

    if (isNaN(days) || days <= 0) {
      setMessage("Le nombre de jours doit être un nombre positif")
      setIsLoading(false)
      return
    }

    // Simuler un petit délai pour l'UX
    setTimeout(() => {
      const result = optimizeVacation({
        rangeStart: start,
        rangeEnd: end,
        availableDays: days,
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

              {/* Jours disponibles */}
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {index === 0 ? '🏆 Meilleure' : `#${index + 1}`}
                          </Badge>
                          {getEfficiencyPercentage(suggestion.efficiency) > 50 && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              +{getEfficiencyPercentage(suggestion.efficiency)}% bonus
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {formatVacationPeriod(suggestion)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Jours à poser</p>
                          <p className="text-2xl font-bold text-primary">
                            {suggestion.workDaysToTake}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Jours off totaux</p>
                          <p className="text-2xl font-bold text-green-600">
                            {suggestion.totalDaysOff}
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Efficacité</span>
                          <span className="font-semibold text-primary">
                            {suggestion.efficiency.toFixed(2)}x
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-green-500"
                            style={{
                              width: `${Math.min(suggestion.efficiency * 50, 100)}%`
                            }}
                          />
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

        {/* Informations complémentaires */}
        <Card className="mt-8 shadow-lg bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-gray-700">
            <p>
              ✅ L'optimiseur analyse toutes les périodes possibles dans votre plage de dates
            </p>
            <p>
              ✅ Il prend en compte les weekends et les jours fériés français
            </p>
            <p>
              ✅ Vous obtenez les 5 meilleures suggestions pour maximiser vos jours de repos
            </p>
            <p>
              ✅ L'efficacité montre combien de jours off vous obtenez par jour de congé posé
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
