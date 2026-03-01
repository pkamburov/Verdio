export function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-xl border bg-white px-3 py-2">
      <summary className="cursor-pointer select-none list-none">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-neutral-500">▼</span>
        </div>
      </summary>

      <div className="pt-2">{children}</div>
    </details>
  );
}
