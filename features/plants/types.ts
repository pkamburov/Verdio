export type Plant = {
  id: string;
  name: string;
  speciesId: string;
  isIndoor: boolean;
  exposure?: string | null;
  creeatedAt: number;
};

export type PlantCreateInput = {
  name: string;
  speciesId: string;
  isIndoor: boolean;
  exposure?: string | null;
};
