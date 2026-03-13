"use client";

import { Card } from "@/components/ui/Card";
import { Sprout } from "lucide-react";
import {
  formatEnDate,
  formatPlantExposure,
  slugToTitle,
} from "../../utils/format";
import { Species } from "@/features/species/types";
import { Plant } from "../../types";
import { titleCaseWords } from "@/features/species/utils/format";
import { Badge } from "@/components/ui/Badge";

type SpeciesGuideCardProps = {
  plant: Plant;
  species: Species | null;
  speciesLoading: boolean;
};

function formatSunHours(species: Species | null) {
  const min = species?.light?.sunExposureHours?.min;
  const max = species?.light?.sunExposureHours?.max;

  if (min != null && max != null) return `${min}–${max}h`;
  if (min != null) return `≥${min}h`;
  if (max != null) return `≤${max}h`;

  return "—";
}

function formatTemperatureRange(species: Species | null) {
  const min = species?.temperature?.min;
  const max = species?.temperature?.max;

  if (min != null && max != null) return `${min}°C to ${max}°C`;
  if (min != null) return `≥ ${min}°C`;
  if (max != null) return `≤ ${max}°C`;

  return "—";
}

function renderSeasonList(items?: string[]) {
  if (!items?.length) {
    return <p className="text-sm text-neutral-700">—</p>;
  }

  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item) => (
        <li key={item}>{titleCaseWords(item.replaceAll("_", " "))}</li>
      ))}
    </ul>
  );
}

export function SpeciesGuideCard({
  plant,
  species,
  speciesLoading,
}: SpeciesGuideCardProps) {
  if (speciesLoading) {
    return (
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-green-900">
              Species Guide
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Loading species data...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
          <Sprout className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-green-900">
                Species Guide
              </h2>
              <p className="mt-1 text-sm text-neutral-700">
                {species?.commonName ?? slugToTitle(plant.speciesId)}{" "}
                {species?.latinName ? (
                  <span className="text-neutral-500 italic">
                    ({species.latinName})
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {species?.indoorOutdoor ? (
              <Badge variant="outline">
                {species.indoorOutdoor === "both"
                  ? "Indoor / Outdoor"
                  : species.indoorOutdoor === "indoor"
                    ? "Indoor"
                    : "Outdoor"}
              </Badge>
            ) : null}

            <Badge variant="outline">Exposure: {formatSunHours(species)}</Badge>

            <Badge variant="outline">
              Temperature: {formatTemperatureRange(species)}
            </Badge>
          </div>

          {species?.description?.short ? (
            <p className="mt-4 text-sm leading-6 text-neutral-700">
              {species.description.short}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Overview
          </summary>
          <div className="mt-3 text-sm text-neutral-700 space-y-2">
            <p>{species?.description?.full ?? "—"}</p>

            <p>
              <span className="font-medium text-neutral-900">
                Optimal positioning:{" "}
              </span>
              {species?.optimalPositioning?.length
                ? species.optimalPositioning.join(", ")
                : "—"}
            </p>
          </div>
        </details>

        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Light
          </summary>
          <div className="mt-3 text-sm text-neutral-700 space-y-2">
            <p>
              <span className="font-medium text-neutral-900">
                Recommended sun hours:{" "}
              </span>
              {formatSunHours(species)}
            </p>

            <p>
              <span className="font-medium text-neutral-900">
                Your exposure:{" "}
              </span>
              {formatPlantExposure(plant.exposure)}
            </p>

            <p>
              <span className="font-medium text-neutral-900">Notes: </span>
              {species?.light?.notes ?? "—"}
            </p>
          </div>
        </details>

        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Temperature
          </summary>
          <div className="mt-3 text-sm text-neutral-700 space-y-2">
            <p>
              <span className="font-medium text-neutral-900">
                Recommended range:{" "}
              </span>
              {formatTemperatureRange(species)}
            </p>

            <p>
              <span className="font-medium text-neutral-900">Notes: </span>
              {species?.temperature?.notes ?? "—"}
            </p>
          </div>
        </details>

        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Watering
          </summary>
          <div className="mt-3 text-sm text-neutral-700 space-y-2">
            <p>
              <span className="font-medium text-neutral-900">Rule: </span>
              {species?.watering?.rule ?? "—"}
            </p>

            <p>
              <span className="font-medium text-neutral-900">Notes: </span>
              {species?.watering?.notes ?? "—"}
            </p>

            <p>
              <span className="font-medium text-neutral-900">
                Last watered:{" "}
              </span>
              {formatEnDate(plant.lastWatered)}
            </p>
          </div>
        </details>

        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Common pests
          </summary>
          <div className="mt-3 text-sm text-neutral-700">
            {species?.commonPests?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {species.commonPests.map((pestId) => (
                  <li key={pestId}>
                    {titleCaseWords(pestId.replaceAll("_", " "))}
                  </li>
                ))}
              </ul>
            ) : (
              "—"
            )}
          </div>
        </details>

        <details className="rounded-xl border border-green-100 bg-white/40 p-4">
          <summary className="cursor-pointer font-medium text-green-900">
            Seasonal care
          </summary>
          <div className="mt-3 text-sm text-neutral-700 space-y-4">
            <div>
              <p className="font-medium text-neutral-900">Pruning</p>
              <div className="mt-1">
                {renderSeasonList(species?.pruningSeasons)}
              </div>
              <p className="mt-2">{species?.pruningNotes ?? "—"}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-900">Repotting</p>
              <div className="mt-1">
                {renderSeasonList(species?.repottingSeasons)}
              </div>
              <p className="mt-2">{species?.repottingNotes ?? "—"}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-900">Fertilizing</p>
              <div className="mt-1">
                {renderSeasonList(species?.fertilizingSeasons)}
              </div>
              <p className="mt-2">{species?.fertilizingNotes ?? "—"}</p>
            </div>
          </div>
        </details>
      </div>
    </Card>
  );
}
