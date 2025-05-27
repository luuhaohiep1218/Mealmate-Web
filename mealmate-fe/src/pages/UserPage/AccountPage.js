import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";
import SideNavAccount from "../../components/SideNav/SideNavAccount";

const AccountPage = () => {
  const { user } = useMealMate();
  const navigate = useNavigate();

  if (!user) {
    return navigate("/");
  }

  return (
    <PageContainer>
      <SideNavAccount />
      <MainContent>
        <WelcomeTitle>Hi, {user.full_name || "User"}!</WelcomeTitle>

        <ContentGrid>
          <ProfileCard>
            <CardTitle>PROFILE</CardTitle>
            <ProfileInfo>
              <InfoItem>
                <InfoIcon>😊</InfoIcon>
                <span>{user.full_name}</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon>📱</InfoIcon>
                <span>{user.phone || "No phone number added"}</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon>✉️</InfoIcon>
                <span>{user.email}</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon>👤</InfoIcon>
                <span>Role: {user.role}</span>
              </InfoItem>
            </ProfileInfo>
            <EditButton onClick={() => navigate("/account/profile/edit")}>
              Edit Profile
            </EditButton>
          </ProfileCard>

          <SubscriptionCard>
            <CardTitle>SUBSCRIPTION</CardTitle>
            <SubscriptionInfo>
              <h2>Lifesum Basic</h2>
              <p>
                Did you know that you're 4x more likely to lose unwanted weight
                with Lifesum Premium?
              </p>
              <ManageButton onClick={() => navigate("/account/subscription")}>
                Manage Subscription
              </ManageButton>
            </SubscriptionInfo>
          </SubscriptionCard>

          <PromotionCard>
            <PromotionContent>
              <div>
                <h1>50% Off</h1>
                <h3>Your New Premium Subscription</h3>
                <RedeemButton onClick={() => navigate("/subscription/premium")}>
                  REDEEM DISCOUNT
                </RedeemButton>
              </div>
              <TrophyImage>
                <img src="/images/trophy-mascot.png" alt="Trophy Mascot" />
              </TrophyImage>
            </PromotionContent>
          </PromotionCard>
        </ContentGrid>
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
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProfileCard = styled(Card)``;

const SubscriptionCard = styled(Card)``;

const PromotionCard = styled(Card)`
  background: white;
`;

const CardTitle = styled.h3`
  color: #999;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: #333;
`;

const InfoIcon = styled.span`
  font-size: 1.2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const EditButton = styled(Button)`
  background: none;
  border: 2px solid #333;
  color: #333;
  width: 100%;

  &:hover {
    background: #333;
    color: white;
  }
`;

const ManageButton = styled(Button)`
  background: none;
  border: 2px solid #333;
  color: #333;
  width: 100%;

  &:hover {
    background: #333;
    color: white;
  }
`;

const SubscriptionInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const PromotionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const RedeemButton = styled(Button)`
  background: #ff7a5c;
  border: none;
  color: white;

  &:hover {
    background: #ff6347;
  }
`;

const TrophyImage = styled.div`
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export default AccountPage;
