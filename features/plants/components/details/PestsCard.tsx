"use client";

import { Pest } from "@/features/pests/types";
import { titleCaseWords } from "@/features/species/utils/format";
import { AlertTriangle, Bug, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";

function formatSeasonLabel(value: string) {
  return titleCaseWords(value.replaceAll("_", " "));
}

export function PestCard({ pest }: { pest: Pest }) {
  const imageSrc = pest.imageUrl || `/images/pests/${pest.id}.jpg`;
  return (
    // <div className="bg-white rounded-xl p-4 border border-rose-200 space-y-4">
    //   <div>
    //     <h5 className="font-semibold text-rose-900">{pest.name}</h5>
    //     <p className="mt-1 text-sm text-gray-700 leading-relaxed">
    //       {pest.description}
    //     </p>
    //   </div>

    //   {pest.riskSeasons?.length ? (
    //     <div>
    //       <p className="text-xs font-medium uppercase tracking-wide text-rose-700 mb-2">
    //         Higher risk
    //       </p>

    //       <div className="flex flex-wrap gap-2">
    //         {pest.riskSeasons.map((season) => (
    //           <span
    //             key={season}
    //             className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-800 border border-rose-200"
    //           >
    //             {formatSeasonLabel(season)}
    //           </span>
    //         ))}
    //       </div>
    //     </div>
    //   ) : null}

    //   {pest.symptoms?.length ? (
    //     <div>
    //       <p className="text-sm font-medium text-gray-900 mb-2">Symptoms</p>
    //       <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
    //         {pest.symptoms.map((item) => (
    //           <li key={item}>{item}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   ) : null}

    //   {pest.treatment?.length ? (
    //     <div>
    //       <p className="text-sm font-medium text-gray-900 mb-2">Treatment</p>
    //       <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
    //         {pest.treatment.map((item) => (
    //           <li key={item}>{item}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   ) : null}

    //   {pest.prevention?.length ? (
    //     <div>
    //       <p className="text-sm font-medium text-gray-900 mb-2">Prevention</p>
    //       <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
    //         {pest.prevention.map((item) => (
    //           <li key={item}>{item}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   ) : null}
    // </div>

    <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm flex flex-col md:flex-row">
      <div className="relative h-48 w-full bg-rose-50">
        <Image
          src={imageSrc}
          alt={pest.imageAlt || pest.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
              <Bug className="h-4 w-4 text-rose-600" />
            </div>

            <h5 className="text-base font-semibold text-rose-900">
              {pest.name}
            </h5>
          </div>

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
                  className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800"
                >
                  {formatSeasonLabel(season)}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="grid md:grid-cols-3 gap-4">
          {pest.symptoms?.length ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Symptoms
              </p>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {pest.symptoms.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {pest.treatment?.length ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-900">
                <Shield className="h-4 w-4" />
                Treatment
              </p>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {pest.treatment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {pest.prevention?.length ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-900">
                <ShieldCheck className="h-4 w-4" />
                Prevention
              </p>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {pest.prevention.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
