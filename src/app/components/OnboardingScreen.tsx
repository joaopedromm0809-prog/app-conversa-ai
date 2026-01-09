"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface OnboardingScreenProps {
  onComplete: (profile: UserPersona) => void
}

interface UserPersona {
  // Dados básicos
  name: string
  age: number
  
  // Respostas do onboarding
  level_self_assessment: string
  primary_difficulties: string[]
  main_goal: string
  preferred_tone: string
  training_preference: string
  privacy_permission: boolean
  terms_accepted: boolean
  
  // Metadados
  completed_onboarding: boolean
  onboarding_timestamp: string
  
  // Objetivos derivados
  objective: string
  relationship_goal: string
  social_confidence_level: string
  style_preference: string
  priority_goal: string
}

const questions = [
  {
    id: 0,
    question: "Primeiro, como você se chama?",
    type: "text",
    field: "name",
    placeholder: "Digite seu nome"
  },
  {
    id: 1,
    question: "Qual sua idade?",
    type: "number",
    field: "age",
    placeholder: "Digite sua idade"
  },
  {
    id: 2,
    question: "Como você se considera quando o assunto é conversar com mulheres?",
    type: "single",
    field: "level_self_assessment",
    options: [
      "Muito tímido",
      "Mediano",
      "Travando às vezes",
      "Confiante, mas quero melhorar",
      "Bem desenrolado"
    ]
  },
  {
    id: 3,
    question: "Qual sua maior dificuldade hoje?",
    type: "multi",
    field: "primary_difficulties",
    options: [
      "Iniciar conversas",
      "Manter o papo",
      "Saber o que responder",
      "Interpretar sinais",
      "Marcar encontro"
    ]
  },
  {
    id: 4,
    question: "O que você quer alcançar primeiro?",
    type: "single",
    field: "main_goal",
    options: [
      "Conquistar alguém específico",
      "Aumentar meus matches",
      "Perder a timidez",
      "Ser mais sedutor",
      "Melhorar minhas mensagens"
    ]
  },
  {
    id: 5,
    question: "Qual estilo de conversa combina mais com você?",
    type: "single",
    field: "preferred_tone",
    options: [
      "Leve",
      "Engraçado",
      "Sedutor",
      "Direto",
      "Casual"
    ]
  },
  {
    id: 6,
    question: "Como você prefere trabalhar confiança/aparência?",
    type: "single",
    field: "training_preference",
    options: [
      "Treino em casa",
      "Treino na academia",
      "Não quero agora",
      "Talvez mais tarde"
    ]
  },
  {
    id: 7,
    question: "Podemos usar suas respostas para personalizar suas sugestões?",
    type: "single",
    field: "privacy_permission",
    options: ["Sim", "Não"]
  },
  {
    id: 8,
    question: "Você aceita enviar prints apenas para análise da IA?",
    type: "single",
    field: "terms_accepted",
    options: ["Aceito", "Não aceito"]
  }
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({
    primary_difficulties: []
  })
  const [showSummary, setShowSummary] = useState(false)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleTextInput = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.field]: value })
  }

  const handleNumberInput = (value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num > 0 && num < 120) {
      setAnswers({ ...answers, [currentQuestion.field]: num })
    }
  }

  const handleSingleSelect = (value: string) => {
    const field = currentQuestion.field
    const newAnswers = { ...answers }
    
    if (field === "privacy_permission" || field === "terms_accepted") {
      newAnswers[field] = value === "Sim" || value === "Aceito"
    } else {
      newAnswers[field] = value
    }
    
    setAnswers(newAnswers)

    // Auto-avançar após 300ms
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setShowSummary(true)
      }
    }, 300)
  }

  const handleMultiSelect = (value: string) => {
    const field = currentQuestion.field
    const current = answers[field] || []
    const newValue = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value]
    
    setAnswers({ ...answers, [field]: newValue })
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowSummary(true)
    }
  }

  const canProceed = () => {
    const field = currentQuestion.field
    const value = answers[field]
    
    if (currentQuestion.type === "text") {
      return value && value.trim().length > 0
    }
    if (currentQuestion.type === "number") {
      return value && value > 0
    }
    if (currentQuestion.type === "multi") {
      return value && value.length > 0
    }
    return true
  }

  const handleFinish = () => {
    const profile: UserPersona = {
      name: answers.name || "",
      age: answers.age || 0,
      level_self_assessment: answers.level_self_assessment || "",
      primary_difficulties: answers.primary_difficulties || [],
      main_goal: answers.main_goal || "",
      preferred_tone: answers.preferred_tone || "",
      training_preference: answers.training_preference || "",
      privacy_permission: answers.privacy_permission || false,
      terms_accepted: answers.terms_accepted || false,
      completed_onboarding: true,
      onboarding_timestamp: new Date().toISOString(),
      
      // Campos derivados
      objective: answers.main_goal || "",
      relationship_goal: answers.main_goal || "",
      social_confidence_level: answers.level_self_assessment || "",
      style_preference: answers.preferred_tone || "",
      priority_goal: answers.main_goal || ""
    }
    onComplete(profile)
  }

  const getSummary = () => {
    return {
      nome: answers.name || "Não informado",
      idade: answers.age || "Não informada",
      nivel: answers.level_self_assessment || "Não informado",
      dificuldades: answers.primary_difficulties?.join(", ") || "Nenhuma",
      objetivo: answers.main_goal || "Não informado",
      estilo: answers.preferred_tone || "Não informado",
      treino: answers.training_preference || "Não informado"
    }
  }

  if (showSummary) {
    const summary = getSummary()
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-[#1A1A1A] border-gray-800 p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Perfil Completo!</h2>
              <p className="text-gray-400">Aqui está um resumo das suas respostas:</p>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg p-6 space-y-3 text-left">
              <div>
                <span className="text-gray-500 text-sm">Nome:</span>
                <p className="text-white font-medium">{summary.nome}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Idade:</span>
                <p className="text-white font-medium">{summary.idade}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Nível:</span>
                <p className="text-white font-medium">{summary.nivel}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Dificuldades:</span>
                <p className="text-white font-medium">{summary.dificuldades}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Objetivo Principal:</span>
                <p className="text-white font-medium">{summary.objetivo}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Estilo de Conversa:</span>
                <p className="text-white font-medium">{summary.estilo}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Preferência de Treino:</span>
                <p className="text-white font-medium">{summary.treino}</p>
              </div>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              Finalizar Onboarding
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#1A1A1A] border-gray-800 p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Pergunta {currentStep + 1} de {questions.length}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Text Input */}
          {currentQuestion.type === "text" && (
            <div className="space-y-4">
              <Input
                type="text"
                value={answers[currentQuestion.field] || ""}
                onChange={(e) => handleTextInput(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="bg-[#0A0A0A] border-gray-800 text-white text-lg p-6"
                autoFocus
              />
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Próxima
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Number Input */}
          {currentQuestion.type === "number" && (
            <div className="space-y-4">
              <Input
                type="number"
                value={answers[currentQuestion.field] || ""}
                onChange={(e) => handleNumberInput(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="bg-[#0A0A0A] border-gray-800 text-white text-lg p-6"
                autoFocus
                min="1"
                max="120"
              />
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Próxima
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Options */}
          {(currentQuestion.type === "single" || currentQuestion.type === "multi") && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = currentQuestion.type === "multi"
                  ? answers[currentQuestion.field]?.includes(option)
                  : answers[currentQuestion.field] === option

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (currentQuestion.type === "multi") {
                        handleMultiSelect(option)
                      } else {
                        handleSingleSelect(option)
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 bg-[#0A0A0A] hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-white">{option}</span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Next Button for Multi-select */}
          {currentQuestion.type === "multi" && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Próxima
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
