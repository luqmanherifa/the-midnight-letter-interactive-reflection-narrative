import { useState, useEffect, useRef, useCallback } from "react";

const SCREENS = {
  entry: {
    id: "entry",
    type: "text",
    lines: ["Kamu tidak tersesat.", "Kamu hanya berhenti sebentar.", ""],
    choices: null,
    next: "s01",
  },
  s01: {
    id: "s01",
    type: "text",
    lines: [
      "Aku sudah melihatmu cukup lama.",
      "Aku tahu caramu diam dan pura-pura.",
      "Tenang. Aku tidak datang untuk menilai.",
    ],
    choices: null,
    next: "s02",
  },
  s02: {
    id: "s02",
    type: "choice",
    lines: [
      "Kalau orang lain melihatmu hari ini,",
      "mereka mungkin akan bilang kamu…",
      "",
    ],
    choices: [
      { label: "terlihat baik-baik saja", next: "s03a" },
      { label: "terlihat sibuk dan kuat", next: "s03b" },
      { label: "terlihat tenang, meski kosong", next: "s03c" },
      { label: "tidak ada yang benar-benar melihat", next: "s03d" },
    ],
    next: null,
  },
  s03a: {
    id: "s03a",
    type: "text",
    lines: [
      "Baik-baik saja adalah kata yang paling lelah.",
      "Aku tahu berapa energi yang kamu habiskan.",
      "Untuk menjaga kata itu tetap berdiri.",
    ],
    choices: null,
    next: "s04a",
  },
  s03b: {
    id: "s03b",
    type: "text",
    lines: [
      "Sibuk bisa menjadi cara paling halus untuk bersembunyi.",
      "Aku menonton kamu berlari dari satu hal ke hal lain.",
      "Dan tidak pernah berhenti untuk bertanya pada diri sendiri.",
    ],
    choices: null,
    next: "s04b",
  },
  s03c: {
    id: "s03c",
    type: "text",
    lines: [
      "Tenang yang kosong adalah yang paling berat.",
      "Orang mengira itu kedamaian padahal itu lelah.",
      "Aku tahu kamu tahu perbedaannya.",
    ],
    choices: null,
    next: "s04c",
  },
  s03d: {
    id: "s03d",
    type: "text",
    lines: [
      "Tidak dilihat adalah rasa yang paling biasa.",
      "Bukan karena kamu tidak ada di sana.",
      "Tapi karena kamu tidak pernah mengambil tempat.",
    ],
    choices: null,
    next: "s04d",
  },
  s04a: {
    id: "s04a",
    type: "choice",
    lines: [
      "Tapi di balik semua itu, kamu lebih sering merasa…",
      "Hal yang tidak kamu bawa keluar rumah.",
      "",
    ],
    choices: [
      { label: "lelah tanpa sebab yang jelas", next: "s05a" },
      { label: "sedih tanpa cerita yang rapi", next: "s05b" },
      { label: "marah pada diri sendiri", next: "s05c" },
      { label: "rindu pada sesuatu yang tidak bisa disebut", next: "s05d" },
    ],
    next: null,
  },
  s04b: {
    id: "s04b",
    type: "choice",
    lines: [
      "Di celah-celah kesibukanmu, ada yang menunggu.",
      "Perasaan yang tidak pernah dapat giliran bicara.",
      "",
    ],
    choices: [
      { label: "lelah tanpa sebab yang jelas", next: "s05a" },
      { label: "sedih tanpa cerita yang rapi", next: "s05b" },
      { label: "marah pada diri sendiri", next: "s05c" },
      { label: "rindu pada sesuatu yang tidak bisa disebut", next: "s05d" },
    ],
    next: null,
  },
  s04c: {
    id: "s04c",
    type: "choice",
    lines: [
      "Di balik ketenangan itu, ada sesuatu yang menggerak.",
      "Sangat pelan, sangat sunyi, tapi ada.",
      "",
    ],
    choices: [
      { label: "lelah tanpa sebab yang jelas", next: "s05a" },
      { label: "sedih tanpa cerita yang rapi", next: "s05b" },
      { label: "marah pada diri sendiri", next: "s05c" },
      { label: "rindu pada sesuatu yang tidak bisa disebut", next: "s05d" },
    ],
    next: null,
  },
  s04d: {
    id: "s04d",
    type: "choice",
    lines: [
      "Justru karena tidak ada yang melihat, kamu bebas.",
      "Untuk mengakui hal yang paling tersembunyi.",
      "",
    ],
    choices: [
      { label: "lelah tanpa sebab yang jelas", next: "s05a" },
      { label: "sedih tanpa cerita yang rapi", next: "s05b" },
      { label: "marah pada diri sendiri", next: "s05c" },
      { label: "rindu pada sesuatu yang tidak bisa disebut", next: "s05d" },
    ],
    next: null,
  },
  s05a: {
    id: "s05a",
    type: "text",
    lines: [
      "Lelah yang tidak punya nama adalah yang paling berat.",
      "Bukan karena tidak ada alasan.",
      "Tapi karena alasannya terlalu banyak untuk dihitung.",
    ],
    choices: null,
    next: "s06a",
  },
  s05b: {
    id: "s05b",
    type: "text",
    lines: [
      "Sedih yang tidak rapi adalah sedih yang paling jujur.",
      "Tidak perlu cerita untuk membenarkannya.",
      "Ia ada, dan itu cukup untuk mengakuinya.",
    ],
    choices: null,
    next: "s06b",
  },
  s05c: {
    id: "s05c",
    type: "text",
    lines: [
      "Marah pada diri sendiri biasanya bukan tentang kesalahan.",
      "Tapi tentang semua hal yang kamu rasa seharusnya.",
      "Dan tidak pernah menjadi seperti yang kamu bayangkan.",
    ],
    choices: null,
    next: "s06c",
  },
  s05d: {
    id: "s05d",
    type: "text",
    lines: [
      "Rindu yang tidak punya alamat adalah yang paling aneh.",
      "Bukan tentang seseorang yang pergi.",
      "Tapi tentang versi hidupmu yang tidak pernah datang.",
    ],
    choices: null,
    next: "s06d",
  },
  s06a: {
    id: "s06a",
    type: "text",
    lines: [
      "Kamu mungkin mengira ini tentang orang tertentu.",
      "Tapi kelelahan ini terlalu besar untuk satu nama.",
      "Ia datang dari tempat yang lebih dalam dari itu.",
    ],
    choices: null,
    next: "__DYNAMIC_S07__",
  },
  s06b: {
    id: "s06b",
    type: "text",
    lines: [
      "Banyak orang akan mengira kamu sedih karena seseorang.",
      "Tapi kesedihan ini lebih tua dari siapa pun.",
      "Ia sudah ada sebelum kamu mengenal nama apa pun.",
    ],
    choices: null,
    next: "__DYNAMIC_S07__",
  },
  s06c: {
    id: "s06c",
    type: "text",
    lines: [
      "Orang sering mengira kemarahan ini punya target.",
      "Tapi ini bukan tentang siapa yang mengecewakan.",
      "Ini tentang jarak antara kamu dan bayangan dirimu.",
    ],
    choices: null,
    next: "__DYNAMIC_S07__",
  },
  s06d: {
    id: "s06d",
    type: "text",
    lines: [
      "Orang mengira kerinduan ini punya wajah.",
      "Tapi yang kamu rindukan bukan seseorang.",
      "Ia adalah versi dari hidupmu yang terus berjalan tanpamu.",
    ],
    choices: null,
    next: "__DYNAMIC_S07__",
  },
  s07_aa: {
    id: "s07_aa",
    type: "text",
    lines: [
      "Seperti rumah yang selalu rapi tapi lampunya tidak pernah menyala.",
      "Semuanya di tempat yang benar.",
      "Tapi ada sesuatu yang sudah pergi dari dalamnya.",
    ],
    choices: null,
    next: "s08",
  },
  s07_ab: {
    id: "s07_ab",
    type: "text",
    lines: [
      "Seperti surat yang sudah dikirim tapi tidak pernah tiba.",
      "Kata-katanya masih ada di dalam amplop.",
      "Tapi tangan yang menulis sudah melanjutkan hidupnya.",
    ],
    choices: null,
    next: "s08",
  },
  s07_ac: {
    id: "s07_ac",
    type: "text",
    lines: [
      "Seperti cermin yang dipasang sempurna tapi kamu tidak berani mendekati.",
      "Bayangan di sana masih ada.",
      "Dan ia menunggu kamu dengan sabar.",
    ],
    choices: null,
    next: "s08",
  },
  s07_ad: {
    id: "s07_ad",
    type: "text",
    lines: [
      "Seperti jalan yang sudah kamu hafal tapi kamu lewati terlalu cepat.",
      "Setiap tikungannya masih ada.",
      "Tapi kamu tidak pernah berhenti untuk duduk di sana.",
    ],
    choices: null,
    next: "s08",
  },
  s07_ba: {
    id: "s07_ba",
    type: "text",
    lines: [
      "Seperti mesin yang terus berjalan malam dan siang.",
      "Suaranya mengisi seluruh ruangan.",
      "Tapi tidak ada yang mendengar apa yang ia minta.",
    ],
    choices: null,
    next: "s08",
  },
  s07_bb: {
    id: "s07_bb",
    type: "text",
    lines: [
      "Seperti musik yang dimainkan di ruangan kosong.",
      "Nadanya sempurna dan tidak ada yang mendengarkan.",
      "Dan pemainnya tidak tahu kapan ia bisa berhenti.",
    ],
    choices: null,
    next: "s08",
  },
  s07_bc: {
    id: "s07_bc",
    type: "text",
    lines: [
      "Seperti anak tangga yang selalu kamu naiki.",
      "Kamu sampai di atasnya dan tidak ada yang menunggu.",
      "Hanya udara dan pertanyaan yang sama.",
    ],
    choices: null,
    next: "s08",
  },
  s07_bd: {
    id: "s07_bd",
    type: "text",
    lines: [
      "Seperti kereta yang selalu tepat jadwal tapi tidak pernah berhenti.",
      "Kamu menonton platform berlalu dari jendela.",
      "Dan satu di antaranya harusnya menjadi milikmu.",
    ],
    choices: null,
    next: "s08",
  },
  s07_ca: {
    id: "s07_ca",
    type: "text",
    lines: [
      "Seperti danau yang permukaannya sempurna tenang.",
      "Tidak ada yang tahu berapa dalamnya di bawah sana.",
      "Dan air itu tidak pernah naik untuk memberitahu.",
    ],
    choices: null,
    next: "s08",
  },
  s07_cb: {
    id: "s07_cb",
    type: "text",
    lines: [
      "Seperti hujan yang turun di malam yang sudah gelap.",
      "Tidak ada yang melihat tapi tanahnya tetap basah.",
      "Dan di pagi hari semua orang bilang cuacanya bagus.",
    ],
    choices: null,
    next: "s08",
  },
  s07_cc: {
    id: "s07_cc",
    type: "text",
    lines: [
      "Seperti taman yang terlihat indah dari luar pagar.",
      "Tapi di dalamnya ada pohon yang sudah lama kering.",
      "Dan tidak ada yang masuk untuk menyiram.",
    ],
    choices: null,
    next: "s08",
  },
  s07_cd: {
    id: "s07_cd",
    type: "text",
    lines: [
      "Seperti pantai di pagi hari yang sangat sunyi.",
      "Ombaknya masih datang dan pergi seperti biasanya.",
      "Tapi jejak kakimu dari kemarin sudah dihapus.",
    ],
    choices: null,
    next: "s08",
  },
  s07_da: {
    id: "s07_da",
    type: "text",
    lines: [
      "Seperti lampu di lorong yang tidak pernah ada fotonya.",
      "Ia menyala setiap malam tanpa siapa pun tahu.",
      "Dan terobosan yang ia berikan tidak pernah dicatat.",
    ],
    choices: null,
    next: "s08",
  },
  s07_db: {
    id: "s07_db",
    type: "text",
    lines: [
      "Seperti halaman buku yang tidak pernah dibaca sampai habis.",
      "Kata-katanya masih ada di sana setiap kali buku itu dibuka.",
      "Tapi tidak ada yang tahu cerita apa yang menunggu.",
    ],
    choices: null,
    next: "s08",
  },
  s07_dc: {
    id: "s07_dc",
    type: "text",
    lines: [
      "Seperti bayangan yang selalu ikut tapi tidak pernah disapa.",
      "Ia ada di samping kamu setiap hari.",
      "Dan ia mulai capek menunggu untuk diakui.",
    ],
    choices: null,
    next: "s08",
  },
  s07_dd: {
    id: "s07_dd",
    type: "text",
    lines: [
      "Seperti pintu yang selalu terbuka tapi tidak ada yang masuk.",
      "Anginnya masih terasa dari dalam ruangan.",
      "Tapi tidak ada suara yang menyebut nama tempat itu.",
    ],
    choices: null,
    next: "s08",
  },

  s08: {
    id: "s08",
    type: "text",
    lines: [
      "Kamu sering berpikir seharusnya kamu sudah di tempat lain.",
      "Tempat di mana semuanya terasa lebih pasti dan pantas.",
      "Tempat yang terasa lebih benar dari di sini.",
    ],
    choices: null,
    next: "s09",
  },
  s09: {
    id: "s09",
    type: "choice",
    lines: [
      "Tapi kamu ada di sini.",
      "Dan yang paling melelahkan bukan posisimu.",
      "Tapi perbandingan dengan hidup yang tidak pernah terjadi.",
    ],
    choices: [
      { label: "aku tahu, dan aku sudah capek membandingkan", next: "s10a" },
      { label: "aku tidak tahu kapan aku mulai melakukan itu", next: "s10b" },
      { label: "aku masih mencoba berhenti melakukannya", next: "s10c" },
      { label: "aku tidak yakin itu yang aku rasakan", next: "s10d" },
    ],
    next: null,
  },
  s10a: {
    id: "s10a",
    type: "text",
    lines: [
      "Lelah dari perbandingan adalah langkah pertama yang nyata.",
      "Bukan berarti kamu sudah sampai di mana pun.",
      "Tapi kamu mulai berhenti mengukur dari garis yang salah.",
    ],
    choices: null,
    next: "s11",
  },
  s10b: {
    id: "s10b",
    type: "text",
    lines: [
      "Tidak tahu kapan dimulai adalah cara paling jujur untuk mengakui.",
      "Karena ia tidak masuk dengan pintu yang terlihat.",
      "Ia masuk perlahan, dari celah-celah hari yang biasa.",
    ],
    choices: null,
    next: "s11",
  },
  s10c: {
    id: "s10c",
    type: "text",
    lines: [
      "Mencoba berhenti pun adalah bentuk kesadaran.",
      "Kamu sudah tahu sesuatu yang bergerak di dalam.",
      "Dan mengakuinya adalah yang paling susah dari semuanya.",
    ],
    choices: null,
    next: "s11",
  },
  s10d: {
    id: "s10d",
    type: "text",
    lines: [
      "Tidak yakin pun boleh.",
      "Kamu tidak harus mengerti semuanya malam ini.",
      "Cukup kamu ada di sini dan jujur dengan ketidaktahuannya.",
    ],
    choices: null,
    next: "s11",
  },
  s11: {
    id: "s11",
    type: "text",
    lines: [
      "Dari tadi kamu mengira aku berbicara tentang hidupmu.",
      "Padahal, aku berbicara dari dalamnya.",
      "Aku tidak menunggumu di depan. Aku berjalan di sampingmu.",
    ],
    choices: null,
    next: "s12",
  },
  s12: {
    id: "s12",
    type: "reveal",
    lines: [
      "Aku bukan kenangan. Aku bukan orang. Aku bukan perasaan.",
      "Aku adalah bagian hidupmu yang terus berjalan.",
      "Bahkan saat kamu berhenti percaya pada diri sendiri.",
    ],
    choices: null,
    next: "s13",
  },
  s13: {
    id: "s13",
    type: "end",
    lines: [
      "Kamu tidak kehilangan apa-apa malam ini.",
      "Kamu hanya menyadari bahwa aku selalu ada.",
      "Dan meski hidup terasa berat, kamu tetap menjalaninya.",
    ],
    choices: null,
    next: "end",
  },
  end: {
    id: "end",
    type: "end",
    lines: ["Kamu boleh kembali kapan pun.", "Aku tidak ke mana-mana.", ""],
    choices: null,
    next: null,
  },
};

