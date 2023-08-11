import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../domain/models/Character";
import {CharacterPanel} from "../Character/CharacterPanel/CharacterPanel";

export function CharacterCard(props : {
    characterName: string
}) {
    const dispatch = useDispatch();
    // @ts-ignore
    const currentCharacter: Character = useSelector((store) => store.CHARACTER.character);

    return (
        <CardContainer>
            <TitleContainer>
                <ProfilePicture src={currentCharacter.picture} alt="Profile Picture" />
                <CharacterName>{currentCharacter.name}</CharacterName>
            </TitleContainer>
            <CharacterPanel cardDisplay={true}/>
        </CardContainer>
)
}


const CardContainer = styled.div`
  border: 1px solid #333;
  border-radius: 20px;
  padding: 4px;
  margin: 4px;
  max-width: 200px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border-bottom: 1px solid #333;
`;

const ProfilePicture = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
`;

const CharacterName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;
