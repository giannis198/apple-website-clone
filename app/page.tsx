import Hero from '@/components/Hero'
import Highlights from '@/components/Highlights'
import Navbar from '@/components/Navbar'
import React from 'react'

const HomePage = () => {
  return (
    <section>
      <Navbar />
      <Hero />
      <Highlights />
    </section>
  )
}

export default HomePage
