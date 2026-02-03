import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentId: "title",
  personaKey: null,
  shadowKey: null,
  screenKey: 0,

  choiceSelected: null,
  showTap: false,
  showChoices: false,
  choiceReady: false,

  visitedScreens: [],

  language: "id",
  theme: "dark",
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    navigate: (state, action) => {
      state.currentId = action.payload;
      state.screenKey += 1;
      state.visitedScreens.push(action.payload);
    },

    setPersonaKey: (state, action) => {
      state.personaKey = action.payload;
    },

    setShadowKey: (state, action) => {
      state.shadowKey = action.payload;
    },

    setChoiceSelected: (state, action) => {
      state.choiceSelected = action.payload;
    },

    setShowTap: (state, action) => {
      state.showTap = action.payload;
    },

    setShowChoices: (state, action) => {
      state.showChoices = action.payload;
    },

    setChoiceReady: (state, action) => {
      state.choiceReady = action.payload;
    },

    toggleChoices: (state) => {
      state.showChoices = !state.showChoices;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },

    toggleLanguage: (state) => {
      state.language = state.language === "id" ? "en" : "id";
    },

    resetStory: () => initialState,

    resetUI: (state) => {
      state.showTap = false;
      state.choiceSelected = null;
      state.showChoices = false;
      state.choiceReady = false;
    },
  },
});

export const {
  navigate,
  setPersonaKey,
  setShadowKey,
  setChoiceSelected,
  setShowTap,
  setShowChoices,
  setChoiceReady,
  toggleChoices,
  setLanguage,
  setTheme,
  toggleTheme,
  toggleLanguage,
  resetStory,
  resetUI,
} = storySlice.actions;

export default storySlice.reducer;
