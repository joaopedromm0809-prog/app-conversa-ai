"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, MessageSquare, Calendar, Target, Award, Clock, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AnalyticsScreenProps {
  onBack: () => void
}

interface AnalyticsData {
  total_matches: number
  messages_sent: number
  responses_received: number
  conversations_active: number
  meetings_scheduled: number
  success_rate: number
  average_response_time: string
  engagement_score: number
  confidence_progress: number
}

type TimelineEventType = "match" | "message" | "meeting" | "achievement"
type TimelineIconKey = "calendar" | "message" | "target" | "award" | "trending" | "zap" | "clock"

interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  timestamp: string
  iconKey: TimelineIconKey
  color: string
}

const timelineIcons: Record<TimelineIconKey, LucideIcon> = {
  calendar: Calendar,
  message: MessageSquare,
  target: Target,
  award: Award,
  trending: TrendingUp,
  zap: Zap,
  clock: Clock
}

export default function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_matches: 0,
    messages_sent: 0,
    responses_received: 0,
    conversations_active: 0,
    meetings_scheduled: 0,
    success_rate: 0,
    average_response_time: "0h",
    engagement_score: 0,
    confidence_progress: 0
  })

  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const savedAnalytics = localStorage.getItem("conquista_pro_analytics")
    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics))
    }

    const savedTimeline = localStorage.getItem("conquista_pro_timeline")
    if (savedTimeline) {
      setTimeline(JSON.parse(savedTimeline))
    }
  }, [])

  const addMeeting = () => {
    const newMeetings = analytics.meetings_scheduled + 1
    const newAnalytics = { ...analytics, meetings_scheduled: newMeetings }
    setAnalytics(newAnalytics)
    localStorage.setItem("conquista_pro_analytics", JSON.stringify(newAnalytics))

    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      type: "meeting",
      title: "Encontro Marcado",
      description: "Você marcou um novo encontro!",
      timestamp: new Date().toISOString(),
      iconKey: "calendar",
      color: "green"
    }

    const newTimeline = [newEvent, ...timeline]
    setTimeline(newTimeline)
    localStorage.setItem("conquista_pro_timeline", JSON.stringify(newTimeline))
  }

  const getInsights = () => {
    const insights: string[] = []

    if (analytics.success_rate > 70) {
      insights.push("🔥 Você está arrasando! Taxa de sucesso acima de 70%")
    } else if (analytics.success_rate > 40) {
      insights.push("💪 Bom trabalho! Continue assim para melhorar ainda mais")
    } else {
      insights.push("📈 Foque em personalizar suas mensagens para aumentar a taxa de resposta")
    }

    if (analytics.conversations_active > 5) {
      insights.push("⚡ Você tem várias conversas ativas! Mantenha o ritmo")
    }

    if (analytics.meetings_scheduled === 0) {
      insights.push("🎯 Próximo passo: marque seu primeiro encontro!")
    }

    return insights
  }

  const getRecommendations = () => {
    const recommendations: string[] = []

    if (analytics.messages_sent > analytics.responses_received * 2) {
      recommendations.push("Revise suas aberturas - você está enviando mais do que recebendo respostas")
    }

    if (analytics.conversations_active < 3) {
      recommendations.push("Aumente suas conversas ativas para ter mais oportunidades")
    }

    if (analytics.meetings_scheduled < analytics.conversations_active / 5) {
      recommendations.push("Tente converter mais conversas em encontros reais")
    }

    return recommendations
  }

  const statCards: { label: string; value: string | number; icon: LucideIcon; color: string }[] = [
    { label: "Total de Matches", value: analytics.total_matches, icon: Target, color: "blue" },
    { label: "Mensagens Enviadas", value: analytics.messages_sent, icon: MessageSquare, color: "purple" },
    { label: "Respostas Recebidas", value: analytics.responses_received, icon: TrendingUp, color: "green" },
    { label: "Conversas Ativas", value: analytics.conversations_active, icon: Zap, color: "yellow" },
    { label: "Encontros Marcados", value: analytics.meetings_scheduled, icon: Calendar, color: "orange" },
    { label: "Taxa de Sucesso", value: `${analytics.success_rate}%`, icon: Award, color: "cyan" }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
      green: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
      yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" },
      orange: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
      cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-400 hover:text-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Acompanhamento & Analytics</h2>
          <p className="text-sm text-gray-400">Monitore seu progresso e resultados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colors = getColorClasses(stat.color)

          return (
            <Card key={index} className={`bg-[#1A1A1A] border ${colors.border} p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Insights Automáticos
        </h3>
        <div className="space-y-2">
          {getInsights().map((insight, index) => (
            <p key={index} className="text-gray-300 text-sm">{insight}</p>
          ))}
        </div>
      </Card>

      {getRecommendations().length > 0 && (
        <Card className="bg-[#1A1A1A] border-yellow-500/30 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Recomendações Semanais
          </h3>
          <div className="space-y-2">
            {getRecommendations().map((rec, index) => (
              <p key={index} className="text-gray-300 text-sm">• {rec}</p>
            ))}
          </div>
        </Card>
      )}

      <Card className="bg-[#1A1A1A] border-gray-800 p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={addMeeting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Marcar Encontro
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
            onClick={() => {
              const newAnalytics = {
                ...analytics,
                messages_sent: analytics.messages_sent + 1
              }
              setAnalytics(newAnalytics)
              localStorage.setItem("conquista_pro_analytics", JSON.stringify(newAnalytics))
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Registrar Mensagem
          </Button>
        </div>
      </Card>

      <Card className="bg-[#1A1A1A] border-gray-800 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Linha do Tempo
        </h3>

        {timeline.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Suas atividades aparecerão aqui
          </p>
        ) : (
          <div className="space-y-4">
            {timeline.slice(0, 10).map((event) => {
              const Icon = timelineIcons[event.iconKey] || Clock
              const colors = getColorClasses(event.color)

              return (
                <div key={event.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
