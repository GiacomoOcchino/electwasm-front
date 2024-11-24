import Image from "next/image";
import HeroSection from "../components/HeroSection";
import EducationSection from "../components/EducationSection";
import HowItWorks from "../components/HowItWorks";
import ResultsTimer from "../components/ResultsTimer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      {/* <ResultsTimer /> */}
      <EducationSection />
    </>
  );
}
