import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl mb-6">Bienvenue dans EpiGimp</h1>;
        <Link to="/editor" className="px-4 py-2 bg-blue-600 text-white rounded shadow">
            Viens dessiner
        </Link>
    </div>
  );
}
