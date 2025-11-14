import Toolbar from "../components/Toolbar/Toolbar";
import CanvasEditor from "../components/CanvasEditor/CanvasEditor";
import LayerPanel from "../components/CanvasEditor/LayerPanel";

export default function Editor() {
  return (
    <div className="w-full h-screen flex flex-col">

      {/* Toolbar */}
      <header className="h-14 border-b bg-gray-100 flex items-center px-4">
        <Toolbar />
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
