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

// Design types
export type DesignType = 'free' | 'logo' | 'pattern';
export type LogoPosition = 'center-chest' | 'left-chest' | 'right-chest' | 'back-center' | 'back-upper';

export interface Design {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  type?: DesignType; // For categorization
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

// Design element on canvas
export interface DesignElement {
  id: string;
  designId: string;
  imageUrl: string;
  placementType: DesignType; // 'free', 'logo', or 'pattern'
  logoPosition?: LogoPosition; // Only for logo type
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked?: boolean; // For logo positions - prevent movement
}

// Canvas state for each side
export interface CanvasState {
  pattern?: DesignElement; // Background pattern that repeats
  design?: DesignElement; // Free placement design or logo
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
