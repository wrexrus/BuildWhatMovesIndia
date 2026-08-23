import React from 'react'
import hero from '../assets/hero.png'

const Hero = () => {
  return (
    <div>
        <img src={hero} className='w-full h-[520px] object-cover'/>
    </div>
  )
}

export default Hero