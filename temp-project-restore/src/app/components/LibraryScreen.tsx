"use client"

import { ArrowLeft, MessageCircle, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LibraryScreenProps {
  onBack: () => void
}

const frasesValidadas = [
  "Oi! Vi seu perfil e achei interessante. Como foi seu dia?",
  "E aí! Reparei que você gosta de [interesse dela]. Eu também curto muito!",
  "Oi! Você parece ser uma pessoa legal. Bora trocar uma ideia?",
  "Ei! Achei sua vibe muito legal. O que você anda fazendo de bom?",
  "Oi! Vi que você curte [hobby]. Tem alguma dica pra quem tá começando?",
  "E aí! Seu sorriso chamou minha atenção. Como você está?",
  "Oi! Você parece ser alguém interessante. Conta um pouco sobre você?",
  "Ei! Adorei seu estilo. Você sempre foi assim ou foi descobrindo?",
  "Oi! Vi suas fotos e fiquei curioso. Qual é a história por trás delas?",
  "E aí! Você tem uma energia muito boa. O que te deixa feliz?"
]

const ideiasAssunto = [
  "Pergunte sobre o último lugar que ela viajou",
  "Comente sobre alguma série ou filme que ela mencionou",
  "Pergunte qual é a música favorita dela no momento",
  "Fale sobre um hobby em comum que vocês têm",
  "Pergunte sobre o pet dela (se ela tiver)",
  "Comente sobre alguma comida que ela postou",
  "Pergunte sobre o trabalho ou estudos dela (de forma leve)",
  "Fale sobre algum evento ou lugar da cidade de vocês",
  "Pergunte sobre o final de semana dela",
  "Comente sobre alguma conquista recente que ela compartilhou"
]

const respostasStories = [
  "Que lugar incrível! Já foi outras vezes?",
  "Essa música é muito boa! Você tem bom gosto",
  "Que foto massa! Quem tirou?",
  "Isso aí! Tá arrasando",
  "Que vibe boa! Tá curtindo o dia?",
  "Adorei! Me deu vontade de fazer isso também",
  "Que legal! Conta mais sobre isso",
  "Tá com cara de que foi muito bom!",
  "Que momento! Você tá sempre fazendo coisas legais",
  "Isso sim é aproveitar a vida! Tá de parabéns"
]

export default function LibraryScreen({ onBack }: LibraryScreenProps) {
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
        <h2 className="text-2xl font-bold">Frases Validadas para Iniciar Conversa</h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="mensagens" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-gray-800">
          <TabsTrigger value="mensagens" className="data-[state=active]:bg-blue-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="assuntos" className="data-[state=active]:bg-purple-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Assuntos
          </TabsTrigger>
          <TabsTrigger value="stories" className="data-[state=active]:bg-green-600">
            <Heart className="w-4 h-4 mr-2" />
            Stories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mensagens" className="space-y-4 mt-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">
              10 Frases Testadas e Comprovadas
            </h3>
            <p className="text-sm text-gray-500">
              Frases validadas que funcionam — adapte ao seu estilo
            </p>
          </div>
          <div className="grid gap-3">
            {frasesValidadas.map((msg, index) => (
              <Card
                key={index}
                className="p-4 bg-[#1A1A1A] border-gray-800 hover:border-blue-500 transition-colors"
              >
                <p className="text-gray-200">{msg}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assuntos" className="space-y-4 mt-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">
              10 Ideias para Puxar Assunto
            </h3>
            <p className="text-sm text-gray-500">
              Tópicos que funcionam bem para manter a conversa fluindo
            </p>
          </div>
          <div className="grid gap-3">
            {ideiasAssunto.map((ideia, index) => (
              <Card
                key={index}
                className="p-4 bg-[#1A1A1A] border-gray-800 hover:border-purple-500 transition-colors"
              >
                <p className="text-gray-200">{ideia}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-4 mt-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-300">
              10 Respostas Leves para Stories
            </h3>
            <p className="text-sm text-gray-500">
              Respostas simples e eficientes que chamam atenção
            </p>
          </div>
          <div className="grid gap-3">
            {respostasStories.map((resposta, index) => (
              <Card
                key={index}
                className="p-4 bg-[#1A1A1A] border-gray-800 hover:border-green-500 transition-colors"
              >
                <p className="text-gray-200">{resposta}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
