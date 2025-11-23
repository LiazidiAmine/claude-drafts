'use client';

import { useState } from 'react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { FONTS, TEXT_COLORS, DESIGN_CONSTRAINTS } from '@/lib/constants';
import { TextElement, FontFamily } from '@/types';

export function EditorToolbar() {
  const { front, back, currentSide, addText, updateText, removeText, removeDesign } = useCustomizerStore();
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);

  const currentCanvas = currentSide === 'front' ? front : back;
  const { design, text } = currentCanvas;

  const handleAddText = () => {
    if (!text) {
      const newText: TextElement = {
        id: `text-${Date.now()}`,
        content: 'Votre texte',
        font: 'classic',
        color: '#000000',
        fontSize: 40,
        x: DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2 - 50,
        y: DESIGN_CONSTRAINTS.CANVAS_HEIGHT / 2,
        rotation: 0,
      };
      addText(newText);
    }
    setShowTextEditor(true);
  };

  const handleTextChange = (content: string) => {
    if (content.length <= DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH) {
      updateText({ content });
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowDesignPicker(true)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!!design}
        >
          + Ajouter Design
        </button>
        <button
          onClick={handleAddText}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          disabled={!!text}
        >
          + Ajouter Texte
        </button>
      </div>

      {/* Text editor */}
      {text && (
        <div className="p-4 border border-gray-300 rounded-lg bg-white space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Éditer le texte</h3>
            <button
              onClick={() => removeText()}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Texte</label>
            <input
              type="text"
              value={text.content}
              onChange={(e) => handleTextChange(e.target.value)}
              maxLength={DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Votre texte..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.content.length}/{DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH}
            </p>
          </div>

          {/* Font selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Police</label>
            <select
              value={text.font}
              onChange={(e) => updateText({ font: e.target.value as FontFamily })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font size */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Taille: {text.fontSize}px
            </label>
            <input
              type="range"
              min={DESIGN_CONSTRAINTS.TEXT_MIN_SIZE}
              max={DESIGN_CONSTRAINTS.TEXT_MAX_SIZE}
              value={text.fontSize}
              onChange={(e) => updateText({ fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Couleur</label>
            <div className="grid grid-cols-5 gap-2">
              {TEXT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => updateText({ color: colorOption.value })}
                  className={`w-10 h-10 rounded-md border-2 ${
                    text.color === colorOption.value
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Design controls */}
      {design && (
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Design ajouté</h3>
            <button
              onClick={() => removeDesign()}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Utilisez la souris pour déplacer, redimensionner et faire pivoter le design sur le canvas.
          </p>
        </div>
      )}

      {/* Design picker modal */}
      {showDesignPicker && (
        <DesignPickerModal onClose={() => setShowDesignPicker(false)} />
      )}
    </div>
  );
}

// Placeholder for design picker modal
function DesignPickerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Sélectionner un design</h2>
        <p className="text-gray-600 mb-4">
          La bibliothèque de designs sera implémentée prochainement.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
