import { useStoryNavigation } from "./useStoryNavigation";
import {
  TextContent,
  ChoiceButtons,
  BottomControls,
  TapOverlay,
} from "./StoryComponents";

export default function App() {
  const {
    screen,
    screenKey,
    isChoice,
    isEnd,
    visibleLines,
    choiceSelected,
    showTap,
    showChoices,
    choiceReady,
    currentId,
    handleNext,
    handleChoice,
    handleEnd,
    toggleChoices,
  } = useStoryNavigation();

  if (!screen) return null;

  return (
    <div className="min-h-screen bg-stone-950 relative">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
        <div key={screenKey} className="w-full max-w-sm text-center">
          {(!isChoice || !showChoices) && (
            <TextContent lines={screen.lines} visibleLines={visibleLines} />
          )}

          {isChoice && showChoices && (
            <ChoiceButtons
              choices={screen.choices}
              choiceSelected={choiceSelected}
              onChoice={handleChoice}
            />
          )}
        </div>
      </div>

      <BottomControls
        showTap={showTap}
        isChoice={isChoice}
        isEnd={isEnd}
        currentId={currentId}
        showChoices={showChoices}
        choiceSelected={choiceSelected}
        choiceReady={choiceReady}
        onNext={handleNext}
        onToggleChoices={toggleChoices}
        onEnd={handleEnd}
      />

      {!isChoice && !isEnd && showTap && <TapOverlay onNext={handleNext} />}
    </div>
  );
}
