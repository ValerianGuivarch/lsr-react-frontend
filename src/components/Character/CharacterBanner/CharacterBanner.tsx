import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGun, FaPenToSquare, FaPeopleGroup } from 'react-icons/fa6';
import { Character } from '../../../domain/models/Character';
import {IconType} from "react-icons";
import { Classe } from '../../../domain/models/Classe';

export function CharacterBanner(props: {
    character: Character;
}) {
    const [isButtonsVisible, setIsButtonsVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsButtonsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsButtonsVisible(false);
    };

    return (
        <CharacterBannerBox>
            <CharacterBackground src={props.character.background} alt="Background" />
            <CharacterBannerContainer>
                {props.character.apotheoseName ? (
                    <CharacterAvatar src={props.character.pictureApotheose} alt="Avatar" />
                ) : (
                    <CharacterAvatar src={props.character.picture} alt="Avatar" />
                )}
                <CharacterListInfo
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {isButtonsVisible && (
                        <ButtonsContainer>
                        <EditCharacterIcon
                            icon={FaPenToSquare}
                            onClick={() => {
                                window.location.href = `/characters/${props.character.name}/edit`;
                            }}
                        />
                        <EditCharacterIcon
                            icon={FaPeopleGroup}
                            onClick={() => {
                                console.log(props.character.controlledBy);
                                if(props.character.controlledBy) {
                                    window.location.href = `/characters/${props.character.controlledBy}/invocation`;
                                } else {
                                    window.location.href = `/characters/${props.character.name}/invocation`;
                                }
                    }}
                />
                            {props.character.classe.name === "soldat" && (
                                <EditCharacterIcon
                                    icon={FaGun}
                                    onClick={() => {
                                        window.location.href = `/characters/${props.character.name}/munitions`;
                                    }}
                                />
                            )}
                        </ButtonsContainer>
                    )}
                    <CharacterName>
                        {Character.getDisplayNameAndDescription(props.character)}
                    </CharacterName>
                    <CharacterInfo>Lux: {props.character.lux}</CharacterInfo>
                    <CharacterInfo>Umbra: {props.character.umbra}</CharacterInfo>
                    <CharacterInfo>Secunda: {props.character.secunda}</CharacterInfo>
                </CharacterListInfo>
            </CharacterBannerContainer>
        </CharacterBannerBox>
    );
}


const CharacterBannerBox = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 800px;
  width: 100%;
    height: auto;
`;

const CharacterBackground = styled.img`
  width: 100%;
  height: 8rem;
  object-fit: cover;
`;

const CharacterBannerContainer = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  position: absolute;
`;

const CharacterAvatar = styled.img`
  width: 6rem;
  height: 6rem;
  margin: 1rem;
  border-radius: 50%;
  border: 3px solid #fff;
`;

const CharacterListInfo = styled.div`
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

interface EditCharacterIconProps {
    icon: IconType;
    onClick?: () => void; // Add the onClick prop here
}

const EditCharacterIcon = styled(({ icon: Icon, ...props }: EditCharacterIconProps) => <Icon {...props} />)`
  padding: 0.5rem;
  margin-top: 0;
  border-radius: 0.5rem;
  background-color: #ccc;
`;

const CharacterName = styled.div`
  font-weight: bold;
`;

const CharacterInfo = styled.div`
  /* Ajoutez les styles CSS nécessaires */
`;