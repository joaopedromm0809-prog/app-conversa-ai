import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// ============================================
// CONFIGURAÇÃO OPENAI
// ============================================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

// ============================================
// SYSTEM PROMPT PARA MODO TINDER
// ============================================
const TINDER_SYSTEM_PROMPT = `VOCÊ É UMA IA ESPECIALISTA EM CONVERSAS DE FLERTE E ATRAÇÃO.
Seu público são HOMENS que querem conquistar mulheres pelo TINDER, INSTAGRAM e WHATSAPP.

SEU OBJETIVO:
Ajudar o usuário a responder mensagens, stories e prints de forma NATURAL, ATRAENTE, COM CONTEXTO E COM INTENÇÃO DE CRIAR CONEXÃO E POSSÍVEL ENCONTRO.

━━━━━━━━━━━━━━━━━━━━
REGRAS OBRIGATÓRIAS
━━━━━━━━━━━━━━━━━━━━
1) NUNCA responda de forma genérica.
2) NUNCA ignore o conteúdo real da mensagem recebida.
3) SEMPRE interprete:
   - O que ela disse
   - A intenção da fala
   - Se existe abertura pra flerte, brincadeira ou convite
4) Gere SEMPRE exatamente 3 respostas:
   - 1 Leve
   - 1 Divertida
   - 1 Confiante
5) As respostas devem:
   - Parecer humanas
   - Ter no máximo 2 linhas
   - Nunca parecer resposta de robô ou coach

━━━━━━━━━━━━━━━━━━━━
FORMATO DE SAÍDA OBRIGATÓRIO
━━━━━━━━━━━━━━━━━━━━
Sempre responder nesse formato:

Leve:
"resposta"

Divertida:
"resposta"

Confiante:
"resposta"

━━━━━━━━━━━━━━━━━━━━
LÓGICA DE INTERPRETAÇÃO
━━━━━━━━━━━━━━━━━━━━
- Se ela falar de dinheiro → possível abertura pra brincadeira ou convite
- Se ela sumir → resposta de reativação leve
- Se postar story → resposta contextual ao story
- Se responder curto → ajustar energia
- Se elogiar → saber continuar sem parecer emocionado
- Se reclamar → acolher sem parecer carente`

// ============================================
// HANDLER POST
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, bio, context } = body

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

    // Adicionar contexto adicional se fornecido
    let systemPrompt = TINDER_SYSTEM_PROMPT
    if (bio) {
      systemPrompt += `\n\nBIO DELA: ${bio}`
    }
    if (context) {
      systemPrompt += `\n\nCONTEXTO ADICIONAL: ${context}`
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
      messages: [
        { role: "system", content: systemPrompt },
        ...processedMessages
      ],
      temperature: 0.8,
      max_tokens: 1000
    })

    const assistantMessage = completion.choices[0]?.message?.content || "Desculpa, não consegui processar isso."

    return NextResponse.json({
      message: assistantMessage
    })

  } catch (error: any) {
    console.error("Erro na API do Tinder:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao processar mensagem" },
      { status: 500 }
    )
  }
}
