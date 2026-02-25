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

    const speak = (text, stance) => {
        if (!window.speechSynthesis) return
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        const voices = window.speechSynthesis.getVoices()

        if (stance === "pro") {
            const femaleVoice = voices.find(v =>
                v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("woman") ||
                v.name.includes("Samantha") ||
                v.name.includes("Victoria") ||
                v.name.includes("Karen") ||
                v.name.includes("Zira") ||
                v.name.includes("Susan")
            )
            if (femaleVoice) utterance.voice = femaleVoice
            utterance.pitch = 1.4
            utterance.rate = 1.0
        } else {
            const maleVoice = voices.find(v =>
                v.name.toLowerCase().includes("male") ||
                v.name.toLowerCase().includes("man") ||
                v.name.includes("David") ||
                v.name.includes("Mark") ||
                v.name.includes("Daniel") ||
                v.name.includes("Alex") ||
                v.name.includes("Fred")
            )
            if (maleVoice) utterance.voice = maleVoice
            utterance.pitch = 0.8
            utterance.rate = 1.0
        }

        window.speechSynthesis.speak(utterance)
    }

    const waitForSpeech = () => {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (!window.speechSynthesis.speaking) {
                    clearInterval(check)
                    resolve()
                }
            }, 500)
        })
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

    const startDebate = async ({ topic, context, rounds, geminiStance, language, firstSpeaker }) => {
        setMessages([])
        setError(null)
        setIsDebating(true)
        setLoading(true)
    
        const llamaStance = geminiStance === "pro" ? "kontra" : "pro"
        let lastFirst = ""
        let lastSecond = ""
    
        const first = firstSpeaker === "gemini"
            ? { name: "Gemini", stance: geminiStance, ask: askGemini }
            : { name: "Llama", stance: llamaStance, ask: askLlama }
    
        const second = firstSpeaker === "gemini"
            ? { name: "Llama", stance: llamaStance, ask: askLlama }
            : { name: "Gemini", stance: geminiStance, ask: askGemini }
    
        try {
            for (let round = 1; round <= rounds; round++) {
                setLoading(firstSpeaker)
                const firstPrompt = buildPrompt({
                    model: first.name, stance: first.stance,
                    topic, context, round,
                    previousArgument: lastSecond, language
                })
                const firstReply = await first.ask(firstPrompt)
                lastFirst = firstReply
                addMessage(firstSpeaker, first.stance, firstReply, round)
                speak(firstReply, first.stance)
                await waitForSpeech()
    
                const secondModel = firstSpeaker === "gemini" ? "llama" : "gemini"
                setLoading(secondModel)
                const secondPrompt = buildPrompt({
                    model: second.name, stance: second.stance,
                    topic, context, round,
                    previousArgument: lastFirst, language
                })
                const secondReply = await second.ask(secondPrompt)
                lastSecond = secondReply
                addMessage(secondModel, second.stance, secondReply, round)
                speak(secondReply, second.stance)
                await waitForSpeech()
            }
        } catch (err) {
            console.error(err)
    
            const errMsg = err?.message || err?.toString() || ""
            const errStatus = err?.status || err?.code || ""
    
            if (
                errStatus === 429 ||
                errMsg.includes("429") ||
                errMsg.includes("quota") ||
                errMsg.includes("RESOURCE_EXHAUSTED") ||
                errMsg.includes("rate limit")
            ) {
                setError("Quota request habis. Coba lagi nanti atau tunggu reset jam 15:00 WIB.")
            } else if (
                errStatus === 404 ||
                errMsg.includes("404") ||
                errMsg.includes("not found") ||
                errMsg.includes("decommissioned")
            ) {
                setError("Model tidak tersedia. Coba update nama model.")
            } else if (
                errMsg.includes("API key") ||
                errMsg.includes("invalid") ||
                errMsg.includes("401") ||
                errStatus === 401
            ) {
                setError("API key tidak valid. Cek file .env kamu.")
            } else {
                setError("Debat gagal. Cek koneksi atau coba lagi!")
            }
        } finally {
            setLoading(false)
            setIsDebating(false)
        }
    }

    const resetDebate = () => {
        window.speechSynthesis.cancel()
        setMessages([])
        setError(null)
        setIsDebating(false)
        setLoading(false)
    }

    return { messages, loading, error, isDebating, startDebate, resetDebate }
}

export default useDebate