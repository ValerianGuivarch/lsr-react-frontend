import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {useSSERolls} from "../../data/api/useSSERolls";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import { CharacterPanel } from '../../components/Character/CharacterPanel/CharacterPanel';
import {useSSECharacterByName} from "../../data/api/useSSECharacterByName";
import {CharacterBanner} from "../../components/Character/CharacterBanner/CharacterBanner";
import {CharacterNotes} from "../../components/Character/CharacterNotes/CharacterNotes";
import {setCharacters} from "../../data/store/character-slice";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";
import {RootState} from "../../data/store";
import styled from "styled-components";

export function CharacterSheet() {
    const dispatch = useDispatch();
    const {characterName} = useParams();

    async function fetchCurrentCharacter() {
        const currentCharacter = await ApiL7RProvider.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacters([currentCharacter]));
    }

    async function fetchRolls(): Promise<void> {
        const rolls = await ApiL7RProvider.getRolls();
        dispatch(setRolls(rolls));
    }

    useEffect(() => {
        fetchCurrentCharacter().then(() => {
        });
        fetchRolls().then(() => {
        });
    }, []);

    useSSECharacterByName({
        name: characterName || ''
    });
    useSSERolls();


    const loadingCharacter: boolean = useSelector((store: RootState) =>
        store.CHARACTERS.loading
    );
    const characterViewModel = useSelector((store: RootState) =>
        store.CHARACTERS.characterViewModels.find((characterViewModel: CharacterViewModel) => characterViewModel.character.name === characterName)
    );
    const rolls: Roll[] = useSelector((store: RootState) =>
        store.ROLLS.rolls
    );

    if (!characterViewModel) {
        return <div>Loading...</div>;
    }

    const clickOnResist = (stat: "chair"|"esprit"|"essence", resistRoll: string) => {
        console.log(stat)
        ApiL7RProvider.sendRoll({
            skillName: stat,
            characterName: characterViewModel.character.name,
            focus: characterViewModel.state.focusActivated,
            power: characterViewModel.state.powerActivated,
            proficiency: Array.from(characterViewModel.state.proficiencies.values()).some((value) => value),
            secret: characterViewModel.state.secret,
            bonus: characterViewModel.state.bonus,
            malus: characterViewModel.state.malus,
            resistRoll: resistRoll
        }).then(r => {

        })
    }

    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <MainContainer>
                    <CharacterBanner character={characterViewModel.character}/>
                    <CharacterNotes/>
                    <CharacterPanel cardDisplay={false} characterViewModel={characterViewModel}/>

                    <Rolls>
                        {rolls.map((roll: Roll) => (
                            <div key={roll.id}>
                                <RollCard roll={roll} clickOnResist={clickOnResist}/>
                            </div>
                        ))}
                    </Rolls>
                </MainContainer>
            )}
        </>
    );
}

const MainContainer = styled.div`
`;

const Rolls = styled.div`
`;



