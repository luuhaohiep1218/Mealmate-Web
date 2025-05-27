import React from "react";
import styled from "styled-components";

const AboutSection = () => {
  return (
    <AboutContainer>
      <AboutTag>ABOUT US</AboutTag>
      <AboutContent>
        <AboutTitle>OUR CULINARY CHRONICLE</AboutTitle>
        <AboutDescription>
          Our journey is crafted with dedication, creativity, and an unrelenting
          commitment to delivering delightful culinary experiences. Join us in
          savoring the essence of every dish and the stories that unfold.
        </AboutDescription>
        <ReadMoreButton>READ MORE</ReadMoreButton>
      </AboutContent>
      <ImageGrid>
        <MainImage>
          <img src="/images/cooking-process.jpg" alt="Cooking process" />
        </MainImage>
        <SideImages>
          <img src="/images/grilled-salmon.jpg" alt="Grilled salmon" />
          <img src="/images/chef-preparing.jpg" alt="Chef preparing food" />
        </SideImages>
      </ImageGrid>
    </AboutContainer>
  );
};

const AboutContainer = styled.section`
  padding: 2rem;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const AboutTag = styled.div`
  display: inline-block;
  background: #ff4b4b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const AboutContent = styled.div`
  max-width: 600px;
  margin-bottom: 2rem;
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const AboutDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ReadMoreButton = styled.button`
  background: none;
  border: 2px solid #333;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainImage = styled.div`
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 15px;
  }
`;

const SideImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  img {
    width: 100%;
    height: calc((400px - 1rem) / 2);
    object-fit: cover;
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    flex-direction: row;

    img {
      width: calc(50% - 0.5rem);
      height: 200px;
    }
  }
`;

export default AboutSection;
