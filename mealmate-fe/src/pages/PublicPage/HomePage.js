import React from "react";
import HeroSection from "../../components/HeroSection";
import PaletteSection from "../../components/PaletteSection";
import FeaturedRecipes from "../../components/FeaturedRecipes";
import SectionCard from "../../components/SectionCard";
import AboutSection from "../../components/AboutSection";

// Trang chủ của ứng dụng
const HomePage = () => {
  return (
    <>
      <SectionCard>
        <HeroSection />
      </SectionCard>
      <SectionCard background="#E8F1FF">
        <PaletteSection />
      </SectionCard>
      <SectionCard>
        <FeaturedRecipes />
      </SectionCard>
      <SectionCard>
        <AboutSection />
      </SectionCard>
    </>
  );
};

export default HomePage;
