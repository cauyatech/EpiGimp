import { Link } from "react-router-dom";
import Toolbar from "../components/Toolbar/Toolbar";
import CanvasEditor from "../components/CanvasEditor/CanvasEditor";
import LayerPanel from "../components/CanvasEditor/LayerPanel";

export default function Editor() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <header className="h-16 border-b bg-white flex items-center px-6 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            EpiGimp
          </Link>
          <div className="h-8 w-px bg-gray-300 mx-2"></div>
          <Toolbar />
        </div>
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Canvas section */}
        <div className="flex-1 flex items-center justify-center bg-gray-200">
          <CanvasEditor />
        </div>

        {/* Layers panel */}
        <aside className="w-64 border-l bg-white p-4 overflow-auto">
          <LayerPanel />
        </aside>
      </main>
    </div>
  );
}
