"use client";

import Hero from '../components/Hero'
import Roadmap from '../components/Roadmap'
import Partners from '../components/Partners'
// import Subscribe from '../components/Subscribe'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Roadmap />
      <Partners />
      {/* <Subscribe /> */}
    </div>
  )
}
