import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { resetStory } from "../store/storySlice";
import { useMusicForm } from "../hooks/useMusicForm";
import { JARAK_TRANSLATIONS } from "../constant/translations";
import { SettingsPanel } from "./StoryComponents";

export default function MusicForm({ onTogglePage }) {
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state) => state.story);
  const t = JARAK_TRANSLATIONS[language] ?? JARAK_TRANSLATIONS.id;
  const steps = t.steps;

  const {
    currentStep,
    formData,
    result,
    loading,
    showModal,
    suggestions,
    showSuggestions,
    searchLoading,
    audioPlayer,
    isPlaying,
    currentPreviewUrl,
    currentField,
    isLastStep,
    canProceed,
    isFromSuggestion,
    handleNext,
    handleBack,
    handleChange,
    handleSelectSuggestion,
    handlePlayPreview,
    handleCloseSuggestions,
    handleKeyPress,
    handleSubmit,
    handleCloseModal,
  } = useMusicForm(steps);

  const isDark = theme === "dark";

  const tc = {
    text: isDark ? "text-stone-300" : "text-stone-700",
    textMuted: isDark ? "text-stone-400" : "text-stone-500",
    textFaint: isDark ? "text-stone-500" : "text-stone-400",
    textTitle: isDark ? "text-stone-200" : "text-stone-700",
    input: isDark
      ? "bg-transparent border-stone-700 text-stone-300 focus:border-stone-600 placeholder-stone-600"
      : "bg-transparent border-stone-300 text-stone-700 focus:border-stone-400 placeholder-stone-400",
    button: isDark
      ? "bg-transparent border-stone-700 text-stone-300 hover:bg-stone-900/30 hover:border-stone-600"
      : "bg-transparent border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400",
    modal: isDark
      ? "bg-stone-950/98 backdrop-blur-md"
      : "bg-stone-50/98 backdrop-blur-md",
    modalContent: isDark
      ? "bg-stone-900/95 border-stone-700"
      : "bg-white/95 border-stone-200",
    stepInactive: isDark ? "bg-stone-800" : "bg-stone-300",
    stepActive: isDark ? "bg-stone-400" : "bg-stone-600",
    stepCompleted: isDark ? "bg-stone-500" : "bg-stone-400",
    stepRing: isDark ? "border-stone-400" : "border-stone-600",
    dropdown: isDark
      ? "bg-stone-900/98 border-stone-700 backdrop-blur-md"
      : "bg-stone-50/98 border-stone-300 backdrop-blur-md",
    dropdownHeader: isDark
      ? "text-stone-500 border-stone-700"
      : "text-stone-400 border-stone-300",
    dropdownItem: isDark
      ? "hover:bg-stone-800/50 border-stone-800"
      : "hover:bg-stone-100/50 border-stone-200",
    dropdownClose: isDark
      ? "hover:bg-stone-800 text-stone-500 hover:text-stone-300"
      : "hover:bg-stone-200 text-stone-400 hover:text-stone-600",
    songTitle: isDark ? "text-stone-300" : "text-stone-700",
    songArtist: isDark ? "text-stone-500" : "text-stone-400",
    previewBtn: isDark
      ? "hover:bg-stone-800 text-stone-600"
      : "hover:bg-stone-200 text-stone-400",
    previewBtnActive: isDark
      ? "bg-stone-700 text-stone-300"
      : "bg-stone-300 text-stone-700",
    waveBar: isDark ? "bg-stone-400" : "bg-stone-500",
    dot: isDark ? "bg-stone-400" : "bg-stone-600",
  };

  const handleHeartFromMusicForm = () => {
    dispatch(resetStory());
    if (onTogglePage) onTogglePage();
  };

  return (
    <div className="w-full max-w-[428px] min-h-screen relative z-10">
      <SettingsPanel onTogglePage={handleHeartFromMusicForm} />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1
              className={`text-xl tracking-widest mb-3 font-light ${tc.textTitle}`}
            >
              {t.title}
            </h1>
            <p
              className={`text-sm tracking-wide leading-relaxed px-4 ${tc.textMuted}`}
            >
              {t.subtitle1}
            </p>
            <p
              className={`text-sm tracking-wide leading-relaxed px-4 ${tc.textMuted}`}
            >
              {t.subtitle2}
            </p>
          </div>

          {isPlaying && audioPlayer && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center justify-center gap-2"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                    className={`w-0.5 h-2 rounded-full ${tc.waveBar}`}
                  />
                ))}
              </div>
              <p className={`text-xs tracking-wide ${tc.textFaint}`}>
                {t.listeningPreview}
              </p>
            </motion.div>
          )}

          <div className="mb-10">
            <div className="flex items-center justify-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{ scale: index === currentStep ? 1 : 0.8 }}
                    className="relative"
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index < currentStep
                          ? tc.stepCompleted
                          : index === currentStep
                            ? tc.stepActive
                            : tc.stepInactive
                      }`}
                    />
                    {index === currentStep && (
                      <motion.div
                        layoutId="activeRing"
                        className={`absolute inset-0 -m-1 rounded-full border ${tc.stepRing}`}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                        index < currentStep ? tc.stepCompleted : tc.stepInactive
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className={`text-xs tracking-wide ${tc.textFaint}`}>
                {t.stepOf(currentStep + 1, steps.length)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <label
                  className={`block text-xs tracking-wide mb-2.5 ${tc.textMuted}`}
                >
                  {steps[currentStep].label}
                </label>

                <input
                  type="text"
                  value={formData[currentField]}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={currentField === "feeling" ? 150 : 300}
                  autoFocus
                  disabled={
                    isFromSuggestion &&
                    (currentField === "songTitle" || currentField === "artist")
                  }
                  className={`w-full px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${tc.input} focus:outline-none ${
                    isFromSuggestion &&
                    (currentField === "songTitle" || currentField === "artist")
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder={steps[currentStep].placeholder}
                />

                {["lyrics", "songTitle", "artist"].includes(currentField) &&
                  showSuggestions &&
                  suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute z-50 w-full mt-2 rounded-lg border overflow-hidden ${tc.dropdown}`}
                    >
                      <div className="max-h-80 overflow-y-auto">
                        {searchLoading ? (
                          <div className="px-4 py-6 text-center">
                            <div className="flex justify-center gap-1.5">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                  className={`w-1.5 h-1.5 rounded-full ${tc.dot}`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`px-3 py-2 text-xs border-b flex items-center justify-between ${tc.dropdownHeader}`}
                            >
                              <span>{t.searchResult}</span>
                              <button
                                type="button"
                                onClick={handleCloseSuggestions}
                                className={`p-1 rounded transition-colors ${tc.dropdownClose}`}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion(suggestion)
                                }
                                className={`w-full px-3 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${tc.dropdownItem}`}
                              >
                                <div className="flex items-center gap-3">
                                  {suggestion.artwork && (
                                    <img
                                      src={suggestion.artwork}
                                      alt=""
                                      className="w-10 h-10 rounded"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm font-medium truncate ${tc.songTitle}`}
                                    >
                                      {suggestion.title}
                                    </p>
                                    <p
                                      className={`text-xs truncate ${tc.songArtist}`}
                                    >
                                      {suggestion.artist}
                                    </p>
                                  </div>
                                  {suggestion.previewUrl && (
                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handlePlayPreview(
                                          e,
                                          suggestion.previewUrl,
                                        )
                                      }
                                      className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
                                        currentPreviewUrl ===
                                          suggestion.previewUrl && isPlaying
                                          ? tc.previewBtnActive
                                          : tc.previewBtn
                                      }`}
                                    >
                                      {currentPreviewUrl ===
                                        suggestion.previewUrl && isPlaying ? (
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-4 h-4"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                        </svg>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 pt-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={`px-6 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${tc.button}`}
                >
                  {t.back}
                </button>
              )}
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex-1 px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${tc.button} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {t.next}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed || loading}
                  className={`flex-1 px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${tc.button} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {t.submit}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${tc.modal}`}
            onClick={!loading ? handleCloseModal : undefined}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-[428px] px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-lg border p-8 ${tc.modalContent}`}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-6"
                    >
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                            className={`w-2 h-2 rounded-full ${tc.dot}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                    <p className={`text-sm tracking-wide ${tc.textMuted}`}>
                      {t.listening}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <p
                        className={`text-sm tracking-wide leading-relaxed ${tc.text}`}
                      >
                        {result}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handleCloseModal}
                        className={`px-6 py-0 text-sm tracking-wide transition-colors ${tc.textMuted}`}
                      >
                        {t.close}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
