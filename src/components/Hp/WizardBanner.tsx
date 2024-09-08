import React, { useState } from "react";
import styled from "styled-components";
import { FaPenToSquare } from "react-icons/fa6";
import { IconType } from "react-icons";
import { Wizard } from "../../domain/models/hp/Wizard";

export function WizardBanner(props: { wizard: Wizard }) {
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsButtonsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsButtonsVisible(false);
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
              <EditWizardIcon
                icon={FaPenToSquare}
                onClick={() => {
                  window.location.href = `/wizards/${props.wizard.name}/edit`;
                }}
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
  flex-direction: column;
  top: 1rem;
  right: 1rem;
  justify-content: flex-start;
`;

interface EditWizardIconProps {
  icon: IconType;
  onClick?: () => void; // Add the onClick prop here
}

const EditWizardIcon = styled(
  ({ icon: Icon, ...props }: EditWizardIconProps) => <Icon {...props} />,
)`
  padding: 0.25rem;
  margin-top: 0;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: #ccc;
`;

const WizardName = styled.div`
  font-weight: bold;
`;

const WizardInfo = styled.div`
  /* Ajoutez les styles CSS nécessaires */
`;
