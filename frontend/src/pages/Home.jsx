import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import NoticeBar from '../components/NoticeBar'
import NewsAndHelp from '../components/NewsAndHelp'
import DueDatesAndMedia from '../components/DueDatesAndMedia'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <NoticeBar />
      <NewsAndHelp />
      <DueDatesAndMedia />
      <Footer />
    </div>
  )
}

export default Home