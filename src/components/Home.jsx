import React, { useEffect } from 'react';

import Footer from './Footer';
import CoursesVideos from './homecomponents/CoursesVideos';
import Features from './homecomponents/Features';
import Hero from './homecomponents/Hero';
import Navigation from './homecomponents/Navigation';
import SlickGoTo from './homecomponents/SlickGoTo';
import HowItWorks from './homecomponents/HowItWorks';
import FAQ from './homecomponents/FAQ';
import Counter from './homecomponents/Counter';
import FeedBack from './homecomponents/FeedBack';
import OurDoctors from './homecomponents/ourDoctors';

const Home = () => {
  return (
    <>
      <div className="overflow-hidden">
        <Hero />
        <Features />
        {/* <SlickGoTo/> */}
        {/* <OurSexologist /> */}
        <OurDoctors id="doctorsSection"/>
        <HowItWorks />
        <CoursesVideos />
        <FAQ />
        <Counter />
        <FeedBack />
        <Footer />
      </div>
    </>
  );
};

export default Home;