const SHADOW_KEY_MAP = { s05a: "a", s05b: "b", s05c: "c", s05d: "d" };
const PERSONA_KEY_MAP = { s03a: "a", s03b: "b", s03c: "c", s03d: "d" };

export default function TheMidnightLetter() {
  const [currentId, setCurrentId] = useState("entry");
  const [personaKey, setPersonaKey] = useState(null);
  const [shadowKey, setShadowKey] = useState(null);
  const [screenKey, setScreenKey] = useState(0);
  const [choiceSelected, setChoiceSelected] = useState(null);
  const [showTap, setShowTap] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [choiceReady, setChoiceReady] = useState(false);
  const tapTimerRef = useRef(null);
  const choiceTimerRef = useRef(null);

  const screen = SCREENS[currentId];
  const isChoice = screen?.type === "choice";
  const isReveal = screen?.type === "reveal";
  const isEnd = screen?.type === "end";
  const visibleLines = screen?.lines.filter(Boolean).length ?? 0;

  useEffect(() => {
    setShowTap(false);
    setChoiceSelected(null);
    setShowChoices(false);
    setChoiceReady(false);
    clearTimeout(tapTimerRef.current);
    clearTimeout(choiceTimerRef.current);

    if (isChoice) {
      choiceTimerRef.current = setTimeout(() => {
        setShowChoices(true);
        setChoiceReady(true);
      }, 1800);
    } else if (!isEnd) {
      tapTimerRef.current = setTimeout(() => setShowTap(true), 600);
    }

    return () => {
      clearTimeout(tapTimerRef.current);
      clearTimeout(choiceTimerRef.current);
    };
  }, [currentId, screenKey]);

  const navigate = useCallback((nextId) => {
    if (!nextId) return;
    setCurrentId(nextId);
    setScreenKey((k) => k + 1);
  }, []);

  const handleNext = useCallback(() => {
    if (!screen) return;
    let next = screen.next;
    if (next === "__DYNAMIC_S07__") {
      next = `s07_${personaKey}${shadowKey}`;
    }
    navigate(next);
  }, [screen, personaKey, shadowKey, navigate]);

  const handleChoice = useCallback(
    (choice) => {
      setChoiceSelected(choice.label);
      if (choice.next in PERSONA_KEY_MAP)
        setPersonaKey(PERSONA_KEY_MAP[choice.next]);
      if (choice.next in SHADOW_KEY_MAP)
        setShadowKey(SHADOW_KEY_MAP[choice.next]);
      setTimeout(() => navigate(choice.next), 300);
    },
    [navigate],
  );

  const handleEnd = useCallback(() => {
    setCurrentId("entry");
    setPersonaKey(null);
    setShadowKey(null);
    setScreenKey((k) => k + 1);
  }, []);

  if (!screen) return null;

  return (
    <div className="min-h-screen bg-stone-950 relative">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
        <div key={screenKey} className="w-full max-w-sm text-center">
          {(!isChoice || !showChoices) &&
            screen.lines.map((line, i) =>
              line ? (
                <p
                  key={i}
                  className={`
                  leading-relaxed tracking-wide
                  text-sm text-stone-300
                  ${i < visibleLines - 1 ? "mb-4" : ""}
                `}
                >
                  {line}
                </p>
              ) : null,
            )}

          {isChoice && showChoices && (
            <div className="flex flex-col gap-2.5 pointer-events-auto">
              {screen.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => !choiceSelected && handleChoice(choice)}
                  className={`
                    w-full text-left px-4 py-3.5 rounded cursor-pointer
                    text-sm tracking-wide border
                    ${
                      choiceSelected === choice.label
                        ? "bg-stone-800 border-stone-600 text-stone-300"
                        : choiceSelected
                          ? "bg-transparent border-stone-700 text-stone-300 opacity-40"
                          : "bg-transparent border-stone-700 text-stone-300"
                    }
                  `}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 pb-24 flex justify-center pointer-events-auto">
        {showTap && !isChoice && !isEnd && (
          <button
            onClick={handleNext}
            className="cursor-pointer text-sm text-stone-300"
          >
            lanjut
          </button>
        )}

        {isChoice && showChoices && !choiceSelected && (
          <button
            onClick={() => setShowChoices((v) => !v)}
            className="cursor-pointer text-stone-300 w-8 h-8 flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 640 640"
              fill="currentColor"
            >
              <path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5zM286 196.6C296.8 193.6 308.2 192.1 319.9 192.1C328.7 192.1 337.4 193 345.7 194.7C346 194.8 346.2 194.8 346.5 194.9C404.4 207.1 447.9 258.6 447.9 320.1C447.9 390.8 390.6 448.1 319.9 448.1C258.3 448.1 206.9 404.6 194.7 346.7C192.9 338.1 191.9 329.2 191.9 320.1C191.9 309.1 193.3 298.3 195.9 288.1C196.1 287.4 196.2 286.8 196.4 286.2C208.3 242.8 242.5 208.6 285.9 196.7z" />
            </svg>
          </button>
        )}
        {isChoice && !showChoices && choiceReady && (
          <button
            onClick={() => setShowChoices((v) => !v)}
            className="cursor-pointer text-stone-300 w-8 h-8 flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 640 640"
              fill="currentColor"
            >
              <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM208.9 175.1C241 156.2 278.1 144 320 144C385.2 144 438.8 173.6 479.9 211.7C518.4 247.4 545 290 558.5 320C544.9 350 518.3 392.5 479.9 428.3C476.8 431.1 473.7 433.9 470.5 436.7L425.8 392C439.8 371.5 448 346.7 448 320C448 249.3 390.7 192 320 192C293.3 192 268.5 200.2 248 214.2L208.9 175.1zM390.9 357.1L282.9 249.1C294 243.3 306.6 240 320 240C364.2 240 400 275.8 400 320C400 333.4 396.7 346 390.9 357.1zM135.4 237.2L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L384.2 486C364.2 492.4 342.8 496 320 496C254.8 496 201.2 466.4 160.1 428.3C121.6 392.6 95 350 81.5 320C91.9 296.9 110.1 266.4 135.5 237.2z" />
            </svg>
          </button>
        )}

        {isEnd && currentId === "s13" && (
          <button
            onClick={handleNext}
            className="cursor-pointer text-sm text-stone-300"
          >
            tap untuk menutup surat
          </button>
        )}
        {isEnd && currentId === "end" && (
          <button
            onClick={handleEnd}
            className="cursor-pointer text-sm text-stone-300"
          >
            mulai ulang
          </button>
        )}
      </div>

      {!isChoice && !isEnd && showTap && (
        <div
          className="fixed inset-0 z-0 cursor-pointer"
          onClick={handleNext}
        />
      )}
    </div>
  );
}
