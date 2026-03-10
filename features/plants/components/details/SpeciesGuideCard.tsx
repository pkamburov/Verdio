"use client";

import { Card } from "@/components/ui/Card";
import { Sun } from "lucide-react";
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

export function SpeciesGuideCard({
  plant,
  species,
  speciesLoading,
}: SpeciesGuideCardProps) {
  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <Sun className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-green-900">
                Species Guide
              </h2>
              <p className="text-sm text-neutral-700 mt-1">
                {species?.commonName ?? slugToTitle(plant.speciesId)}{" "}
                {species?.latinName ? (
                  <span className="text-neutral-500 italic">
                    ({species.latinName})
                  </span>
                ) : null}
              </p>
            </div>

            {speciesLoading ? (
              <span className="text-sm text-neutral-500">Loading…</span>
            ) : null}
          </div>

          {/* Quick badges */}
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

            {(species?.sunExposureHours?.min != null ||
              species?.sunExposureHours?.max != null) && (
              <Badge variant="outline">
                Sun:{" "}
                {species.sunExposureHours.min != null &&
                species.sunExposureHours.max != null
                  ? `${species.sunExposureHours.min}–${species.sunExposureHours.max}h`
                  : species.sunExposureHours.min != null
                    ? `≥${species.sunExposureHours.min}h`
                    : species.sunExposureHours.max != null
                      ? `≤${species.sunExposureHours.max}h`
                      : "—"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div>
        <div className="mt-5 space-y-2">
          <details className="rounded-xl border border-green-100 bg-white/40 p-4">
            <summary className="cursor-pointer font-medium text-green-900">
              Overview
            </summary>
            <div className="mt-3 text-sm text-neutral-700 space-y-2">
              <p>{species?.description ?? "—"}</p>
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
                {species?.sunExposureHours?.min != null ||
                species?.sunExposureHours?.max != null
                  ? `${species.sunExposureHours.min ?? "—"}–${species.sunExposureHours.max ?? "—"}h`
                  : "—"}
              </p>
              <p>
                <span className="font-medium text-neutral-900">
                  Your exposure:{" "}
                </span>
                {formatPlantExposure(plant.exposure)}
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
                  {species.commonPests.map((p) => (
                    <li key={p}>{titleCaseWords(p)}</li>
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
            <div className="mt-3 text-sm text-neutral-700 space-y-2">
              <div>
                <span className="font-medium text-neutral-900">Pruning: </span>
                <ul className="list-disc pl-5 space-y-1">
                  {species?.pruningSeasons?.length
                    ? species.pruningSeasons.map((p) => (
                        <li key={p}>{titleCaseWords(p)}</li>
                      ))
                    : "—"}
                </ul>
              </div>
              <div>
                <span className="font-medium text-neutral-900">
                  Repotting:{" "}
                </span>
                <ul className="list-disc pl-5 space-y-1">
                  {species?.repottingSeasons?.length
                    ? species.repottingSeasons.map((r) => (
                        <li key={r}>{titleCaseWords(r)}</li>
                      ))
                    : "—"}
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </Card>
  );
}
