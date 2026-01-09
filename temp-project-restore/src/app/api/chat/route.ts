import { NextResponse } from "next/server"
import OpenAI from "openai"

// ============================================
// CONFIGURAÇÃO OPENAI
// ============================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

// ============================================
// HANDLER POST (principal)
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      )
    }

    // Verificar se tem API key configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Chave da OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente." },
        { status: 500 }
      )
    }

    // Processar imagens se houver
    const processedMessages = messages.map((msg: any) => {
      if (msg.imageUrl) {
        return {
          role: msg.role,
          content: [
            {
              type: "text",
              text: msg.content
            },
            {
              type: "image_url",
              image_url: {
                url: msg.imageUrl
              }
            }
          ]
        }
      }
      return msg
    })

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: processedMessages,
      temperature: 0.8,
      max_tokens: 1000
    })

    const assistantMessage = completion.choices[0]?.message?.content || "Desculpa, não consegui processar isso."

    return NextResponse.json({
      message: assistantMessage
    })

  } catch (error: any) {
    console.error("Erro na API de chat:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao processar mensagem" },
      { status: 500 }
    )
  }
}
