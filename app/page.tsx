import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">T-Shirt Customizer</h1>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Créez votre T-shirt unique
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personnalisez votre t-shirt avec des designs exclusifs et du texte.
            Visualisez le résultat en temps réel avec notre éditeur 3D interactif.
          </p>

          <Link
            href="/editor"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Commencer la personnalisation
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Designs exclusifs</h3>
            <p className="text-gray-700 leading-relaxed">
              Choisissez parmi une bibliothèque de designs professionnels
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Texte personnalisé</h3>
            <p className="text-gray-700 leading-relaxed">
              Ajoutez votre propre texte avec plusieurs polices et couleurs
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vue 3D interactive</h3>
            <p className="text-gray-700 leading-relaxed">
              Visualisez votre création sous tous les angles en temps réel
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Choisissez votre t-shirt</h4>
              <p className="text-sm text-gray-700">Couleur et taille</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Ajoutez des designs</h4>
              <p className="text-sm text-gray-700">Logos ou texte</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Personnalisez</h4>
              <p className="text-sm text-gray-700">Position, taille, couleur</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Commandez</h4>
              <p className="text-sm text-gray-700">Livraison rapide</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/editor"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Créer mon T-shirt maintenant
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2024 T-Shirt Customizer. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
