export function Placeholder({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <p className="mb-3 text-sm font-semibold text-slate-700">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-500">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
