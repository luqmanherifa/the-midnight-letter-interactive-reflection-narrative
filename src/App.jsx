import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useStoryNavigation } from "./useStoryNavigation";
import {
  TitleScreen,
  TextContent,
  ChoiceButtons,
  BottomControls,
  ProgressIndicator,
} from "./StoryComponents";

export default function App() {
  const { theme } = useSelector((state) => state.story);

  const {
    screen,
    screenKey,
    isChoice,
    isEnd,
    isTitle,
    visibleLines,
    choiceSelected,
    showTap,
    showChoices,
    choiceReady,
    currentId,
    handleNext,
    handleChoice,
    toggleChoices,
  } = useStoryNavigation();

  const [showButtons, setShowButtons] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setShowButtons(false);
  }, [screenKey]);

  const handleTypewriterComplete = () => {
    setTimeout(() => {
      setShowButtons(true);
    }, 800);
  };

  const themeClasses = {
    dark: {
      bg: "bg-stone-950",
      text: "text-stone-300",
    },
    light: {
      bg: "bg-gradient-to-b from-stone-50 to-stone-100",
      text: "text-stone-700",
    },
  };

  const currentTheme = themeClasses[theme];

  if (!screen) return null;

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 flex items-center justify-center`}
    >
      <div className="w-full max-w-[428px] min-h-screen relative">
        {!isTitle && <ProgressIndicator currentId={currentId} />}

        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div
            key={screenKey}
            ref={contentRef}
            className="w-full max-w-sm"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isTitle && <TitleScreen />}

            {!isTitle && (
              <div className="w-full text-center">
                <TextContent
                  lines={screen.lines}
                  visibleLines={visibleLines}
                  onTypewriterComplete={
                    isChoice ? handleTypewriterComplete : undefined
                  }
                />

                {isChoice && showChoices && (
                  <ChoiceButtons
                    choices={screen.choices}
                    choiceSelected={choiceSelected}
                    onChoice={handleChoice}
                    show={showButtons}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <BottomControls
          showTap={showTap}
          isChoice={isChoice}
          isEnd={isEnd}
          isTitle={isTitle}
          currentId={currentId}
          showChoices={showChoices}
          choiceSelected={choiceSelected}
          choiceReady={choiceReady}
          onNext={handleNext}
          onToggleChoices={toggleChoices}
        />
      </div>
    </div>
  );
}
