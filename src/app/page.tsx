"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Sparkles, MessageCircle, CheckCircle, User, BookOpen, Image, BookMarked, Heart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatScreen from "./components/ChatScreen"
import LibraryScreen from "./components/LibraryScreen"
import ProfileScreen from "./components/ProfileScreen"
import EbookScreen from "./components/EbookScreen"
import OnboardingScreen from "./components/OnboardingScreen"
import TinderModeScreen from "./components/TinderModeScreen"
import AnalyticsScreen from "./components/AnalyticsScreen"

type Screen = "onboarding" | "dashboard" | "chat" | "library" | "profile" | "ebook" | "tinder" | "analytics"
type ChatMode = "resposta" | "story" | "iniciar" | "feedback"

interface UserProfile {
  name: string
  age: number
  level_self_assessment: string
  primary_difficulties: string[]
  main_goal: string
  preferred_tone: string
  training_preference: string
  privacy_permission: boolean
  terms_accepted: boolean
  completed_onboarding: boolean
  objective: string
  relationship_goal: string
  social_confidence_level: string
  style_preference: string
  priority_goal: string
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [chatMode, setChatMode] = useState<ChatMode>("resposta")
  const [userName, setUserName] = useState<string>("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Verificar se onboarding foi completado
  useEffect(() => {
    const savedProfile = localStorage.getItem("conquista_pro_profile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      setUserName(profile.name || "")
      if (profile.completed_onboarding) {
        setCurrentScreen("dashboard")
      }
    }
  }, [])

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setUserName(profile.name || "")
    localStorage.setItem("conquista_pro_profile", JSON.stringify(profile))
    setCurrentScreen("dashboard")
  }

  const openChat = (mode: ChatMode) => {
    setChatMode(mode)
    setCurrentScreen("chat")
  }

  const goToDashboard = () => setCurrentScreen("dashboard")

  // Se não completou onboarding, mostrar tela de onboarding
  if (currentScreen === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ConquistaPro</h1>
              <p className="text-xs text-gray-500">Seu assistente de jogo social</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("analytics")}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <BarChart3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("tinder")}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <Heart className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Tinder</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("ebook")}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <BookMarked className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">E-book</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("library")}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <BookOpen className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Biblioteca</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("profile")}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <User className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Perfil</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {currentScreen === "dashboard" && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {userName ? `E aí, ${userName}!` : "CONQUISTA PRO"}
              </h2>
              <p className="text-lg text-gray-400">
                Seu assistente de jogo social — 24h no seu bolso.
              </p>
            </div>

            {/* Action Cards - Estilo Referência */}
            <div className="space-y-4">
              {/* Card 1 - Responder Mensagens (IA) - UNIFICADO */}
              <div
                onClick={() => openChat("resposta")}
                className="group relative bg-[#111111] rounded-2xl p-6 border-l-4 border-blue-500 hover:bg-[#1A1A1A] transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Responder Mensagens (IA)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Digite a mensagem ou envie print da conversa para análise completa e sugestões.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Digitar</span>
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">Enviar Print</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Story Attack */}
              <div
                onClick={() => openChat("story")}
                className="group relative bg-[#111111] rounded-2xl p-6 border-l-4 border-yellow-500 hover:bg-[#1A1A1A] transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-yellow-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Modo Story Attack</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Ideias imediatas para responder stories de forma atraente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Iniciar Conversa */}
              <div
                onClick={() => openChat("iniciar")}
                className="group relative bg-[#111111] rounded-2xl p-6 border-l-4 border-green-500 hover:bg-[#1A1A1A] transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Abrir Conversa do Zero</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Não sabe como começar? Receba opções personalizadas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Feedback */}
              <div
                onClick={() => openChat("feedback")}
                className="group relative bg-[#111111] rounded-2xl p-6 border-l-4 border-orange-500 hover:bg-[#1A1A1A] transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-orange-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-bold">Análise de Abordagem</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Está fazendo certo? Receba feedback honesto e direto.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-8">
              <p className="text-sm text-gray-500">
                💬 Toque em qualquer card para começar
              </p>
            </div>
          </div>
        )}

        {currentScreen === "chat" && (
          <ChatScreen mode={chatMode} onBack={goToDashboard} />
        )}

        {currentScreen === "library" && (
          <LibraryScreen onBack={goToDashboard} />
        )}

        {currentScreen === "profile" && (
          <ProfileScreen onBack={goToDashboard} onSave={setUserName} />
        )}

        {currentScreen === "ebook" && (
          <EbookScreen onBack={goToDashboard} />
        )}

        {currentScreen === "tinder" && (
          <TinderModeScreen onBack={goToDashboard} />
        )}

        {currentScreen === "analytics" && (
          <AnalyticsScreen onBack={goToDashboard} />
        )}
      </main>
    </div>
  )
}
