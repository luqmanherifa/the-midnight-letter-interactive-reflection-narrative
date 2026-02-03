import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SCREENS,
  SHADOW_KEY_MAP,
  PERSONA_KEY_MAP,
} from "../constant/terjemahan";
import { SCREEN_TRANSLATIONS } from "../constant/translations";
import {
  navigate,
  setPersonaKey,
  setShadowKey,
  setChoiceSelected,
  setShowTap,
  setShowChoices,
  setChoiceReady,
  toggleChoices as toggleChoicesAction,
  resetStory,
  resetUI,
} from "../store/storySlice";

export function useStoryNavigation() {
  const dispatch = useDispatch();

  const {
    currentId,
    personaKey,
    shadowKey,
    screenKey,
    choiceSelected,
    showTap,
    showChoices,
    choiceReady,
    language,
  } = useSelector((state) => state.story);

  const getTranslatedScreen = (id) => {
    const originalScreen = SCREENS[id];
    if (!originalScreen) return null;

    if (language === "en" && SCREEN_TRANSLATIONS.en[id]) {
      return {
        ...originalScreen,
        ...SCREEN_TRANSLATIONS.en[id],
      };
    }

    return originalScreen;
  };

  const screen = getTranslatedScreen(currentId);
  const isChoice = screen?.type === "choice";
  const isReveal = screen?.type === "reveal";
  const isEnd = screen?.type === "end";
  const isTitle = screen?.type === "title";
  const visibleLines = screen?.lines.filter(Boolean).length ?? 0;

  useEffect(() => {
    dispatch(resetUI());

    if (isTitle) {
      dispatch(setShowTap(true));
    } else if (isChoice) {
      dispatch(setShowChoices(true));
      dispatch(setChoiceReady(true));
    } else if (isEnd && currentId === "end") {
      dispatch(resetStory());
    } else if (!isEnd) {
      dispatch(setShowTap(true));
    }
  }, [currentId, screenKey, isChoice, isEnd, isTitle, dispatch]);

  const handleNext = useCallback(() => {
    if (!screen) return;
    let next = screen.next;
    if (next === "__DYNAMIC_S07__") {
      next = `s07_${personaKey}${shadowKey}`;
    }
    dispatch(navigate(next));
  }, [screen, personaKey, shadowKey, dispatch]);

  const handleChoice = useCallback(
    (choice) => {
      dispatch(setChoiceSelected(choice.label));
      if (choice.next in PERSONA_KEY_MAP) {
        dispatch(setPersonaKey(PERSONA_KEY_MAP[choice.next]));
      }
      if (choice.next in SHADOW_KEY_MAP) {
        dispatch(setShadowKey(SHADOW_KEY_MAP[choice.next]));
      }
      dispatch(navigate(choice.next));
    },
    [dispatch],
  );

  const toggleChoices = useCallback(() => {
    dispatch(toggleChoicesAction());
  }, [dispatch]);

  return {
    screen,
    screenKey,
    isChoice,
    isReveal,
    isEnd,
    isTitle,
    visibleLines,
    choiceSelected,
    showTap,
    showChoices,
    choiceReady,
    currentId,
    language,
    handleNext,
    handleChoice,
    toggleChoices,
  };
}
