"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ProfileScreenProps {
  onBack: () => void
  onSave: (name: string) => void
}

export default function ProfileScreen({ onBack, onSave }: ProfileScreenProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [goal, setGoal] = useState("conquistar")

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedName = localStorage.getItem("userName")
    const savedAge = localStorage.getItem("userAge")
    const savedGoal = localStorage.getItem("userGoal")

    if (savedName) setName(savedName)
    if (savedAge) setAge(savedAge)
    if (savedGoal) setGoal(savedGoal)
  }, [])

  const handleSave = () => {
    localStorage.setItem("userName", name)
    localStorage.setItem("userAge", age)
    localStorage.setItem("userGoal", goal)
    
    onSave(name)
    onBack()
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        <h2 className="text-2xl font-bold">Seu Perfil</h2>
      </div>

      {/* Form */}
      <Card className="p-6 bg-[#1A1A1A] border-gray-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">
            Nome
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como você quer ser chamado?"
            className="bg-[#0A0A0A] border-gray-700 text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-gray-300">
            Idade
          </Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Quantos anos você tem?"
            className="bg-[#0A0A0A] border-gray-700 text-gray-100"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-gray-300">
            Qual é o seu objetivo principal?
          </Label>
          <RadioGroup value={goal} onValueChange={setGoal}>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 hover:border-blue-500 transition-colors">
              <RadioGroupItem value="conquistar" id="conquistar" />
              <Label htmlFor="conquistar" className="flex-1 cursor-pointer text-gray-200">
                Conquistar alguém específico
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 hover:border-blue-500 transition-colors">
              <RadioGroupItem value="melhorar" id="melhorar" />
              <Label htmlFor="melhorar" className="flex-1 cursor-pointer text-gray-200">
                Melhorar minha comunicação
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 hover:border-blue-500 transition-colors">
              <RadioGroupItem value="timidez" id="timidez" />
              <Label htmlFor="timidez" className="flex-1 cursor-pointer text-gray-200">
                Perder a timidez
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!name.trim()}
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Perfil
        </Button>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 p-4 bg-[#1A1A1A] border-gray-800">
        <p className="text-sm text-gray-400">
          💡 <strong className="text-gray-300">Dica:</strong> Quanto mais eu souber sobre você, 
          melhores serão minhas sugestões personalizadas.
        </p>
      </Card>
    </div>
  )
}
