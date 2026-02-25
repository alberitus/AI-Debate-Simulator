import { useState } from "react"
import DebateForm from "./components/DebateForm"
import DebateArena from "./components/DebateArena"
import useDebate from "./hooks/useDebate"

function App() {
  const { messages, loading, error, isDebating, startDebate, resetDebate } = useDebate()
  const [debateConfig, setDebateConfig] = useState(null)
  const [language, setLanguage] = useState("en")

  const handleSubmit = (config) => {
    setDebateConfig(config)
    startDebate(config)
  }

  const handleReset = () => {
    resetDebate()
    setDebateConfig(null)
  }

  return (
    <div className="app">
      <header>
        <div className="header-badge">
          <span className="gemini">Gemini</span>
          <i className="bi bi-sword"></i>
          <span className="llama">Llama</span>
        </div>
        <h1>AI Debate Simulator</h1>
        <p>
          {language === "en"
            ? "Two AIs debate each other based on the topic you provide."
            : "Dua AI berdebat satu sama lain berdasarkan topik yang kamu tentukan."
          }
        </p>
      </header>

      <main>
        {!isDebating && messages.length === 0 && (
          <DebateForm
            onSubmit={handleSubmit}
            loading={loading}
            language={language}
            onLanguageChange={setLanguage}
          />
        )}

        {error && (
          <p className="error">
            <i className="bi bi-exclamation-circle-fill"></i>
            {error}
          </p>
        )}

        {(isDebating || messages.length > 0) && debateConfig && (
          <DebateArena
            messages={messages}
            loading={loading}
            topic={debateConfig.topic}
            geminiStance={debateConfig.geminiStance}
            onReset={handleReset}
            language={language}
          />
        )}
      </main>
    </div>
  )
}

export default App