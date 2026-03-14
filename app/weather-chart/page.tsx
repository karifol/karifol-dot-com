"use client";

import { useRef, useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const FT_RANGES = [
  { label: "FT60–180", hours: [60, 84, 108, 132, 156, 180] },
  { label: "FT72–192", hours: [72, 96, 120, 144, 168, 192] },
  { label: "FT84–204", hours: [84, 108, 132, 156, 180, 204] },
  { label: "FT96–216", hours: [96, 120, 144, 168, 192, 216] },
];
const BASE = "https://weather-models.info/latest/images/ecmwf_ens_details/12Z/msm-japan-";

const CHART_TYPES = [
  { label: "500hPa Height", slug: "500z-mean-spread" },
  { label: "Surface Pressure", slug: "mslp-mean-spread" },
  { label: "850hPa Temp + 500hPa Height", slug: "850t-500z-mean" },
  { label: "850hPa Temperature", slug: "850t-mean-spread" },
  { label: "Gust Prob 25kt", slug: "gprob25" },
  { label: "Precip Prob 1mm", slug: "pprob1" },
  { label: "Precip Prob 5mm", slug: "pprob5" },
  { label: "Precip Prob 10mm", slug: "pprob10" },
  { label: "Precip Prob 20mm", slug: "pprob20" },
  { label: "Precip Prob 100mm", slug: "pprob100" },
];

export default function WeatherChartPage() {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState(CHART_TYPES[0].slug);
  const [ftRange, setFtRange] = useState(0);

  const images = FT_RANGES[ftRange].hours.map((h) => `${BASE}${chartType}-${h}.png`);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            gap: 0 !important;
          }
          #print-area > div {
            gap: 0 !important;
          }
          #print-area img {
            border-radius: 0;
          }
          #print-area > div > div {
            border: none !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20 px-4 pb-8">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6 text-center">
            ウェザーチャート
          </h1>

          <div className="flex justify-center items-center gap-3 mb-8">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
            >
              {CHART_TYPES.map((ct) => (
                <option key={ct.slug} value={ct.slug}>
                  {ct.label}
                </option>
              ))}
            </select>
            <select
              value={ftRange}
              onChange={(e) => setFtRange(Number(e.target.value))}
              className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-800 dark:text-zinc-100"
            >
              {FT_RANGES.map((ft, i) => (
                <option key={ft.label} value={i}>
                  {ft.label}
                </option>
              ))}
            </select>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 text-sm font-medium"
            >
              印刷 / PDF保存
            </button>
          </div>

          <div
            id="print-area"
            ref={printAreaRef}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0 aspect-[297/210] flex flex-col justify-center gap-0"
          >
            {/* Row 1 */}
            <div className="flex gap-0 flex-1">
              {images.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Weather chart ${i + 1}`}
                    className="w-[130%] h-[105%] object-cover" style={{ objectPosition: "center 0%" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span class="text-zinc-400 text-sm">Image ${i + 1}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-0 flex-1">
              {images.slice(3, 6).map((src, i) => (
                <div
                  key={i + 3}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Weather chart ${i + 4}`}
                    className="w-[130%] h-[105%] object-cover" style={{ objectPosition: "center 0%" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `<span class="text-zinc-400 text-sm">Image ${i + 4}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
