const DebateMessage = ({ message }) => {
    const isGemini = message.model === "gemini"

    return (
        <div className={`debate-message ${isGemini ? "align-left" : "align-right"}`}>
            <div className={`message-meta ${isGemini ? "gemini-meta" : "llama-meta"}`}>
            {isGemini ? (
                    <>
                    <i className="bi bi-stars"></i>
                    Gemini
                    </>
                ) : (
                    <>
                    <i className="bi bi-cpu"></i>
                    Llama
                    </>
                )}
                <span style={{ fontWeight: 400, textTransform: "capitalize", opacity: 0.7 }}>
                    — {message.role}
                </span>
            </div>
    
            <div className={`message-bubble ${isGemini ? "bubble-gemini" : "bubble-llama"}`}>
                {message.content}
            </div>
        </div>
    )
}

export default DebateMessage