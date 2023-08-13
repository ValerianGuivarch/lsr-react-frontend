import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPenToSquare } from 'react-icons/fa6';
import { Character } from '../../../domain/models/Character';

export function CharacterBanner(props: {
    character: Character;
}) {
    const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsEditButtonVisible(true);
    };

    const handleMouseLeave = () => {
        setIsEditButtonVisible(false);
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
                    {isEditButtonVisible && (
                        <EditCharacterIcon
                            onClick={() => {
                                window.location.href = `/characters/${props.character.name}/edit`;
                            }}
                        />
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

const EditCharacterIcon = styled(FaPenToSquare)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem 1rem 0 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ccc;
`;

const CharacterName = styled.div`
  font-weight: bold;
`;

const CharacterInfo = styled.div`
  /* Ajoutez les styles CSS nécessaires */
`;