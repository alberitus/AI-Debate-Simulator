import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_KEY,
    dangerouslyAllowBrowser: true
})

const useDebate = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDebating, setIsDebating] = useState(false)

    const addMessage = (model, role, content, round) => {
        setMessages(prev => [...prev, { model, role, content, round }])
    }

    const askGemini = async (prompt) => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const result = await model.generateContent(prompt)
        return result.response.text()
    }

    const askLlama = async (prompt) => {
        const result = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }]
        })
        return result.choices[0].message.content
    }

    const buildPrompt = ({ model, stance, topic, context, round, previousArgument, language }) => {
        const opponent = model === "Gemini" ? "Llama" : "Gemini"
        const isEnglish = language === "en"

        const roundInfo = round === 1
            ? isEnglish
                ? `This is the first round. Give a strong opening argument.`
                : `Ini adalah ronde pertama. Berikan argumen pembuka yang kuat.`
            : isEnglish
                ? `This is round ${round}. Counter the opponent's argument below and strengthen your position:\n"${previousArgument}"`
                : `Ini adalah ronde ${round}. Bantah argumen lawan berikut dan perkuat posisimu:\n"${previousArgument}"`

        return isEnglish ? `
            You are an AI debater named ${model}.
            Debate topic: "${topic}"
            ${context ? `Additional context: ${context}` : ""}
            Your stance: ${stance === "pro" ? "PRO (supporting the topic)" : "AGAINST (opposing the topic)"}
            Your opponent: ${opponent}
        
            ${roundInfo}
        
            Provide a sharp, logical, and persuasive argument in 2-3 paragraphs.
            Limit your response to a maximum of 70 words.
            Do not use any greeting, introduction, or closing. Go straight to the argument.
            Respond in English. Do not mention your model name, just give the argument.
            ` : `
            Kamu adalah AI debater bernama ${model}.
            Topik debat: "${topic}"
            ${context ? `Konteks tambahan: ${context}` : ""}
            Posisimu: ${stance === "pro" ? "PRO (mendukung topik)" : "KONTRA (menentang topik)"}
            Lawanmu: ${opponent}
        
            ${roundInfo}
        
            Berikan argumen yang tajam, logis, dan persuasif dalam 2-3 paragraf.
            Berikan argumen dengan maksimal kata 70 kata.
            Jangan gunakan sapaan, pembuka, atau penutup. Langsung sampaikan argumenmu.
            Gunakan bahasa Indonesia. Jangan sebut nama model, langsung berikan argumen.
        `
    }

    const startDebate = async ({ topic, context, rounds, geminiStance, language }) => {
            setMessages([])
            setError(null)
            setIsDebating(true)
            setLoading(true)
        
            const llamaStance = geminiStance === "pro" ? "kontra" : "pro"
            let lastGemini = ""
            let lastLlama = ""
        
            try {
                for (let round = 1; round <= rounds; round++) {
                    setLoading("gemini")
                    const geminiPrompt = buildPrompt({
                    model: "Gemini", stance: geminiStance,
                    topic, context, round,
                    previousArgument: lastLlama, language
                    })
                    const geminiReply = await askGemini(geminiPrompt)
                    lastGemini = geminiReply
                    addMessage("gemini", geminiStance, geminiReply, round)
            
                    setLoading("llama")
                    const llamaPrompt = buildPrompt({
                    model: "Llama", stance: llamaStance,
                    topic, context, round,
                    previousArgument: lastGemini, language
                    })
                    const llamaReply = await askLlama(llamaPrompt)
                    lastLlama = llamaReply
                    addMessage("llama", llamaStance, llamaReply, round)
                }
            } catch (err) {
                setError("Debat gagal. Cek API key atau coba lagi!")
                console.error(err)
            } finally {
                setLoading(false)
                setIsDebating(false)
            }
    }

    const resetDebate = () => {
        setMessages([])
        setError(null)
        setIsDebating(false)
        setLoading(false)
    }

    return { messages, loading, error, isDebating, startDebate, resetDebate }
}

export default useDebate