"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Loader2, Image, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

type ChatMode = "resposta" | "story" | "iniciar" | "feedback"

interface Message {
  role: "user" | "assistant"
  content: string
  imageUrl?: string
}

interface ChatScreenProps {
  mode: ChatMode
  onBack: () => void
}

const modeConfig = {
  resposta: {
    title: "Responder Mensagens (IA)",
    placeholder: "Digite a mensagem recebida ou envie um print da conversa...",
    systemPrompt: `Você é um consultor de comunicação e flerte especializado em ajudar homens a responder mensagens de mulheres. 

ANÁLISE OBRIGATÓRIA:
1) 3 sugestões de resposta (natural, confiante e contextual)
2) Detecção de sinais de interesse dela (alto/médio/baixo)
3) Aviso se é momento de PAUSAR mensagens (se ele está sendo muito insistente)
4) Justificativa curta para cada sugestão

POLÍTICAS:
- Permitido: conversa social e sedução nível médio
- Proibido: conteúdo sexual explícito, assédio grave, chantagem
- Se contexto insuficiente: peça mais informações

Seja confiante, leve e focado em aumentar as chances dele de forma respeitosa.`
  },
  story: {
    title: "Modo Story Attack",
    placeholder: "Descreva o story que ela postou (foto, texto, música, etc) ou envie print...",
    systemPrompt: `Você é um consultor de comunicação e flerte especializado em ajudar homens a responder stories de mulheres.

ENTREGA OBRIGATÓRIA:
1) 1 abordagem principal + 2 variações
2) Tom adaptado ao estilo do usuário (leve, engraçado, sedutor, direto, casual)
3) Análise de interesse e recomendação de timing

POLÍTICAS:
- Seja criativo, leve e confiante
- Evite respostas genéricas
- Sugira respostas que chamem atenção de forma positiva e natural
- Se contexto insuficiente: peça mais detalhes sobre o story`
  },
  iniciar: {
    title: "Abrir Conversa do Zero",
    placeholder: "Me conte sobre ela: nome, onde se conheceram, o que você sabe sobre ela...",
    systemPrompt: `Você é um consultor de comunicação e flerte especializado em ajudar homens a iniciar conversas com mulheres.

ENTREGA OBRIGATÓRIA:
1) 1 abertura principal + 2 alternativas
2) Próximos 3 passos da conversa
3) Sinais de interesse para observar
4) Quando pausar mensagens (evitar ser insistente)

POLÍTICAS:
- Seja confiante, natural e focado em criar uma primeira impressão positiva
- Dê sugestões práticas e personalizadas
- Se contexto insuficiente: peça mais informações sobre ela`
  },
  feedback: {
    title: "Análise de Abordagem",
    placeholder: "Descreva o que você fez ou está pensando em fazer, ou envie print...",
    systemPrompt: `Você é um consultor de comunicação e flerte especializado em dar feedback honesto e construtivo para homens.

ANÁLISE OBRIGATÓRIA:
1) Pontos fortes da abordagem
2) Pontos fracos e o que melhorar
3) Nível de risco (baixo/médio/alto)
4) Resposta ideal para a situação
5) Sinais de interesse dela
6) Aviso de timing (se deve pausar ou continuar)

POLÍTICAS:
- Seja direto, confiante e focado em melhorar a abordagem dele
- Aponte o que está bom e o que pode melhorar
- Evite respostas sem sentido
- Se contexto insuficiente: peça mais detalhes`
  }
}

export default function ChatScreen({ mode, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = modeConfig[mode]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const updateAnalytics = () => {
    try {
      const savedAnalytics = localStorage.getItem("conquista_pro_analytics")
      const analytics = savedAnalytics ? JSON.parse(savedAnalytics) : {
        total_matches: 0,
        messages_sent: 0,
        responses_received: 0,
        conversations_active: 0,
        meetings_scheduled: 0,
        success_rate: 0,
        average_response_time: "0h",
        engagement_score: 0,
        confidence_progress: 0
      }

      analytics.messages_sent += 1
      
      // Calcular taxa de sucesso
      if (analytics.messages_sent > 0) {
        analytics.success_rate = Math.round((analytics.responses_received / analytics.messages_sent) * 100)
      }

      localStorage.setItem("conquista_pro_analytics", JSON.stringify(analytics))
    } catch (error) {
      console.error("Erro ao atualizar analytics:", error)
    }
  }

  const saveLog = (hasImage: boolean, success: boolean) => {
    try {
      const savedLogs = localStorage.getItem("conquista_pro_logs")
      const logs = savedLogs ? JSON.parse(savedLogs) : []
      
      const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        mode,
        hasImage,
        success
      }
      
      logs.push(logEntry)
      
      // Manter apenas os últimos 100 logs
      if (logs.length > 100) {
        logs.shift()
      }
      
      localStorage.setItem("conquista_pro_logs", JSON.stringify(logs))
    } catch (error) {
      console.error("Erro ao salvar log:", error)
    }
  }

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = { 
      role: "user", 
      content: input || "Analise esta imagem",
      imageUrl: selectedImage || undefined
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: config.systemPrompt },
            ...messages,
            userMessage
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "Desculpa, não consegui processar isso."
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Atualizar analytics e logs
      updateAnalytics()
      saveLog(!!selectedImage, true)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpa, tive um problema aqui. Verifica se a chave da OpenAI está configurada e tenta de novo!"
      }])
      saveLog(!!selectedImage, false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
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
        <h2 className="text-2xl font-bold">{config.title}</h2>
      </div>

      {/* Messages */}
      <Card className="flex-1 bg-[#1A1A1A] border-gray-800 p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-2">
              <p className="text-gray-400">
                {mode === "resposta" && "Digite a mensagem recebida ou envie um print da conversa para análise completa"}
                {mode === "story" && "Descreva o story dela e vou te dar ideias criativas"}
                {mode === "iniciar" && "Me conte sobre ela e vou te ajudar a começar"}
                {mode === "feedback" && "Descreva sua situação e vou te dar um feedback honesto"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-[#2A2A2A] text-gray-100"
                  }`}
                >
                  {message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Imagem enviada" 
                      className="rounded-lg mb-2 max-w-full h-auto"
                    />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      {/* Image Preview */}
      {selectedImage && (
        <div className="mb-2 relative inline-block">
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="h-20 rounded-lg border-2 border-blue-500"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Input */}
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
          className="bg-[#1A1A1A] border-gray-800 hover:bg-[#2A2A2A] self-end"
          disabled={isLoading}
        >
          <Image className="w-5 h-5" />
        </Button>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={config.placeholder}
          className="flex-1 bg-[#1A1A1A] border-gray-800 text-gray-100 resize-none"
          rows={3}
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={(!input.trim() && !selectedImage) || isLoading}
          className="bg-blue-600 hover:bg-blue-700 self-end"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
