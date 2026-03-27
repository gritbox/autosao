import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Menu from '../components/Menu';
import Location from '../components/Location';
import Footer from '../components/Footer';

export default function Home() {
  const interiorImage = "/assets/43cbb53dd_generated_ba1847be.png";
  
  const menuImages = [
    { src: "/assets/44efad76b_generated_20a79773.png", alt: "Signature deli sandwich" },
    { src: "/assets/5341eb94f_generated_687cb162.png", alt: "Fresh salad bowl" },
    { src: "/assets/ea25f5c29_generated_f87fb516.png", alt: "Coffee and pastry" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <Hero />
      <About interiorImage={interiorImage} />
      <Menu images={menuImages} />
      <Location />
      <Footer />
    </div>
  );
}