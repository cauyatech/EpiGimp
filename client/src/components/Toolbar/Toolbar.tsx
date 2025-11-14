export default function Toolbar() {
  return (
    <div className="flex gap-4">
      <button className="px-3 py-1 bg-white border rounded shadow-sm">
        Move
      </button>
      <button className="px-3 py-1 bg-white border rounded shadow-sm">
        Brush
      </button>
      <button className="px-3 py-1 bg-white border rounded shadow-sm">
        Eraser
      </button>
    </div>
  );
}
