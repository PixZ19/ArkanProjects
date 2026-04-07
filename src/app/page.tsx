import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TechStack from '@/components/landing/TechStack';
import InstallGuide from '@/components/landing/InstallGuide';
import HowItWorks from '@/components/landing/HowItWorks';
import Compatibility from '@/components/landing/Compatibility';
import BlueprintAddons from '@/components/landing/BlueprintAddons';
import FAQ from '@/components/landing/FAQ';
import Sources from '@/components/landing/Sources';
import About from '@/components/landing/About';
import Footer from '@/components/landing/Footer';
import BackgroundEffects from '@/components/landing/BackgroundEffects';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
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
      <BlueprintAddons />

      <div className="section-divider max-w-6xl mx-auto" />
      <FAQ />

      <div className="section-divider max-w-6xl mx-auto" />
      <Sources />

      <div className="section-divider max-w-6xl mx-auto" />
      <About />

      <Footer />
    </main>
  );
}
