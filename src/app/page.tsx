import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaveDivider from "@/components/layout/WaveDivider";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import PopularActivities from "@/components/landing/PopularActivities";
import WhyFarMorfX from "@/components/landing/WhyFarMorfX";
import HowToEarnCoins from "@/components/landing/HowToEarnCoins";
import AboutUs from "@/components/landing/AboutUs";
import ForEntrepreneurs from "@/components/landing/ForEntrepreneurs";
import CTABanner from "@/components/landing/CTABanner";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <StatsBar />

        <WaveDivider fill="#4A2E1C" />
        <PopularActivities />

        <WaveDivider fill="#3D2817" />
        <WhyFarMorfX />

        <WaveDivider fill="#4A2E1C" />
        <HowToEarnCoins />

        <WaveDivider fill="#3D2817" />
        <AboutUs />

        <WaveDivider fill="#4A2E1C" />
        <ForEntrepreneurs />

        <WaveDivider fill="#E8B547" />
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
