'use client';

import { useState } from 'react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { FONTS, TEXT_COLORS, DESIGN_CONSTRAINTS, EMOJI_DESIGNS } from '@/lib/constants';
import { TextElement, DesignElement, Design } from '@/types';

export function EditorToolbar() {
  const { front, back, currentSide, addText, updateText, removeText, addDesign, removeDesign } = useCustomizerStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        x: DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2 - 60,
        y: DESIGN_CONSTRAINTS.CANVAS_HEIGHT / 2,
        rotation: 0,
      };
      addText(newText);
    }
  };

  const handleSelectEmoji = (emojiDesign: Design) => {
    const newDesign: DesignElement = {
      id: `design-${Date.now()}`,
      designId: emojiDesign.id,
      emoji: emojiDesign.emoji,
      x: DESIGN_CONSTRAINTS.CANVAS_WIDTH / 2 - 75,
      y: DESIGN_CONSTRAINTS.CANVAS_HEIGHT / 2 - 75,
      width: 150,
      height: 150,
      rotation: 0,
    };

    addDesign(newDesign);
    setShowEmojiPicker(false);
  };

  const handleTextChange = (content: string) => {
    if (content.length <= DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH) {
      updateText({ content });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main action buttons - SIMPLIFIED */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 mb-3">PERSONNALISER</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowEmojiPicker(true)}
            disabled={!!design}
            className="py-4 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <span className="text-3xl">🎨</span>
            <span>Emoji/Icône</span>
          </button>

          <button
            onClick={handleAddText}
            disabled={!!text}
            className="py-4 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2"
          >
            <span className="text-3xl">✏️</span>
            <span>Texte</span>
          </button>
        </div>

        {/* Helpful hint */}
        <p className="text-xs text-gray-600 mt-3 text-center bg-gray-50 p-2 rounded">
          💡 {design || text ? 'Modifiez votre élément ci-dessous' : 'Choisissez un emoji ou ajoutez du texte'}
        </p>
      </div>

      {/* Emoji picker modal */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowEmojiPicker(false)}>
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Choisir un emoji</h2>
            <p className="text-sm text-gray-700 mb-4">
              Sélectionnez un emoji pour votre t-shirt
            </p>

            <div className="grid grid-cols-4 gap-3">
              {EMOJI_DESIGNS.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => handleSelectEmoji(emoji)}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all flex flex-col items-center gap-1"
                  title={emoji.name}
                >
                  <span className="text-4xl">{emoji.emoji}</span>
                  <span className="text-[10px] text-gray-600">{emoji.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowEmojiPicker(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-bold"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Text editor */}
      {text && (
        <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-green-500 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">✏️ Éditer le texte</h3>
            <button
              onClick={() => removeText()}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-bold"
            >
              Supprimer
            </button>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Votre texte</label>
            <input
              type="text"
              value={text.content}
              onChange={(e) => handleTextChange(e.target.value)}
              maxLength={DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-900 font-bold text-lg placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none"
              placeholder="Tapez votre texte..."
            />
            <p className="text-xs text-gray-600 mt-1 font-medium">
              {text.content.length}/{DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH} caractères
            </p>
          </div>

          {/* Font selector */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Police</label>
            <select
              value={text.font}
              onChange={(e) => updateText({ font: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-900 font-bold focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none"
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
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Taille: {text.fontSize}px
            </label>
            <input
              type="range"
              min={DESIGN_CONSTRAINTS.TEXT_MIN_SIZE}
              max={DESIGN_CONSTRAINTS.TEXT_MAX_SIZE}
              value={text.fontSize}
              onChange={(e) => updateText({ fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Petit</span>
              <span>Grand</span>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Inclinaison: {text.rotation}°
            </label>
            <input
              type="range"
              min={-45}
              max={45}
              value={text.rotation}
              onChange={(e) => updateText({ rotation: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>↶ -45°</span>
              <span>0°</span>
              <span>45° ↷</span>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Couleur</label>
            <div className="grid grid-cols-5 gap-3">
              {TEXT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => updateText({ color: colorOption.value })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    text.color === colorOption.value
                      ? 'border-4 border-green-600 ring-4 ring-green-200 scale-110'
                      : 'border-2 border-gray-400 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            💡 Glissez votre texte sur le t-shirt pour le positionner
          </p>
        </div>
      )}

      {/* Design info */}
      {design && (
        <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-purple-500">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">
              🎨 Emoji ajouté : {design.emoji}
            </h3>
            <button
              onClick={() => removeDesign()}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-bold"
            >
              Supprimer
            </button>
          </div>

          <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded-lg">
            💡 Utilisez la souris pour <strong>déplacer</strong> et <strong>redimensionner</strong> l'emoji
          </p>
        </div>
      )}
    </div>
  );
}
