import React, { useState } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa6";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Wizard } from "../../domain/models/hp/Wizard";

export function WizardBanner(props: { wizard: Wizard }) {
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const navigate = useNavigate(); // Hook pour naviguer

  const handleMouseEnter = () => {
    setIsButtonsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsButtonsVisible(false);
  };

  const handleAdvantageClick = () => {
    // Redirection vers la page /hp/update/:wizardName
    navigate(`/hp/update/${props.wizard.name}`);
  };

  return (
    <WizardBannerBox>
      <WizardBackground
        src={
          "https://www.avenuedelabrique.com/img/categories/thumbs/harry-potter-banniere_1280x220.jpg"
        }
        alt=""
      />
      <WizardBannerContainer>
        <WizardAvatar
          src={"/l7r/" + props.wizard.name + ".png"}
          alt={props.wizard.name}
        />
        <WizardListInfo
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isButtonsVisible && (
            <ButtonsContainer>
              <AdvantageIcon
                icon={FaUser}
                title="Avantage"
                onClick={handleAdvantageClick}
              />
            </ButtonsContainer>
          )}
          <WizardName>
            {Wizard.getDisplayNameAndDescription(props.wizard)}
          </WizardName>
        </WizardListInfo>
      </WizardBannerContainer>
    </WizardBannerBox>
  );
}

const WizardBannerBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 600px;
  width: 100%;
  height: auto;
`;

const WizardBackground = styled.img`
  width: 700px;
  height: 8rem;
  object-fit: cover;
`;

const WizardBannerContainer = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  position: absolute;
`;

const WizardAvatar = styled.img`
  width: 8rem;
  height: 6rem;
  margin: 1rem;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
  object-position: center top;
  display: block;
`;

const WizardListInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  padding: 1rem;
  width: 100%;
  height: 100%;
  background-color: #fffa;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.25);
`;

const ButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 1rem;
  right: 1rem;
  justify-content: flex-start;
  gap: 0.5rem;
`;

interface IconProps {
  icon: IconType;
  title?: string;
  onClick?: () => void;
}

// Icône pour l'Avantage
const AdvantageIcon = styled(({ icon: Icon, ...props }: IconProps) => (
  <Icon {...props} />
))`
  padding: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  color: green;
  border-radius: 50%;
  background-color: #d4f7d4;
  cursor: pointer;
  &:hover {
    background-color: #aef0ae;
  }
`;

const WizardName = styled.div`
  font-weight: bold;
`;
