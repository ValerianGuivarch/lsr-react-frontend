import React, { useState } from "react";
import styled from "styled-components";
import { FaStar, FaUser } from "react-icons/fa6";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Wizard } from "../../domain/models/hp/Wizard";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";

export function WizardBanner(props: {
  wizard: Wizard;
  poufsouffle: number;
  serdaigle: number;
  gryffondor: number;
  serpentard: number;
}) {
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
  function handleUpdateWizardPV(change: number) {
    if (props.wizard) {
      const newPV = Math.min(
        Math.max(props.wizard.pv + change, 0),
        props.wizard.pvMax,
      );
      ApiL7RProvider.updateWizard(props.wizard.name, {
        pv: newPV,
      })
        .then(() => {
          props.wizard.pv = newPV; // Mise à jour locale après succès de l'API
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des PV :", error);
        });
    }
  }

  return (
    <WizardBannerContainer>
      <BannerContainer>
        <WizardBackground
          src={
            "https://www.avenuedelabrique.com/img/categories/thumbs/harry-potter-banniere_1280x220.jpg"
          }
          alt=""
        />
        <WizardInfoContainer>
          <AvatarContainer>
            <WizardAvatar
              src={"/l7r/" + props.wizard.name + ".png"}
              alt={props.wizard.name}
            />

            <LifePointsContainer>
              <LifePointsButton
                onClick={() => handleUpdateWizardPV(-1)}
                disabled={props.wizard.pv === 0}
              >
                -
              </LifePointsButton>
              <LifePointsDisplayButton>
                {`${props.wizard.pv} / ${props.wizard.pvMax}`}
              </LifePointsDisplayButton>
              <LifePointsButton
                onClick={() => handleUpdateWizardPV(1)}
                disabled={props.wizard.pv === props.wizard.pvMax}
              >
                +
              </LifePointsButton>
            </LifePointsContainer>
          </AvatarContainer>

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
              {props.wizard.name + " " + (props.wizard.familyName ?? "")}
            </WizardName>
            <XPStarsContainer>
              {Array(props.wizard.xp)
                .fill(0)
                .map((_, index) => (
                  <FaStar key={index} color="gold" size={20} />
                ))}
            </XPStarsContainer>
            <WizardSubText>
              {props.wizard.category + " - " + props.wizard.house?.name ?? ""}
            </WizardSubText>
            <WizardText>{props.wizard.baguette}</WizardText>
            <WizardText>{props.wizard.coupDePouce}</WizardText>
            <WizardText>{props.wizard.crochePatte}</WizardText>
          </WizardListInfo>
          <HourglassSection>
            <HourglassWrapper>
              <HourglassImage
                src={"/l7r/HouseSerpentard.png"}
                alt="Slytherin Hourglass"
              />
              <PointsText>{props.serpentard}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src={"/l7r/HouseSerdaigle.png"}
                alt="Ravenclaw Hourglass"
              />
              <PointsText>{props.serdaigle}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src={"/l7r/HouseGryffondor.png"}
                alt="Gryffindor Hourglass"
              />
              <PointsText>{props.gryffondor}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src={"/l7r/HousePoufsouffle.png"}
                alt="Hufflepuff Hourglass"
              />
              <PointsText>{props.poufsouffle}</PointsText>
            </HourglassWrapper>
          </HourglassSection>
        </WizardInfoContainer>
      </BannerContainer>
    </WizardBannerContainer>
  );
}

const WizardBannerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 620px;
  width: 100%;
  height: auto;
`;

const WizardBackground = styled.img`
  width: 800px;
  height: 10rem;
  object-fit: cover;
`;

const WizardInfoContainer = styled.div`
  width: 50rem;
  height: 6rem;
  display: flex;
  flex-direction: row;
  position: absolute;
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
  font-size: 1.2rem;
`;

const WizardSubText = styled.div`
  font-style: italic;
  font-size: 1.1rem;
`;

const WizardText = styled.div`
  text-align: center;
`;

const HourglassSection = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 75%;
  margin-top: 4rem;
`;

const HourglassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const HourglassImage = styled.img`
  width: 60px; /* Ajuste la taille de chaque sablier si nécessaire */
  height: auto;
`;

const PointsText = styled.div`
  position: absolute;
  bottom: 10px;
  font-weight: bold;
  font-size: 1rem;
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Transparence pour meilleure lisibilité */
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  width: 40px; /* Ajuster si nécessaire */
  box-shadow: 0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.25);
`;

const LifePointsDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const XPStarsContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvatarContainer = styled.div`
  margin-top: 4rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WizardAvatar = styled.img`
  width: 150px; /* Taille réduite */
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
`;

const LifePointsContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  top: 3rem;
`;

const LifePointsButton = styled.button`
  font-size: 1rem;
  padding: 0.3rem;
  background-color: #f2f2f2;
  border: 2px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const LifePointsDisplayButton = styled.button`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem;
  background-color: #ccc;
  border: 2px solid #ccc;
  border-radius: 5px;
  cursor: default;
`;
