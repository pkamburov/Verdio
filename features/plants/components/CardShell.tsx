export function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
