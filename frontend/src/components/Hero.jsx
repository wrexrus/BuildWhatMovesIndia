import React from 'react'
import hero from '../assets/hero.png'

const Hero = () => {
  return (
    <div>
      <img
        src={hero}
        alt="Goods and Services Tax portal banner"
        className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[520px]"
      />
    </div>
  )
}

export default Hero