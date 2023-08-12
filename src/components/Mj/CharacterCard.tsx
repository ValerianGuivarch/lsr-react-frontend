import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../domain/models/Character";
import {CharacterPanel} from "../Character/CharacterPanel/CharacterPanel";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";

export function CharacterCard(props : {
    currentCharacter: Character
}) {

    return (
        <CardContainer>
            <TitleContainer>
                <ProfilePicture src={props.currentCharacter.picture} alt="Profile Picture" />
                <CharacterName>{props.currentCharacter.name}</CharacterName>
            </TitleContainer>
            <CharacterPanel cardDisplay={true} currentCharacter={props.currentCharacter}/>
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
