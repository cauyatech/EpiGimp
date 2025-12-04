import { Link } from "react-router-dom";
import Toolbar from "../components/Toolbar/Toolbar";
import ToolPanel from "../components/Toolbar/ToolPanel";
import CanvasEditor from "../components/CanvasEditor/CanvasEditor";
import LayerPanel from "../components/CanvasEditor/LayerPanel";
import Debug from "../components/Debug";

export default function Editor() {
  return (
    <div className="w-full h-screen flex flex-col bg-[#2e2e2e] text-gray-200 overflow-hidden">
      <header className="h-12 border-b border-[#1a1a1a] bg-[#3c3c3c] flex items-center px-3 shadow-md z-20">
        <div className="flex items-center gap-2 w-full">
          <Link to="/" className="text-lg font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-2 py-1 rounded hover:bg-[#505050]">
            <span className="text-xl">🎨</span> 
            <span>EpiGimp</span>
          </Link>
          <div className="h-6 w-px bg-[#1a1a1a] mx-1"></div>
          <Toolbar />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative bg-[#2e2e2e]">
        <ToolPanel />
        
        <div className="flex-1 flex items-center justify-center bg-[#2e2e2e] overflow-auto p-4 relative">
          <CanvasEditor />
        </div>
        <aside className="w-80 border-l border-[#1a1a1a] bg-[#3c3c3c] flex flex-col shadow-2xl z-10">
          <LayerPanel />
        </aside>
      </main>
      
    </div>
  );
}