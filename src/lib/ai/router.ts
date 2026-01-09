import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider, AIMessage } from '@/types'

// AI Client Initialization
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com/v1',
})

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// Model configurations
export const AI_MODELS = {
  anthropic: {
    default: 'claude-sonnet-4-20250514',
    fast: 'claude-3-5-haiku-20241022',
    powerful: 'claude-sonnet-4-20250514',
  },
  openai: {
    default: 'gpt-4o',
    fast: 'gpt-4o-mini',
    powerful: 'gpt-4o',
  },
  deepseek: {
    default: 'deepseek-chat',
    fast: 'deepseek-chat',
    powerful: 'deepseek-reasoner',
  },
  gemini: {
    default: 'gemini-1.5-pro',
    fast: 'gemini-1.5-flash',
    powerful: 'gemini-1.5-pro',
  },
} as const

// Cost per 1M tokens (input/output)
export const TOKEN_COSTS = {
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  'claude-3-5-haiku-20241022': { input: 0.25, output: 1.25 },
  'gpt-4o': { input: 2.5, output: 10 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'deepseek-chat': { input: 0.14, output: 0.28 },
  'deepseek-reasoner': { input: 0.55, output: 2.19 },
  'gemini-1.5-pro': { input: 1.25, output: 5 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
} as const

export interface AIRequestOptions {
  provider?: AIProvider
  model?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
  stream?: boolean
}

export interface AIResponse {
  content: string
  provider: AIProvider
  model: string
  tokensUsed: {
    input: number
    output: number
    total: number
  }
  cost: number
}

// Intelligent AI Router
export class AIRouter {
  private defaultProvider: AIProvider = 'deepseek'

  // Route request to optimal provider based on task type
  async route(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    const provider = options.provider || this.selectOptimalProvider(messages)

    switch (provider) {
      case 'anthropic':
        return this.callAnthropic(messages, options)
      case 'openai':
        return this.callOpenAI(messages, options)
      case 'deepseek':
        return this.callDeepSeek(messages, options)
      case 'gemini':
        return this.callGemini(messages, options)
      default:
        return this.callDeepSeek(messages, options)
    }
  }

  // Select optimal provider based on task analysis
  private selectOptimalProvider(
    messages: Array<{ role: string; content: string }>
  ): AIProvider {
    const lastMessage = messages[messages.length - 1]?.content || ''

    // Medical/therapeutic tasks -> Claude (best for safety)
    if (/medycyn|lekar|terapi|diagnoz|zdrow/i.test(lastMessage)) {
      return 'anthropic'
    }

    // Complex reasoning -> DeepSeek Reasoner
    if (/analiz|rozumow|matemat|logik|kod/i.test(lastMessage)) {
      return 'deepseek'
    }

    // Creative tasks -> GPT-4
    if (/napisz|stw[oó]rz|wymyśl|kreatyw/i.test(lastMessage)) {
      return 'openai'
    }

    // Default to DeepSeek for cost efficiency
    return 'deepseek'
  }

  private async callAnthropic(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const systemMessages = messages.filter(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')

    const model = options.model || AI_MODELS.anthropic.default

    const response = await anthropic.messages.create({
      model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
      system: systemMessages.map(m => m.content).join('\n') || undefined,
      messages: conversationMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || { input: 3, output: 15 }

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      provider: 'anthropic',
      model,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: (inputTokens * costs.input + outputTokens * costs.output) / 1000000,
    }
  }

  private async callOpenAI(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const model = options.model || AI_MODELS.openai.default

    const response = await openai.chat.completions.create({
      model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || { input: 2.5, output: 10 }

    return {
      content: response.choices[0]?.message?.content || '',
      provider: 'openai',
      model,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: (inputTokens * costs.input + outputTokens * costs.output) / 1000000,
    }
  }

  private async callDeepSeek(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const model = options.model || AI_MODELS.deepseek.default

    const response = await deepseek.chat.completions.create({
      model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.7,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || { input: 0.14, output: 0.28 }

    return {
      content: response.choices[0]?.message?.content || '',
      provider: 'deepseek',
      model,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: (inputTokens * costs.input + outputTokens * costs.output) / 1000000,
    }
  }

  private async callGemini(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const modelName = options.model || AI_MODELS.gemini.default
    const model = gemini.getGenerativeModel({ model: modelName })

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user' as const,
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]?.content || ''

    const result = await chat.sendMessage(lastMessage)
    const response = result.response

    const inputTokens = response.usageMetadata?.promptTokenCount || 0
    const outputTokens = response.usageMetadata?.candidatesTokenCount || 0
    const costs = TOKEN_COSTS[modelName as keyof typeof TOKEN_COSTS] || { input: 1.25, output: 5 }

    return {
      content: response.text(),
      provider: 'gemini',
      model: modelName,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: (inputTokens * costs.input + outputTokens * costs.output) / 1000000,
    }
  }
}

// Export singleton instance
export const aiRouter = new AIRouter()
