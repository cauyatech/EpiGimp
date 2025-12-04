/**
 * EditorLayout.tsx
 * Layout principal de l'éditeur avec architecture en 3 colonnes
 * Structure: ToolbarLeft | CanvasWorkspace | LayersPanel
 */

import { Link } from "react-router-dom";
import ToolbarLeft from "./ToolbarLeft";
import CanvasWorkspace from "./CanvasWorkspace";
import LayersPanel from "./LayersPanel";
import TopToolbar from "./TopToolbar";

export default function EditorLayout() {
  return (
    <div className="w-full h-screen flex flex-col bg-[#1e1e1e] text-gray-100 overflow-hidden">
      {/* Header avec logo et toolbar supérieure */}
      <header className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 shadow-lg z-30">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[#2d2d30] transition-colors"
        >
          <span className="text-2xl">🎨</span>
          <span className="text-lg font-bold text-[#bb86fc]">EpiGimp</span>
        </Link>
        
        <div className="h-8 w-px bg-[#3e3e42] mx-4"></div>
        
        <TopToolbar />
      </header>

      {/* Main workspace avec 3 zones */}
      <main className="flex-1 flex overflow-hidden">
        {/* Barre d'outils gauche (verticale) */}
        <aside className="w-20 bg-[#252526] border-r border-[#3e3e42] shadow-xl">
          <ToolbarLeft />
        </aside>

        {/* Zone centrale avec le canvas */}
        <section className="flex-1 bg-[#1e1e1e] overflow-auto">
          <CanvasWorkspace />
        </section>

        {/* Panneau des calques à droite */}
        <aside className="w-80 bg-[#252526] border-l border-[#3e3e42] shadow-xl">
          <LayersPanel />
        </aside>
      </main>
    </div>
  );
}
