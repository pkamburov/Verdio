"use client";

import { Pest } from "@/features/pests/types";
import { AccordionItem } from "@/features/species/components/AccordioinItem";
import { titleCaseWords } from "@/features/species/utils/format";
import { AlertTriangle, Bug, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Card } from "../Card";

function formatSeasonLabel(value: string) {
  return titleCaseWords(value.replaceAll("_", " "));
}

export function PestCard({ pest }: { pest: Pest }) {
  const imageSrc = pest.imageUrl || `/images/pests/${pest.id}.jpg`;
  return (
    <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-red-100 hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={pest.imageAlt || pest.name}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end p-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{pest.name}</h3>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <div className="flex items-center gap-2"></div>

          <p className="mt-2 text-sm leading-6 text-gray-700">
            {pest.description}
          </p>
        </div>

        {pest.riskSeasons?.length ? (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-rose-700">
              Higher risk
            </p>

            <div className="flex flex-wrap gap-2">
              {pest.riskSeasons.map((season) => (
                <span
                  key={season}
                  className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-500"
                >
                  {formatSeasonLabel(season)}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex-1 space-y-1">
          {pest.symptoms?.length ? (
            <AccordionItem
              title={
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-900">
                  <AlertTriangle className="h-4 w-4" />
                  Symptoms
                </p>
              }
            >
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {pest.symptoms.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionItem>
          ) : null}

          {pest.treatment?.length ? (
            <AccordionItem
              title={
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-500">
                  <Shield className="h-4 w-4" />
                  Treatment
                </span>
              }
            >
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {pest.treatment.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionItem>
          ) : null}

          {pest.prevention?.length ? (
            <AccordionItem
              title={
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-green-900">
                  <ShieldCheck className="h-4 w-4" />
                  Prevention
                </p>
              }
            >
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {pest.prevention.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionItem>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
