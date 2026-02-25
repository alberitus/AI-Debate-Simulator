import { useState } from "react"

const DebateForm = ({ onSubmit, loading, language, onLanguageChange }) => {
    const [topic, setTopic] = useState("")
    const [context, setContext] = useState("")
    const [rounds, setRounds] = useState(3)
    const [geminiStance, setGeminiStance] = useState("pro")

    const isEn = language === "en"

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!topic.trim()) return
        onSubmit({ topic, context, rounds: Number(rounds), geminiStance, language })
    }

    return (
        <form className="debate-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="topic">{isEn ? "Debate Topic" : "Topik Debat"}</label>
                <div className="input-wrapper">
                    <i className="bi bi-chat-square-quote"></i>
                    <input
                        id="topic"
                        type="text"
                        placeholder={isEn ? "e.g. Will AI replace human jobs?" : "cth. Apakah AI akan menggantikan pekerjaan manusia?"}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="context">
                    {isEn ? "Additional Context" : "Konteks Tambahan"}{" "}
                    <span style={{ fontWeight: 400, color: "#94a3b8" }}>
                        {isEn ? "(optional)" : "(opsional)"}
                    </span>
                </label>
                <div className="input-wrapper">
                    <i className="bi bi-info-circle"></i>
                    <textarea
                        id="context"
                        placeholder={isEn ? "Add context, constraints, or a specific angle..." : "Tambahkan konteks, batasan, atau sudut pandang khusus..."}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        rows={2}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="rounds">{isEn ? "Rounds" : "Jumlah Ronde"}</label>
                    <div className="rounds-selector">
                        {[2, 3, 4, 5, 10].map(n => (
                            <button
                            key={n}
                            type="button"
                            className={`round-btn ${rounds === n ? "round-btn-active" : ""}`}
                            onClick={() => setRounds(n)}
                            >
                            {n}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>{isEn ? "Language" : "Bahasa"}</label>
                    <div className="lang-toggle">
                        <button
                        type="button"
                        className={language === "en" ? "lang-active" : ""}
                        onClick={() => onLanguageChange("en")}
                        >
                            <i className="bi bi-translate"></i> English
                        </button>
                        <button
                        type="button"
                        className={language === "id" ? "lang-active" : ""}
                        onClick={() => onLanguageChange("id")}
                        >
                            <i className="bi bi-translate"></i> Indonesia
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>{isEn ? "Choose Stance" : "Pilih Posisi"}</label>
                <div className="role-selector">
                    <div
                        className={`role-card ${geminiStance === "pro" ? "selected-gemini" : ""}`}
                        onClick={() => setGeminiStance("pro")}
                    >
                        <div className="role-card-header">
                            <div className="model-dot dot-gemini"></div>
                            <span className="gemini-label">Gemini</span>
                            {geminiStance === "pro" && (
                                <i className="bi bi-check-circle-fill" style={{ color: "#2563eb", marginLeft: "auto" }}></i>
                            )}
                        </div>
                        <p>{geminiStance === "pro"
                        ? `✦ PRO — ${isEn ? "Supporting" : "Mendukung"}`
                        : `✦ ${isEn ? "AGAINST — Opposing" : "KONTRA — Menentang"}`}
                        </p>
                    </div>

                    <div
                        className={`role-card ${geminiStance === "kontra" ? "selected-llama" : ""}`}
                        onClick={() => setGeminiStance("kontra")}
                    >
                        <div className="role-card-header">
                            <div className="model-dot dot-llama"></div>
                            <span className="llama-label">Llama</span>
                            {geminiStance === "kontra" && (
                                <i className="bi bi-check-circle-fill" style={{ color: "#7c3aed", marginLeft: "auto" }}></i>
                            )}
                        </div>
                        <p>{geminiStance === "kontra"
                        ? `✦ PRO — ${isEn ? "Supporting" : "Mendukung"}`
                        : `✦ ${isEn ? "AGAINST — Opposing" : "KONTRA — Menentang"}`}
                        </p>
                    </div>
                </div>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? (
                <>
                    <i className="bi bi-hourglass-split"></i>
                    {isEn ? "Debate in Progress..." : "Debat Berlangsung..."}
                </>
                ) : (
                <>
                    <i className="bi bi-lightning-charge-fill"></i>
                    {isEn ? "Start Debate" : "Mulai Debat"}
                </>
                )}
            </button>
        </form>
    )
}

export default DebateForm