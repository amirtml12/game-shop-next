"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { newsData } from "@/data";

export default function Slider() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative h-64 md:h-96 rounded shadow-2xl overflow-hidden group border border-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={newsData[current].img}
        className="w-full h-full object-cover transition-opacity duration-1000"
        key={current}
        alt={newsData[current].title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#171a21] via-transparent to-transparent p-8 flex flex-col justify-end">
        <h3 className="text-3xl font-bold text-white mb-2">{newsData[current].title}</h3>
        <p className="text-gray-300 text-sm">{newsData[current].desc}</p>
        <div className="absolute top-1/2 flex justify-between w-full px-4 right-0 left-0">
          <button onClick={prev} className="bg-black/30 p-2 rounded-full text-white">
            <ChevronRight />
          </button>
          <button onClick={next} className="bg-black/30 p-2 rounded-full text-white">
            <ChevronLeft />
          </button>
        </div>
      </div>
    </div>
  );
}