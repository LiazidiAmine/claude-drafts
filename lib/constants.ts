import { TShirtColor, TShirtSize, FontFamily } from '@/types';

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

// Mock designs (to be replaced with actual design data)
export const MOCK_DESIGNS = Array.from({ length: 20 }, (_, i) => ({
  id: `design-${i + 1}`,
  name: `Design ${i + 1}`,
  imageUrl: `/designs/design-${i + 1}.png`,
  thumbnailUrl: `/designs/thumbnails/design-${i + 1}.png`,
}));
