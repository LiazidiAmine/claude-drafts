'use client';

import { useState } from 'react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { FONTS, TEXT_COLORS, DESIGN_CONSTRAINTS, LOGO_POSITIONS } from '@/lib/constants';
import { TextElement, FontFamily, DesignElement, LogoPosition } from '@/types';

type EditorMode = 'none' | 'design' | 'logo' | 'pattern' | 'text';

export function EditorToolbar() {
  const { front, back, currentSide, addText, updateText, removeText, addDesign, removeDesign, addPattern, removePattern } = useCustomizerStore();
  const [editorMode, setEditorMode] = useState<EditorMode>('none');
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [selectedLogoPosition, setSelectedLogoPosition] = useState<LogoPosition | null>(null);

  const currentCanvas = currentSide === 'front' ? front : back;
  const { design, text, pattern } = currentCanvas;

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
    setEditorMode('text');
  };

  const handleAddLogo = (position: LogoPosition) => {
    const logoConfig = LOGO_POSITIONS[position];

    // Using emoji as placeholder - in real app, user would select from library
    const newLogo: DesignElement = {
      id: `logo-${Date.now()}`,
      designId: 'emoji-logo',
      imageUrl: '', // Empty = will use emoji placeholder
      placementType: 'logo',
      logoPosition: position,
      x: logoConfig.x,
      y: logoConfig.y,
      width: logoConfig.width,
      height: logoConfig.height,
      rotation: 0,
      locked: true, // Cannot be moved!
    };

    addDesign(newLogo);
    setEditorMode('logo');
    setSelectedLogoPosition(null);
  };

  const handleTextChange = (content: string) => {
    if (content.length <= DESIGN_CONSTRAINTS.TEXT_MAX_LENGTH) {
      updateText({ content });
    }
  };

  const handleRemoveElement = () => {
    if (editorMode === 'text') {
      removeText();
    } else if (editorMode === 'design' || editorMode === 'logo') {
      removeDesign();
    } else if (editorMode === 'pattern') {
      removePattern();
    }
    setEditorMode('none');
  };

  // Filter logo positions by current side
  const availableLogoPositions = Object.entries(LOGO_POSITIONS).filter(
    ([_, config]) => config.side === currentSide
  );

  return (
    <div className="space-y-4">
      {/* Main action buttons - VERY VISIBLE */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 mb-3">AJOUTER UN ÉLÉMENT</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowDesignPicker(true)}
            disabled={!!design || !!pattern}
            className="py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🎨</span>
            <span>Design Libre</span>
          </button>

          <button
            onClick={() => setSelectedLogoPosition('select')}
            disabled={!!design || !!pattern}
            className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
          >
            <span className="text-2xl">📍</span>
            <span>Logo Fixe</span>
          </button>

          <button
            onClick={() => setShowDesignPicker(true)}
            disabled={!!pattern}
            className="py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🔲</span>
            <span>Pattern</span>
          </button>

          <button
            onClick={handleAddText}
            disabled={!!text}
            className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
          >
            <span className="text-2xl">✏️</span>
            <span>Texte</span>
          </button>
        </div>

        {/* Helpful hint */}
        <p className="text-xs text-gray-600 mt-3 text-center">
          💡 Cliquez sur un bouton pour ajouter un élément
        </p>
      </div>

      {/* Logo position selector modal */}
      {selectedLogoPosition === 'select' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choisir la position du logo</h2>
            <p className="text-sm text-gray-700 mb-4">
              Les logos ont des positions prédéfinies pour un rendu professionnel
            </p>

            <div className="space-y-2">
              {availableLogoPositions.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleAddLogo(key as LogoPosition)}
                  className="w-full py-3 px-4 border-2 border-gray-400 bg-white text-gray-900 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-left"
                >
                  {config.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedLogoPosition(null)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-bold"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Text editor - WHEN TEXT IS ADDED */}
      {text && editorMode === 'text' && (
        <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-green-500 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">✏️ Éditer le texte</h3>
            <button
              onClick={handleRemoveElement}
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
              placeholder="Tapez votre texte ici..."
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
              onChange={(e) => updateText({ font: e.target.value as FontFamily })}
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
            <label className="block text-sm font-bold text-gray-900 mb-2">Couleur du texte</label>
            <div className="grid grid-cols-5 gap-3">
              {TEXT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => updateText({ color: colorOption.value })}
                  className={`w-12 h-12 rounded-lg border-3 transition-all ${
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
            💡 Glissez-déposez votre texte sur le canvas pour le positionner
          </p>
        </div>
      )}

      {/* Logo/Design info */}
      {design && (editorMode === 'logo' || editorMode === 'design') && (
        <div className={`bg-white p-5 rounded-lg shadow-lg border-2 ${editorMode === 'logo' ? 'border-blue-500' : 'border-purple-500'}`}>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">
              {editorMode === 'logo' ? '📍 Logo ajouté' : '🎨 Design ajouté'}
            </h3>
            <button
              onClick={handleRemoveElement}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-bold"
            >
              Supprimer
            </button>
          </div>

          {design.locked ? (
            <p className="text-sm text-gray-700 mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
              🔒 <strong>Logo verrouillé</strong> - Position et taille fixes pour un rendu professionnel
            </p>
          ) : (
            <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded-lg">
              💡 Utilisez la souris pour <strong>déplacer</strong>, <strong>redimensionner</strong> et <strong>faire pivoter</strong> le design
            </p>
          )}
        </div>
      )}

      {/* Pattern info */}
      {pattern && editorMode === 'pattern' && (
        <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-indigo-500">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">🔲 Pattern ajouté</h3>
            <button
              onClick={handleRemoveElement}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-bold"
            >
              Supprimer
            </button>
          </div>
          <p className="text-sm text-gray-700 mt-3 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            ✨ Le pattern se répète sur tout le t-shirt en arrière-plan
          </p>
        </div>
      )}

      {/* Design picker modal */}
      {showDesignPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sélectionner un design</h2>
            <p className="text-gray-700 mb-4">
              La bibliothèque de designs sera implémentée prochainement.
            </p>
            <button
              onClick={() => setShowDesignPicker(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
