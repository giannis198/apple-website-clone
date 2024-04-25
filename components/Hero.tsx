'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = () => {
  const heroVideo = '/assets/videos/hero.mp4'
  const smallHeroVideo = '/assets/videos/smallHero.mp4'

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 2 })
    gsap.to('#cta', { opacity: 1, y: -30, delay: 2 })
  }, [])

  return (
    <section className='nav-height relative w-full bg-black'>
      <div className='flex-center h-5/6 w-full flex-col'>
        <p id='hero' className='hero-title'>
          iPhone 15 Pro
        </p>
        <div className='hidden md:block md:w-10/12'>
          <video
            className='pointer-events-none'
            autoPlay
            muted
            loop
            playsInline={true}
          >
            <source src={heroVideo} type='video/mp4' />
          </video>
        </div>
        <div className='w-9/12 md:hidden'>
          <video autoPlay muted loop>
            <source src={smallHeroVideo} type='video/mp4' />
          </video>
        </div>
      </div>
      <div
        id='cta'
        className='flex translate-y-20 flex-col items-center opacity-0'
      >
        <a href='#highlights' className='btn'>
          Buy
        </a>
        <p className='text-xl font-normal'>From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero
