const LoadingDots = ({ model, language }) => {
    const isGemini = model === "gemini"
    const isEn = language === "en"

    return (
        <div className={`loading-dots ${isGemini ? "align-left" : "align-right"}`}>
            {isGemini && (
                <span className="loading-label gemini-label-dots">
                    <i className="bi bi-stars"></i>
                    {isEn ? "Gemini is thinking..." : "Gemini sedang berpikir..."}
                </span>
            )}

            <div className={`dots ${isGemini ? "gemini-dots" : "llama-dots"}`}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {!isGemini && (
                <span className="loading-label llama-label-dots">
                    <i className="bi bi-cpu"></i>
                    {isEn ? "Llama is thinking..." : "Llama sedang berpikir..."}
                </span>
            )}
        </div>
    )
}

export default LoadingDots