"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, Sparkles, MessageSquare, TrendingUp, CheckSquare, Loader2, X, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TinderModeScreenProps {
  onBack: () => void
}

type FeatureId = "profile" | "bio" | "opener" | "screenshot" | "post_match" | "instagram"

export default function TinderModeScreen({ onBack }: TinderModeScreenProps) {
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [input, setInput] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getUserPersona = () => {
    try {
      const saved = localStorage.getItem("conquista_pro_profile")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  const handleSubmit = async (action: string) => {
    if (!input.trim() && !selectedImage) return
    
    setIsLoading(true)
    setResult("")

    try {
      const userPersona = getUserPersona()
      
      const response = await fetch("/api/tinder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          data: {
            context: input,
            imageUrl: selectedImage,
            bio: input,
            currentBio: input,
            herProfile: input,
            herInterests: input,
            photos: input
          },
          userPersona
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data.result || "Não consegui processar isso.")
    } catch (error) {
      console.error("Erro:", error)
      setResult("Desculpa, tive um problema. Verifica se a chave da OpenAI está configurada!")
    } finally {
      setIsLoading(false)
    }
  }

  const openFeature = (featureId: FeatureId) => {
    setActiveFeature(featureId)
    setInput("")
    setResult("")
    setSelectedImage(null)
  }

  const closeDialog = () => {
    setActiveFeature(null)
    setInput("")
    setResult("")
    setSelectedImage(null)
  }

  const features = [
    {
      id: "profile" as FeatureId,
      icon: Camera,
      title: "Analisar meu perfil",
      description: "Envie 1 a 3 fotos e receba análise completa da IA",
      color: "blue",
      action: "analyze_profile",
      placeholder: "Descreva suas fotos ou envie prints do seu perfil..."
    },
    {
      id: "bio" as FeatureId,
      icon: Sparkles,
      title: "Melhorar bio",
      description: "IA cria bio atraente baseada no seu perfil",
      color: "purple",
      action: "improve_bio",
      placeholder: "Cole sua bio atual ou descreva seus interesses..."
    },
    {
      id: "opener" as FeatureId,
      icon: MessageSquare,
      title: "Criar abertura perfeita",
      description: "Gere 5 aberturas personalizadas para matches",
      color: "green",
      action: "create_opener",
      placeholder: "Descreva o perfil dela (bio, fotos, interesses)..."
    },
    {
      id: "screenshot" as FeatureId,
      icon: Camera,
      title: "Enviar print para avaliação",
      description: "IA analisa seu perfil ou conversa via screenshot",
      color: "cyan",
      action: "analyze_screenshot",
      placeholder: "Envie um print do seu perfil ou conversa..."
    },
    {
      id: "post_match" as FeatureId,
      icon: TrendingUp,
      title: "Gerar mensagem pós-match",
      description: "Estratégias para manter conversa fluindo",
      color: "orange",
      action: "post_match_message",
      placeholder: "Descreva o match (perfil dela, contexto)..."
    },
    {
      id: "instagram" as FeatureId,
      icon: Instagram,
      title: "Como pedir Instagram",
      description: "Formas naturais de puxar para Instagram",
      color: "pink",
      action: "ask_instagram",
      placeholder: "Descreva o contexto da conversa..."
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      blue: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-500", glow: "bg-blue-500/5" },
      purple: { border: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-500", glow: "bg-purple-500/5" },
      green: { border: "border-green-500", bg: "bg-green-500/10", text: "text-green-500", glow: "bg-green-500/5" },
      orange: { border: "border-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", glow: "bg-orange-500/5" },
      cyan: { border: "border-cyan-500", bg: "bg-cyan-500/10", text: "text-cyan-500", glow: "bg-cyan-500/5" },
      pink: { border: "border-pink-500", bg: "bg-pink-500/10", text: "text-pink-500", glow: "bg-pink-500/5" }
    }
    return colors[color] || colors.blue
  }

  const currentFeature = features.find(f => f.id === activeFeature)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
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
          <h2 className="text-2xl font-bold">Modo Tinder</h2>
          <p className="text-sm text-gray-400">Maximize seus matches e converta conversas em encontros</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/30 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Otimize seu perfil e conquiste mais matches
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Use a inteligência artificial para analisar seu perfil, criar bios atraentes, 
              gerar aberturas personalizadas e desenvolver estratégias completas para converter 
              matches em encontros reais.
            </p>
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon
          const colors = getColorClasses(feature.color)
          
          return (
            <div
              key={feature.id}
              onClick={() => openFeature(feature.id)}
              className="group relative bg-[#111111] rounded-2xl p-6 border-l-4 hover:bg-[#1A1A1A] transition-all cursor-pointer overflow-hidden"
              style={{ borderLeftColor: `var(--${feature.color}-500)` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${colors.glow} rounded-full blur-3xl group-hover:opacity-100 opacity-50 transition-all`} />
              <div className="relative flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <Card className="bg-[#1A1A1A] border-gray-800 p-6 mt-8">
        <h3 className="text-lg font-bold mb-4">📋 Checklist do Match Perfeito</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong className="text-gray-300">Foto Principal:</strong> Use a que transmite mais confiança e naturalidade</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong className="text-gray-300">Bio Atraente:</strong> Seja autêntico, mostre personalidade e interesses</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong className="text-gray-300">Primeira Mensagem:</strong> Personalize baseado no perfil dela</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong className="text-gray-300">Follow-up:</strong> Mantenha conversa fluindo sem parecer forçado</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong className="text-gray-300">Transição:</strong> Puxe para WhatsApp no momento certo</span>
          </div>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={!!activeFeature} onOpenChange={closeDialog}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{currentFeature?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input Area */}
            <div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentFeature?.placeholder}
                className="bg-[#0A0A0A] border-gray-800 text-white min-h-[120px]"
                disabled={isLoading}
              />
            </div>

            {/* Image Upload */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-[#0A0A0A] border-gray-800 hover:bg-[#2A2A2A]"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Enviar Print
              </Button>
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="relative inline-block">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="h-32 rounded-lg border-2 border-blue-500"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={() => handleSubmit(currentFeature?.action || "")}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar com IA
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <Card className="bg-[#0A0A0A] border-gray-800 p-4">
                <h4 className="font-bold mb-2 text-green-400">Resultado:</h4>
                <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {result}
                </p>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
