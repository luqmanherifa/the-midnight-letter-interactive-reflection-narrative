import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const STEPS = [
  {
    id: "feeling",
    label: "Perasaan kamu saat ini",
    placeholder: "Apa yang kamu rasakan malam ini",
    type: "input",
  },
  {
    id: "lyrics",
    label: "Penggalan lirik yang terngiang",
    placeholder: "Baris yang terus kembali di kepala",
    type: "auto-expand",
  },
  {
    id: "songTitle",
    label: "Judul lagunya",
    placeholder: "Lagu apa itu",
    type: "input",
  },
  {
    id: "artist",
    label: "Siapa yang menyanyikan",
    placeholder: "Suara siapa yang kamu dengar",
    type: "input",
  },
];

export default function Music() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    feeling: "",
    lyrics: "",
    songTitle: "",
    artist: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [theme] = useState("dark");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimer = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current && currentStep === 1) {
      textareaRef.current.style.height = "50px";
      autoResizeTextarea();
    }
  }, [currentStep]);

  const currentField = STEPS[currentStep].id;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = formData[currentField].trim().length > 0;

  const searchSongs = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`,
      );
      const data = await response.json();

      if (data.results) {
        const uniqueSongs = [];
        const seen = new Set();

        for (const item of data.results) {
          const key = `${item.trackName}-${item.artistName}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueSongs.push({
              title: item.trackName,
              artist: item.artistName,
              artwork: item.artworkUrl60,
            });
          }
        }

        setSuggestions(uniqueSongs);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (value) => {
    setFormData({ ...formData, [currentField]: value });

    if (currentField === "lyrics") {
      setTimeout(autoResizeTextarea, 0);
    }

    if (currentField === "lyrics") {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        if (value.trim().length >= 3) {
          searchSongs(value);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 500);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      lyrics: formData.lyrics,
      songTitle: suggestion.title,
      artist: suggestion.artist,
    });
    setShowSuggestions(false);
    setSuggestions([]);

    if (currentStep < STEPS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const handleKeyPress = (e) => {
    if (STEPS[currentStep].type === "auto-expand" && e.key === "Enter") {
      return;
    }

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      STEPS[currentStep].type === "input"
    ) {
      e.preventDefault();
      if (canProceed) {
        if (isLastStep) {
          handleSubmit(e);
        } else {
          handleNext();
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canProceed) return;

    setLoading(true);
    setResult("");
    setShowModal(true);

    try {
      const prompt = `
        Kamu adalah pengamat yang hidup di dalam diri seseorang.
        Kamu tidak memberi saran, tidak menenangkan, dan tidak membantu menyelesaikan apa pun.

        Seseorang datang membawa satu perasaan saat ini,
        dan satu potongan lirik yang terus terngiang di kepalanya.
        Lagu hanya menjadi asal dari lirik itu, bukan topik utama.

        Perasaan yang ia rasakan saat ini:
        "${formData.feeling}"

        Potongan lirik yang terngiang:
        "${formData.lyrics}"

        Lirik ini berasal dari lagu:
        "${formData.songTitle}" oleh ${formData.artist}

        Aturan keras:
        - Jangan membahas lagu, musik, genre, atau artis.
        - Jangan menjelaskan arti lirik.
        - Jangan mengaitkan emosi dengan suasana lagu.
        - Jangan bertanya.
        - Jangan memberi solusi atau arah.

        Tugasmu:
        Paksa hubungan antara perasaan saat ini dan potongan lirik yang terngiang,
        bukan sebagai penjelasan, tapi sebagai keberadaan yang saling menempel.
        Tunjukkan keterkaitan itu dengan yakin, meskipun tidak nyaman dan tidak diminta.

        Tulis tepat 3 paragraf pendek.
        Setiap paragraf maksimal 2 kalimat.
        Bahasa Indonesia.
        Nada tenang, datar, dan pasti.
        Tanpa metafora berlebihan.
        Tanpa kata: "mungkin", "sepertinya", "seolah".

        Akhiri tanpa kesimpulan dan tanpa penutup manis.
    `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setResult(response.text);
    } catch (error) {
      console.error(error);
      setResult(
        "Tidak ada jawaban malam ini. Tapi lagu itu tetap bermakna, dan kamu tahu itu.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResult("");
    setCurrentStep(0);
    setFormData({
      feeling: "",
      lyrics: "",
      songTitle: "",
      artist: "",
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const themeClasses = {
    dark: {
      bg: "bg-stone-950",
      text: "text-stone-300",
      label: "text-stone-400",
      input:
        "bg-transparent border-stone-700 text-stone-300 focus:border-stone-600",
      button:
        "bg-transparent border-stone-700 text-stone-300 hover:bg-stone-900/30 hover:border-stone-600",
      modal: "bg-stone-950/98 backdrop-blur-md",
      modalContent: "bg-stone-900/95 border-stone-700",
      stepInactive: "bg-stone-800",
      stepActive: "bg-stone-400",
      stepCompleted: "bg-stone-500",
    },
    light: {
      bg: "bg-gradient-to-b from-stone-50 to-stone-100",
      text: "text-stone-700",
      label: "text-stone-500",
      input:
        "bg-transparent border-stone-300 text-stone-700 focus:border-stone-400",
      button:
        "bg-transparent border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400",
      modal: "bg-stone-100/98 backdrop-blur-md",
      modalContent: "bg-stone-50 border-stone-300",
      stepInactive: "bg-stone-300",
      stepActive: "bg-stone-600",
      stepCompleted: "bg-stone-500",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 flex items-center justify-center`}
    >
      <div className="w-full max-w-[428px] min-h-screen relative">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <div className="text-center mb-12">
              <h1
                className={`text-xl tracking-widest mb-3 font-light ${
                  theme === "dark" ? "text-stone-200" : "text-stone-700"
                }`}
              >
                JARAK
              </h1>
              <p
                className={`text-sm tracking-wide leading-relaxed px-4 ${
                  theme === "dark" ? "text-stone-400" : "text-stone-500"
                }`}
              >
                Antara lirik yang kamu ingat dan perasaan yang kamu bawa
              </p>
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-center gap-2">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: index === currentStep ? 1 : 0.8,
                      }}
                      className="relative"
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index < currentStep
                            ? currentTheme.stepCompleted
                            : index === currentStep
                              ? currentTheme.stepActive
                              : currentTheme.stepInactive
                        }`}
                      />
                      {index === currentStep && (
                        <motion.div
                          layoutId="activeRing"
                          className={`absolute inset-0 -m-1 rounded-full border ${
                            theme === "dark"
                              ? "border-stone-400"
                              : "border-stone-600"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                          index < currentStep
                            ? currentTheme.stepCompleted
                            : currentTheme.stepInactive
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p
                  className={`text-xs tracking-wide ${
                    theme === "dark" ? "text-stone-500" : "text-stone-400"
                  }`}
                >
                  {currentStep + 1} dari {STEPS.length}
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
                    className={`block text-xs tracking-wide mb-2.5 ${currentTheme.label}`}
                  >
                    {STEPS[currentStep].label}
                  </label>
                  {STEPS[currentStep].type === "auto-expand" ? (
                    <textarea
                      ref={textareaRef}
                      value={formData[currentField]}
                      onChange={(e) => handleChange(e.target.value)}
                      onKeyDown={handleKeyPress}
                      maxLength={300}
                      autoFocus
                      rows={1}
                      className={`w-full px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide leading-relaxed ${currentTheme.input} focus:outline-none resize-none overflow-hidden`}
                      placeholder={STEPS[currentStep].placeholder}
                      style={{ minHeight: "50px" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[currentField]}
                      onChange={(e) => handleChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      maxLength={currentField === "feeling" ? 150 : undefined}
                      autoFocus
                      className={`w-full px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${currentTheme.input} focus:outline-none`}
                      placeholder={STEPS[currentStep].placeholder}
                    />
                  )}

                  {currentField === "lyrics" &&
                    showSuggestions &&
                    suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-50 w-full mt-2 rounded-lg border overflow-hidden ${
                          theme === "dark"
                            ? "bg-stone-900/98 border-stone-700 backdrop-blur-md"
                            : "bg-stone-50/98 border-stone-300 backdrop-blur-md"
                        }`}
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
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      theme === "dark"
                                        ? "bg-stone-400"
                                        : "bg-stone-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`px-3 py-2 text-xs border-b ${
                                  theme === "dark"
                                    ? "text-stone-500 border-stone-700"
                                    : "text-stone-400 border-stone-300"
                                }`}
                              >
                                Atau pilih dari hasil pencarian
                              </div>
                              {suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                  }
                                  className={`w-full px-3 py-3 text-left transition-colors border-b last:border-b-0 ${
                                    theme === "dark"
                                      ? "hover:bg-stone-800/50 border-stone-800"
                                      : "hover:bg-stone-100/50 border-stone-200"
                                  }`}
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
                                        className={`text-sm font-medium truncate ${
                                          theme === "dark"
                                            ? "text-stone-300"
                                            : "text-stone-700"
                                        }`}
                                      >
                                        {suggestion.title}
                                      </p>
                                      <p
                                        className={`text-xs truncate ${
                                          theme === "dark"
                                            ? "text-stone-500"
                                            : "text-stone-400"
                                        }`}
                                      >
                                        {suggestion.artist}
                                      </p>
                                    </div>
                                  </div>
                                </button>
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
                    className={`px-6 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${currentTheme.button}`}
                  >
                    Kembali
                  </button>
                )}
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`flex-1 px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${currentTheme.button} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Lanjut
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed || loading}
                    className={`flex-1 px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide ${currentTheme.button} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Lihat jaraknya
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex items-center justify-center ${currentTheme.modal}`}
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
              <div
                className={`rounded-lg border p-8 ${currentTheme.modalContent}`}
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
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
                            className={`w-2 h-2 rounded-full ${
                              theme === "dark" ? "bg-stone-400" : "bg-stone-600"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                    <p
                      className={`text-sm tracking-wide ${
                        theme === "dark" ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      Sedang melihat...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <p
                        className={`text-sm tracking-wide leading-relaxed ${
                          theme === "dark" ? "text-stone-300" : "text-stone-600"
                        }`}
                      >
                        {result}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleCloseModal}
                        className={`px-6 py-2 text-sm tracking-wide transition-colors ${
                          theme === "dark"
                            ? "text-stone-400 hover:text-stone-200"
                            : "text-stone-500 hover:text-stone-700"
                        }`}
                      >
                        tutup
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
