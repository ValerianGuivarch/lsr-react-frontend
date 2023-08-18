import React from 'react';
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";
import {FaSyncAlt, FaTrashAlt} from 'react-icons/fa';
import {BattleState} from "../../domain/models/BattleState";
import {CharacterPanel} from "../Character/CharacterPanel/CharacterPanel";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {setStateForCharacter} from "../../data/store/character-slice";

export function CharacterCard(props: {
    characterViewModel: CharacterViewModel,
    allie: boolean,
    onChange?: (battleState: BattleState) => void,
    onDelete?: () => void
}) {
    const dispatch = useDispatch();

    const handleSelection = () => {
        dispatch(setStateForCharacter({
                characterName: props.characterViewModel.character.name,
                characterState: {
                    ...props.characterViewModel.state,
                    selected: !props.characterViewModel.state.selected
                }
            }
        ));
    }
    return (
        <CardContainer selected={props.characterViewModel.state.selected}>
            <TitleContainer allie={props.allie}>
                <ProfilePicture src={props.characterViewModel.character.picture}
                                alt="Profile Picture"
                                onClick={handleSelection}
                                selected={props.characterViewModel.state.selected}
                />
                <CharacterName  onClick={handleSelection} >{props.characterViewModel.character.name}</CharacterName>
                {props.onChange && <IconWrapper onClick={
                    () => {
                        props.onChange && props.onChange(props.allie ? BattleState.ENNEMIES : BattleState.ALLIES)
                    }}>
                    <FaSyncAlt size={14}/></IconWrapper>}
                {props.onDelete && <IconWrapper onClick={props.onDelete}><FaTrashAlt size={14}/></IconWrapper>}
            </TitleContainer>
            <CharacterPanel cardDisplay={true} characterViewModel={props.characterViewModel}/>
        </CardContainer>
    )
}


const CardContainer = styled.div<{ selected: boolean }>`
  border: 1px solid #333;
  border-radius: 20px;
  padding: 4px;
  margin: 4px;
  width: 200px;
  height: 250px;
  background-color: ${(props) => (props.selected ? '#ddd' : '#fff')};
`;

const TitleContainer = styled.div<{ allie: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border-bottom: 1px solid #333;
  color: ${(props) => (props.allie ? '#008800' : '#bb0000')};
`;

const ProfilePicture = styled.img<{ selected: boolean }>`
  width: ${(props) => (props.selected ? '24px' : '30px')};
  height: ${(props) => (props.selected ? '24px' : '30px')};
  border-radius: 50%;
  margin-right: 8px;
  border: ${(props) => (props.selected ? '3px solid #333' : 'none')};
`;

const CharacterName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  margin-left: 8px;
  cursor: pointer;
`;
