'use client';

import { useCustomizerStore } from '@/store/useCustomizerStore';
import { TSHIRT_COLORS, TSHIRT_SIZES } from '@/lib/constants';
import { TShirtColor, TShirtSize } from '@/types';

export function ProductSelector() {
  const { tshirt, setTShirtColor, setTShirtSize } = useCustomizerStore();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div>
        <h2 className="text-lg font-semibold mb-4">Personnaliser votre T-shirt</h2>
      </div>

      {/* Color selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Couleur: {TSHIRT_COLORS.find((c) => c.value === tshirt.color)?.label}
        </label>
        <div className="flex gap-3">
          {TSHIRT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setTShirtColor(color.value as TShirtColor)}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                tshirt.color === color.value
                  ? 'border-blue-600 ring-4 ring-blue-200 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      {/* Size selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Taille: {tshirt.size}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {TSHIRT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => setTShirtSize(size.value as TShirtSize)}
              className={`py-2 px-4 border-2 rounded-md transition-all font-medium ${
                tshirt.size === size.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
