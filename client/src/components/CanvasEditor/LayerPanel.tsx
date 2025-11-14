export default function LayerPanel() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Layers</h2>

      <ul className="space-y-2">
        <li className="p-2 border rounded bg-gray-50 cursor-pointer">
          Layer 1
        </li>
        <li className="p-2 border rounded bg-gray-50 cursor-pointer">
          Layer 2
        </li>
      </ul>
    </div>
  );
}
