"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { Species } from "@/features/species/types";

type Props = {
  species: Species[];
  value: string | null;
  onChange: (speciesId: string) => void;
};

export default function SpeciesCombobox({ species, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selected = species.find((s) => s.id === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return species.filter(
      (s) =>
        s.commonName.toLowerCase().includes(q) ||
        s.latinName.toLowerCase().includes(q),
    );
  }, [query, species]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        placeholder="Search species..."
        value={
          selected ? `${selected.commonName} (${selected.latinName})` : query
        }
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // clear selection when typing
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-white shadow-lg">
          {filtered.length === 0 && (
            <div className="p-2 text-sm text-neutral-500">No species found</div>
          )}

          {filtered.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setQuery("");
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left hover:bg-emerald-50"
            >
              <div className="font-medium">{s.commonName}</div>
              <div className="text-xs text-neutral-500">{s.latinName}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
