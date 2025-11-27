import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        {/* Logo/Titre */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Epi<span className="text-blue-600">Gimp</span>
          </h1>
        </div>
        <div className="pt-4">
          <Link
            to="/editor"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >Dessine
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🖌️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Outils de dessin</h3>
            <p className="text-sm text-gray-600">
              Pinceau, gomme et formes géométriques
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Gestion de calques</h3>
            <p className="text-sm text-gray-600">
              Organisez votre travail avec des calques
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-2">Personnalisation</h3>
            <p className="text-sm text-gray-600">
              Couleurs et tailles de pinceau ajustables
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
