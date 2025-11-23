'use client';

import { useCustomizerStore } from '@/store/useCustomizerStore';
import { DesignCanvas, EditorToolbar } from '@/components/DesignEditor';
import { ProductSelector } from '@/components/ProductSelector';

export default function EditorPage() {
  const { tshirt, currentSide, setCurrentSide } = useCustomizerStore();

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
                  className={`py-3 px-4 border-2 rounded-md transition-all font-bold ${
                    currentSide === 'front'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-400 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  Devant
                </button>
                <button
                  onClick={() => setCurrentSide('back')}
                  className={`py-3 px-4 border-2 rounded-md transition-all font-bold ${
                    currentSide === 'back'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-400 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  Arrière
                </button>
              </div>
            </div>
          </div>

          {/* Center - Canvas 2D */}
          <div className="lg:col-span-1">
            <div className="flex justify-center">
              <DesignCanvas color={tshirt.color} />
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Glissez-déposez les éléments pour les positionner. Utilisez les poignées pour redimensionner et faire pivoter.
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
