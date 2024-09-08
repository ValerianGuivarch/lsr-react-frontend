import React, { useState } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa6";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Wizard } from "../../domain/models/hp/Wizard";

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
              {props.wizard.name + " " + (props.wizard.familyName ?? "")}
            </WizardName>
            <WizardSubText>
              {props.wizard.category + " - " + props.wizard.house.name}
            </WizardSubText>
            <WizardText>{props.wizard.baguette}</WizardText>
            <WizardText>{props.wizard.coupDePouce}</WizardText>
            <WizardText>{props.wizard.crochePatte}</WizardText>
          </WizardListInfo>

          <HourglassSection>
            <HourglassWrapper>
              <HourglassImage
                src="https://media.discordapp.net/attachments/1016003962761134142/1282345492944261231/image.png?ex=66df04ce&is=66ddb34e&hm=25f38e609804a2218a326914672e2d019db794ec5e71b99fc98b63c68574d210&=&format=webp&quality=lossless&width=610&height=1132"
                alt="Slytherin Hourglass"
              />
              <PointsText>{props.serpentard}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src="https://media.discordapp.net/attachments/1016003962761134142/1282346562374340699/image.png?ex=66df05cd&is=66ddb44d&hm=7a92731a1f26789a3655d604ed7551c2f8c7d6e6f373468469b4b3c641d0ee9b&=&format=webp&quality=lossless&width=378&height=700"
                alt="Ravenclaw Hourglass"
              />
              <PointsText>{props.serdaigle}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src="https://media.discordapp.net/attachments/1016003962761134142/1282346606330515476/image.png?ex=66df05d7&is=66ddb457&hm=c905881ea831e65e8a5a9e44e57df5bc79a9452410f066b568abf0c4da6b9464&=&format=webp&quality=lossless&width=378&height=700"
                alt="Gryffindor Hourglass"
              />
              <PointsText>{props.gryffondor}</PointsText>
            </HourglassWrapper>
            <HourglassWrapper>
              <HourglassImage
                src="https://media.discordapp.net/attachments/1016003962761134142/1282346717563584604/image.png?ex=66df05f2&is=66ddb472&hm=771d49cfe8e42303b9e11d9cdc738d16eecc1162ddde887182f385ef4f8affe3&=&format=webp&quality=lossless&width=610&height=1132"
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

const WizardAvatar = styled.img`
  width: 18rem;
  height: 8rem;
  margin: 1rem;
  border-radius: 50%;
  border: 2px solid #fff;
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
