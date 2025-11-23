import { TShirtColor, TShirtSize, FontFamily, Design } from '@/types';

// T-Shirt configuration
export const TSHIRT_COLORS: { value: TShirtColor; label: string; hex: string }[] = [
  { value: 'white', label: 'Blanc', hex: '#FFFFFF' },
  { value: 'black', label: 'Noir', hex: '#000000' },
  { value: 'blue', label: 'Bleu', hex: '#1E40AF' },
  { value: 'red', label: 'Rouge', hex: '#DC2626' },
  { value: 'gray', label: 'Gris', hex: '#6B7280' },
];

export const TSHIRT_SIZES: { value: TShirtSize; label: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

// Font configuration
export const FONTS: { value: FontFamily; label: string; fontFamily: string }[] = [
  { value: 'classic', label: 'Classique', fontFamily: 'Arial, sans-serif' },
  { value: 'script', label: 'Script', fontFamily: 'Brush Script MT, cursive' },
  { value: 'bold', label: 'Bold', fontFamily: 'Impact, sans-serif' },
];

// Text colors
export const TEXT_COLORS = [
  { label: 'Blanc', value: '#FFFFFF' },
  { label: 'Noir', value: '#000000' },
  { label: 'Rouge', value: '#DC2626' },
  { label: 'Bleu', value: '#1E40AF' },
  { label: 'Vert', value: '#16A34A' },
  { label: 'Jaune', value: '#EAB308' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Violet', value: '#9333EA' },
  { label: 'Rose', value: '#EC4899' },
  { label: 'Gris', value: '#6B7280' },
];

// Design editor constraints
export const DESIGN_CONSTRAINTS = {
  MIN_SIZE: 50,
  MAX_SIZE: 300,
  TEXT_MIN_SIZE: 20,
  TEXT_MAX_SIZE: 100,
  TEXT_MAX_LENGTH: 50,
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 500,
  PRINT_AREA_WIDTH: 350,
  PRINT_AREA_HEIGHT: 400,
};

// Pricing for Algerian market (in DZD - Algerian Dinar)
export const PRICING = {
  BASE_PRICE: 1800, // Prix de base du t-shirt personnalisé
  DESIGN_PRICE: 200, // Supplément pour ajout de design
  TEXT_PRICE: 0, // Texte inclus gratuitement
  SHIPPING: 300, // Frais de livraison (Algérie)
};

// Price display helpers
export const formatPrice = (price: number) => {
  return `${price.toLocaleString('fr-DZ')} DA`;
};

// Design library - Emojis and simple icons
export const EMOJI_DESIGNS: Design[] = [
  // Smileys & Emotions
  { id: 'emoji-1', name: 'Sourire', emoji: '😊' },
  { id: 'emoji-2', name: 'Cool', emoji: '😎' },
  { id: 'emoji-3', name: 'Flamme', emoji: '🔥' },
  { id: 'emoji-4', name: 'Cœur', emoji: '❤️' },
  { id: 'emoji-5', name: 'Étoile', emoji: '⭐' },

  // Sports & Activities
  { id: 'emoji-6', name: 'Football', emoji: '⚽' },
  { id: 'emoji-7', name: 'Basketball', emoji: '🏀' },
  { id: 'emoji-8', name: 'Musique', emoji: '🎵' },
  { id: 'emoji-9', name: 'Gaming', emoji: '🎮' },
  { id: 'emoji-10', name: 'Café', emoji: '☕' },

  // Symbols
  { id: 'emoji-11', name: 'Paix', emoji: '✌️' },
  { id: 'emoji-12', name: 'Force', emoji: '💪' },
  { id: 'emoji-13', name: 'Ok', emoji: '👌' },
  { id: 'emoji-14', name: 'Victory', emoji: '✨' },
  { id: 'emoji-15', name: 'Lightning', emoji: '⚡' },

  // Animals
  { id: 'emoji-16', name: 'Lion', emoji: '🦁' },
  { id: 'emoji-17', name: 'Aigle', emoji: '🦅' },
  { id: 'emoji-18', name: 'Loup', emoji: '🐺' },

  // Food & Drinks
  { id: 'emoji-19', name: 'Pizza', emoji: '🍕' },
  { id: 'emoji-20', name: 'Burger', emoji: '🍔' },

  // More expressions
  { id: 'emoji-21', name: 'Rire', emoji: '😂' },
  { id: 'emoji-22', name: 'Amour', emoji: '😍' },
  { id: 'emoji-23', name: 'Thinking', emoji: '🤔' },
  { id: 'emoji-24', name: 'Party', emoji: '🎉' },

  // Algerian pride (simple icons)
  { id: 'emoji-25', name: 'Drapeau DZ', emoji: '🇩🇿' },
];
