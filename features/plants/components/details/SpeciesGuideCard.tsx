"use client";

import { Card } from "@/components/ui/Card";
import {
  BookOpen,
  Sprout,
  Info,
  Sun,
  Thermometer,
  Droplets,
  Bug,
  Sparkles,
  Calendar,
  Scissors,
  Compass,
} from "lucide-react";
import {
  formatPlantExposure,
  getDaysSinceWatered,
  slugToTitle,
} from "../../utils/format";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

import { Species } from "@/features/species/types";
import { Plant } from "../../types";
import { titleCaseWords } from "@/features/species/utils/format";

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
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100 h-auto">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
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

          {species?.description?.short ? (
            <p className="mt-4 text-m leading-6 text-neutral-700">
              {species.description.short}
            </p>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full h-full grid-cols-3 lg:grid-cols-6 xs:grid-cols-1">
          <TabsTrigger value="overview" className="text-sm lg:text-sm">
            <Info className="w-4 h-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="light" className="text-sm lg:text-sm">
            <Sun className="w-4 h-4 mr-1" />
            Light
          </TabsTrigger>
          <TabsTrigger value="temperature" className="text-sm lg:text-sm">
            <Thermometer className="w-4 h-4 mr-1" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="watering" className="text-sm lg:text-sm">
            <Droplets className="w-4 h-4 mr-1" />
            Watering
          </TabsTrigger>
          <TabsTrigger value="pests" className="text-sm lg:text-sm">
            <Bug className="w-4 h-4 mr-1" />
            Pests
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="text-sm lg:text-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Seasonal
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-900 mb-2">
              About This Species
            </h4>
            <div className="text-gray-700 leading-relaxed">
              {species?.description.full}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Optimal Placement
            </h4>
            <div className="text-gray-700 leading-relaxed">
              {species?.optimalPositioning.join(", ")}
            </div>
          </div>
        </TabsContent>

        {/* Light Tab */}
        <TabsContent value="light" className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h4 className="font-semibold text-amber-900 mb-2">
                Recommended Exposure
              </h4>
              <div className="text-gray-700">
                {species?.light.sunExposureHours.min}-
                {species?.light.sunExposureHours.max} hours
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <h4 className="font-semibold text-yellow-900 mb-2">
                Current Exposure
              </h4>
              <p className="text-gray-700">
                {formatPlantExposure(plant.exposure)}
              </p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-900 mb-2">Light Notes</h4>
            <p className="text-gray-700 leading-relaxed">
              {species?.light.notes}
            </p>
          </div>
        </TabsContent>

        {/* Temperature Tab */}
        <TabsContent value="temperature" className="mt-6 space-y-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Recommended Range
            </h4>
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              {formatTemperatureRange(species)}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {species?.temperature.notes}
            </p>
          </div>
        </TabsContent>

        {/* Watering Tab */}
        <TabsContent value="watering" className="mt-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">Watering Rule</h4>
            <p className="text-lg text-gray-900 mb-2">
              {species?.watering.rule}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {species?.watering.notes}
            </p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
            <h4 className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last Watered
            </h4>
            <p className="text-gray-700">
              {getDaysSinceWatered(plant.lastWatered)}
            </p>
          </div>
        </TabsContent>

        {/* Pests Tab */}
        <TabsContent value="pests" className="mt-6">
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
            <h4 className="font-semibold text-rose-900 mb-3 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Common Pests to Watch For
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {species?.commonPests
                ? species?.commonPests.map((pest, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-rose-200 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span className="text-gray-700">
                        {titleCaseWords(pest)}
                      </span>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </TabsContent>

        {/* Seasonal Care Tab */}
        <TabsContent value="seasonal" className="mt-6 space-y-4">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Pruning
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {renderSeasonList(species?.pruningSeasons)}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Repotting
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {renderSeasonList(species?.repottingSeasons)}
            </p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
            <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Fertilizing
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {renderSeasonList(species?.fertilizingSeasons)}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
