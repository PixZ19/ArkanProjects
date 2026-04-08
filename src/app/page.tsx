import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TechStack from '@/components/landing/TechStack';
import InstallGuide from '@/components/landing/InstallGuide';
import HowItWorks from '@/components/landing/HowItWorks';
import Compatibility from '@/components/landing/Compatibility';
import FAQ from '@/components/landing/FAQ';
import About from '@/components/landing/About';
import Footer from '@/components/landing/Footer';
import BackgroundEffects from '@/components/landing/BackgroundEffects';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BackgroundEffects />
      <Navbar />
      <Hero />

      <div className="section-divider max-w-6xl mx-auto" />
      <Features />

      <div className="section-divider max-w-6xl mx-auto" />
      <TechStack />

      <div className="section-divider max-w-6xl mx-auto" />
      <InstallGuide />

      <div className="section-divider max-w-6xl mx-auto" />
      <HowItWorks />

      <div className="section-divider max-w-6xl mx-auto" />
      <Compatibility />

      <div className="section-divider max-w-6xl mx-auto" />
      <FAQ />

      <div className="section-divider max-w-6xl mx-auto" />
      <About />

      <Footer />
    </main>
  );
}
