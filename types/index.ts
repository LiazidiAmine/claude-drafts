// Product types
export type TShirtColor = 'white' | 'black' | 'blue' | 'red' | 'gray';
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type PrintSide = 'front' | 'back';

export interface TShirt {
  id: string;
  color: TShirtColor;
  size: TShirtSize;
  price?: number; // To be defined later
}

// Design types (simplified - emojis and icons only)
export interface Design {
  id: string;
  name: string;
  emoji?: string; // For emoji designs
  icon?: string; // For icon designs (SVG path or icon name)
  imageUrl?: string; // For future custom images
}

// Text customization
export type FontFamily = 'classic' | 'script' | 'bold';

export interface TextElement {
  id: string;
  content: string;
  font: FontFamily;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  rotation: number;
}

// Design element on canvas (simplified)
export interface DesignElement {
  id: string;
  designId: string;
  emoji?: string; // Emoji character
  icon?: string; // Icon name/path
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// Canvas state for each side (simplified)
export interface CanvasState {
  design?: DesignElement; // Emoji or icon design
  text?: TextElement;
}

// Complete customization
export interface Customization {
  tshirt: TShirt;
  front: CanvasState;
  back: CanvasState;
}

// Order
export interface OrderItem extends Customization {
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
