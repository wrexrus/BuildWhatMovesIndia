import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import NoticeBar from '../components/NoticeBar'
import NewsAndHelp from '../components/NewsAndHelp'
import DueDatesAndMedia from '../components/DueDatesAndMedia'

const Home = () => {
  return (
    <div>
      <Hero />
      <NoticeBar />
      <NewsAndHelp />
      <DueDatesAndMedia />
    </div>
  )
}

export default Home