"use client"

import { ArrowLeft, BookOpen, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EbookScreenProps {
  onBack: () => void
}

export default function EbookScreen({ onBack }: EbookScreenProps) {
  const handleView = () => {
    alert("Visualização do e-book em breve!")
  }

  const handleDownload = () => {
    alert("Download do e-book em breve!")
  }

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
        <h2 className="text-2xl font-bold">E-book Exclusivo</h2>
      </div>

      {/* E-book Card */}
      <Card className="bg-[#1A1A1A] border-gray-800 overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative text-center space-y-3 px-6">
            <BookOpen className="w-20 h-20 text-white mx-auto" />
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Lábia de Sucesso
            </h3>
            <p className="text-white/90 text-lg">
              O guia completo para dominar a arte da conversa
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Descrição */}
          <div className="space-y-3">
            <h4 className="text-xl font-semibold text-gray-200">
              Sobre o E-book
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Descubra técnicas comprovadas e estratégias práticas para iniciar conversas, 
              manter o interesse e criar conexões genuínas. Este e-book exclusivo reúne 
              anos de experiência e conhecimento em comunicação e relacionamentos.
            </p>
          </div>

          {/* O que você vai aprender */}
          <div className="space-y-3">
            <h4 className="text-xl font-semibold text-gray-200">
              O que você vai aprender:
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Como iniciar conversas de forma natural e confiante</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Técnicas para manter o interesse e criar conexão</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Estratégias para responder stories de forma eficaz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Como interpretar sinais e ajustar sua abordagem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Frases e exemplos práticos para diferentes situações</span>
              </li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleView}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              Visualizar E-book
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 bg-[#2A2A2A] border-gray-700 hover:bg-[#3A3A3A] text-white"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar PDF
            </Button>
          </div>

          {/* Info adicional */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-500 text-center">
              📚 Conteúdo exclusivo para membros do ConquistaPro
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
