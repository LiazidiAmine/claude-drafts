import { create } from 'zustand';
import {
  TShirt,
  TShirtColor,
  TShirtSize,
  PrintSide,
  CanvasState,
  DesignElement,
  TextElement,
  Customization,
} from '@/types';

interface CustomizerState {
  // Current t-shirt selection
  tshirt: TShirt;

  // Current editing side
  currentSide: PrintSide;

  // Canvas states
  front: CanvasState;
  back: CanvasState;

  // Actions
  setTShirtColor: (color: TShirtColor) => void;
  setTShirtSize: (size: TShirtSize) => void;
  setCurrentSide: (side: PrintSide) => void;

  // Design actions
  addDesign: (design: DesignElement, side?: PrintSide) => void;
  updateDesign: (design: Partial<DesignElement>, side?: PrintSide) => void;
  removeDesign: (side?: PrintSide) => void;

  // Text actions
  addText: (text: TextElement, side?: PrintSide) => void;
  updateText: (text: Partial<TextElement>, side?: PrintSide) => void;
  removeText: (side?: PrintSide) => void;

  // Get complete customization
  getCustomization: () => Customization;

  // Reset
  reset: () => void;
}

const initialTShirt: TShirt = {
  id: 'tshirt-1',
  color: 'white',
  size: 'M',
};

const initialState = {
  tshirt: initialTShirt,
  currentSide: 'front' as PrintSide,
  front: {},
  back: {},
};

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  ...initialState,

  setTShirtColor: (color) =>
    set((state) => ({
      tshirt: { ...state.tshirt, color },
    })),

  setTShirtSize: (size) =>
    set((state) => ({
      tshirt: { ...state.tshirt, size },
    })),

  setCurrentSide: (side) => set({ currentSide: side }),

  addDesign: (design, side) => {
    const targetSide = side || get().currentSide;
    set((state) => ({
      [targetSide]: {
        ...state[targetSide],
        design,
      },
    }));
  },

  updateDesign: (updates, side) => {
    const targetSide = side || get().currentSide;
    set((state) => {
      const currentDesign = state[targetSide].design;
      if (!currentDesign) return state;

      return {
        [targetSide]: {
          ...state[targetSide],
          design: { ...currentDesign, ...updates },
        },
      };
    });
  },

  removeDesign: (side) => {
    const targetSide = side || get().currentSide;
    set((state) => ({
      [targetSide]: {
        ...state[targetSide],
        design: undefined,
      },
    }));
  },

  addText: (text, side) => {
    const targetSide = side || get().currentSide;
    set((state) => ({
      [targetSide]: {
        ...state[targetSide],
        text,
      },
    }));
  },

  updateText: (updates, side) => {
    const targetSide = side || get().currentSide;
    set((state) => {
      const currentText = state[targetSide].text;
      if (!currentText) return state;

      return {
        [targetSide]: {
          ...state[targetSide],
          text: { ...currentText, ...updates },
        },
      };
    });
  },

  removeText: (side) => {
    const targetSide = side || get().currentSide;
    set((state) => ({
      [targetSide]: {
        ...state[targetSide],
        text: undefined,
      },
    }));
  },

  getCustomization: () => {
    const state = get();
    return {
      tshirt: state.tshirt,
      front: state.front,
      back: state.back,
    };
  },

  reset: () => set(initialState),
}));
