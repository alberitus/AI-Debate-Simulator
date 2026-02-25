import DebateMessage from "./DebateMessage"
import LoadingDots from "./LoadingDots"

const DebateArena = ({ messages, loading, topic, geminiStance, onReset, language }) => {
    const llamaStance = geminiStance === "pro" ? "kontra" : "pro"
    const rounds = [...new Set(messages.map(m => m.round))]
    const isEn = language === "en"

    return (
        <div className="debate-arena">
            <div className="arena-header">
                <p className="arena-topic">
                    <strong>{isEn ? "Topic" : "Topik"}:</strong> {topic}
                </p>
                <div className="arena-chips">
                    <span className="chip chip-gemini">
                        <i className="bi bi-stars"></i>
                        Gemini — {geminiStance === "pro" ? "Pro" : isEn ? "Against" : "Kontra"}
                    </span>
                    <span className="chip chip-llama">
                        <i className="bi bi-cpu"></i>
                        Llama — {llamaStance === "pro" ? "Pro" : isEn ? "Against" : "Kontra"}
                    </span>
                </div>
            </div>

            {rounds.map(round => (
                <div key={round}>
                    <div className="round-badge">
                        {isEn ? `Round ${round}` : `Ronde ${round}`}
                    </div>
                    {messages.filter(m => m.round === round).map((msg, i) => (
                        <DebateMessage key={i} message={msg} language={language} />
                    ))}
                </div>
            ))}

            {loading === "gemini" && <LoadingDots model="gemini" language={language} />}
            {loading === "llama" && <LoadingDots model="llama" language={language} />}

            {messages.length > 0 && (
                <div className="arena-actions">
                    <button
                        className="stop-voice-btn"
                        onClick={() => window.speechSynthesis.cancel()}
                    >
                        <i className="bi bi-volume-mute-fill"></i>
                        {isEn ? "Stop Voice" : "Hentikan Suara"}
                    </button>

                    {!loading && (
                        <button className="reset-btn" onClick={onReset}>
                            <i className="bi bi-arrow-counterclockwise"></i>
                            {isEn ? "New Debate" : "Debat Baru"}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default DebateArena