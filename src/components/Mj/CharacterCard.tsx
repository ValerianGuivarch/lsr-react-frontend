import React from 'react';
import styled from 'styled-components';
import {CharacterPanel} from "../Character/CharacterPanel/CharacterPanel";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";

export function CharacterCard(props : {
    characterViewModel: CharacterViewModel
}) {

    return (
        <CardContainer>
            <TitleContainer>
                <ProfilePicture src={props.characterViewModel.character.picture} alt="Profile Picture" />
                <CharacterName>{props.characterViewModel.character.name}</CharacterName>
            </TitleContainer>
            <CharacterPanel cardDisplay={true} characterViewModel={props.characterViewModel}/>
        </CardContainer>
)
}


const CardContainer = styled.div`
  border: 1px solid #333;
  border-radius: 20px;
  padding: 4px;
  margin: 4px;
  max-width: 200px;
  max-height: 250px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border-bottom: 1px solid #333;
`;

const ProfilePicture = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
`;

const CharacterName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;
