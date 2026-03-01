import { useEffect, useState } from "react";
import { listSpecies } from "./api";
import type { Species } from "../species/types";

export function useSpecies() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    listSpecies().then((data) => {
      if (!mounted) return;
      setSpecies(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { species, loading };
}
