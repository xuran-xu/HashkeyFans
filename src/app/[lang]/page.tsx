"use client";

import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Roadmap } from "@/components/sections/Roadmap";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Roadmap />
      <Partners />
    </div>
  )
}
