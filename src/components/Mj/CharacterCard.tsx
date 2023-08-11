import React, {useState} from 'react';
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
    const [pv, setPv] = useState(0);

    const handlePvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPv(Number(e.target.value));
    };
    return (
        <CardContainer>
            <Title>{props.characterName}</Title>
            <CharacterPanel/>
        </CardContainer>
)
}


const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  display: inline-block;
`;

const Label = styled.label`
  margin-right: 8px;
`;

const Input = styled.input`
  width: 50px;
`;
