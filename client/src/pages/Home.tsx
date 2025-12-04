import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold">
            <span className="text-gray-100">EpiGimp</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">Éditeur d'images professionnel</p>
        </div>
        <div className="pt-4">
          <Link
            to="/editor"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold rounded-xl shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 hover:shadow-blue-500/50"
          >
            Laisse parler ton imagniation
          </Link>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700 text-center hover:border-blue-500 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🖌️</div>
            <h3 className="font-bold text-gray-100 mb-3 text-lg">Outils de dessin</h3>
            <p className="text-sm text-gray-400">
              Pinceau, gomme et formes géométriques
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700 text-center hover:border-purple-500 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-bold text-gray-100 mb-3 text-lg">Gestion de calques</h3>
            <p className="text-sm text-gray-400">
              Organisez votre travail avec des calques multiples
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-700 text-center hover:border-pink-500 transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-gray-100 mb-3 text-lg">Personnalisation</h3>
            <p className="text-sm text-gray-400">
              Couleurs et tailles ajustables en temps réel
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
