import React, { useState } from "react";
import styled from "styled-components";
import SideNavAccount from "../../components/SideNav/SideNavAccount";
import { BsCalendar3 } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { useMealMate } from "../../context/MealMateContext";
import { useNavigate } from "react-router-dom";

const DailyMenuPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useMealMate();
  const navigate = useNavigate();

  if (!user) {
    return navigate("/");
  }

  const formatDate = (date) => {
    return `Hôm nay, ${date.getDate()} tháng ${date.getMonth() + 1}`;
  };

  const nutritionData = {
    calories: {
      current: 0,
      target: 1674,
      unit: "kcal",
    },
    carbs: {
      current: 0,
      target: 209,
      unit: "g",
    },
    protein: {
      current: 0,
      target: 84,
      unit: "g",
    },
    fat: {
      current: 0,
      target: 56,
      unit: "g",
    },
  };

  const meals = [
    {
      type: "Bữa sáng",
      icon: "🥐",
      calories: "418-586 kcal",
    },
    {
      type: "Bữa trưa",
      icon: "🍱",
      calories: "502-670 kcal",
    },
    {
      type: "Bữa tối",
      icon: "🍽️",
      calories: "653-854 kcal",
    },
  ];

  return (
    <PageContainer>
      <SideNavAccount />
      <MainContent>
        <DateNavigation>
          <NavigationButton>
            <IoIosArrowBack />
          </NavigationButton>
          <DateDisplay>
            <BsCalendar3 />
            <span>{formatDate(currentDate)}</span>
          </DateDisplay>
          <NavigationButton>
            <IoIosArrowForward />
          </NavigationButton>
        </DateNavigation>

        <NutritionOverview>
          <CalorieCircle>
            <CircleContent>
              <span className="current">{nutritionData.calories.current}</span>
              <span className="separator">/</span>
              <span className="target">{nutritionData.calories.target}</span>
              <span className="unit">{nutritionData.calories.unit}</span>
            </CircleContent>
          </CalorieCircle>

          <NutritionGrid>
            <NutritionCard>
              <h3>Tinh bột</h3>
              <ProgressBar
                progress={
                  (nutritionData.carbs.current / nutritionData.carbs.target) *
                  100
                }
              />
              <span>
                {nutritionData.carbs.current}/{nutritionData.carbs.target}
                {nutritionData.carbs.unit}
              </span>
            </NutritionCard>

            <NutritionCard>
              <h3>Chất đạm</h3>
              <ProgressBar
                progress={
                  (nutritionData.protein.current /
                    nutritionData.protein.target) *
                  100
                }
              />
              <span>
                {nutritionData.protein.current}/{nutritionData.protein.target}
                {nutritionData.protein.unit}
              </span>
            </NutritionCard>

            <NutritionCard>
              <h3>Chất béo</h3>
              <ProgressBar
                progress={
                  (nutritionData.fat.current / nutritionData.fat.target) * 100
                }
              />
              <span>
                {nutritionData.fat.current}/{nutritionData.fat.target}
                {nutritionData.fat.unit}
              </span>
            </NutritionCard>
          </NutritionGrid>
        </NutritionOverview>

        <MealsList>
          {meals.map((meal, index) => (
            <MealCard key={index}>
              <MealInfo>
                <MealIcon>{meal.icon}</MealIcon>
                <div>
                  <MealType>{meal.type}</MealType>
                  <MealCalories>Gợi ý: {meal.calories}</MealCalories>
                </div>
              </MealInfo>
              <AddButton>
                <AiOutlinePlus />
              </AddButton>
            </MealCard>
          ))}
        </MealsList>
      </MainContent>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #faf7f5;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const NavigationButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const DateDisplay = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #333;

  svg {
    color: #666;
  }
`;

const NutritionOverview = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const CalorieCircle = styled.div`
  width: 200px;
  height: 200px;
  border: 15px solid #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CircleContent = styled.div`
  text-align: center;

  .current {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
  }

  .separator {
    font-size: 2rem;
    color: #666;
    margin: 0 0.2rem;
  }

  .target {
    font-size: 2rem;
    color: #666;
  }

  .unit {
    display: block;
    color: #999;
    font-size: 1rem;
  }
`;

const NutritionGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NutritionCard = styled.div`
  h3 {
    color: #666;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  span {
    color: #999;
    font-size: 0.9rem;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin-bottom: 0.5rem;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props) => props.progress}%;
    background: #ff4b4b;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const MealsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MealCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const MealInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MealIcon = styled.span`
  font-size: 2rem;
`;

const MealType = styled.h3`
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const MealCalories = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #ff4b4b;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff3333;
  }
`;

export default DailyMenuPage;
