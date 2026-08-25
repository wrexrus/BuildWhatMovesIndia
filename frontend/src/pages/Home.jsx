import React from 'react';
import Hero from '../components/Hero';
import CopilotHeroCard from '../components/CopilotHeroCard';
import NoticeBar from '../components/NoticeBar';
import NewsAndHelp from '../components/NewsAndHelp';
import DueDatesAndMedia from '../components/DueDatesAndMedia';

const Home = () => {
  return (
    <div>
      <Hero />
      {/* Landing Page Copilot Service Card ("Understand. Fix. File.") */}
      <CopilotHeroCard />
      <NoticeBar />
      <NewsAndHelp />
      <DueDatesAndMedia />
    </div>
  );
};

export default Home;