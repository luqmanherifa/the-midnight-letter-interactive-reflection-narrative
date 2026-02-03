import { useState } from "react";
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
    type: "textarea",
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
    placeholder: "Nama penyanyi atau band",
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

  const currentField = STEPS[currentStep].id;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = formData[currentField].trim().length > 0;

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
  };

  const handleKeyPress = (e) => {
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
                >
                  <label
                    className={`block text-xs tracking-wide mb-2.5 ${currentTheme.label}`}
                  >
                    {STEPS[currentStep].label}
                  </label>
                  {STEPS[currentStep].type === "textarea" ? (
                    <textarea
                      value={formData[currentField]}
                      onChange={(e) => handleChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={4}
                      maxLength={300}
                      autoFocus
                      className={`w-full px-4 py-3.5 rounded border transition-all duration-200 text-sm tracking-wide leading-relaxed ${currentTheme.input} focus:outline-none resize-none`}
                      placeholder={STEPS[currentStep].placeholder}
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
