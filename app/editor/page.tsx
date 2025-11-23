'use client';

import { useState } from 'react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { ThreeScene } from '@/components/ThreeScene';
import { DesignCanvas, EditorToolbar } from '@/components/DesignEditor';
import { ProductSelector } from '@/components/ProductSelector';
import { PrintSide } from '@/types';

export default function EditorPage() {
  const { tshirt, currentSide, setCurrentSide } = useCustomizerStore();
  const [view, setView] = useState<'2d' | '3d'>('2d');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              T-Shirt Customizer
            </h1>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Ajouter au panier
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Product selection */}
          <div className="space-y-6">
            <ProductSelector />

            {/* Side toggle */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Zone d'impression
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentSide('front')}
                  className={`py-2 px-4 border-2 rounded-md transition-all font-medium ${
                    currentSide === 'front'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Devant
                </button>
                <button
                  onClick={() => setCurrentSide('back')}
                  className={`py-2 px-4 border-2 rounded-md transition-all font-medium ${
                    currentSide === 'back'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Arrière
                </button>
              </div>
            </div>
          </div>

          {/* Center - Canvas/3D view */}
          <div className="lg:col-span-1">
            {/* View toggle */}
            <div className="mb-4 flex justify-center gap-2">
              <button
                onClick={() => setView('2d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === '2d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Vue 2D (Édition)
              </button>
              <button
                onClick={() => setView('3d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === '3d'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Vue 3D (Aperçu)
              </button>
            </div>

            {/* Canvas or 3D scene */}
            <div className="flex justify-center">
              {view === '2d' ? (
                <DesignCanvas />
              ) : (
                <div className="w-full h-[500px]">
                  <ThreeScene color={tshirt.color} currentSide={currentSide} />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              {view === '2d'
                ? 'Glissez-déposez les éléments pour les positionner. Utilisez les poignées pour redimensionner et faire pivoter.'
                : 'Utilisez la souris pour faire pivoter le t-shirt et voir le rendu 3D.'}
            </p>
          </div>

          {/* Right sidebar - Editor toolbar */}
          <div>
            <EditorToolbar />
          </div>
        </div>
      </div>
    </div>
  );
}
