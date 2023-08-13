import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {useSSERolls} from "../../data/api/useSSERolls";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {CharacterCard} from "../../components/Mj/CharacterCard";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";
import {setCharacters} from "../../data/store/character-slice";
import {RootState} from "../../data/store";
import {useSSECharacters} from "../../data/api/useSSECharacters";
import {useSSECharactersControlled} from "../../data/api/useSSECharactersControlled";
import {useParams} from "react-router-dom";
import styled from "styled-components";

export function CharacterControllingSheet() {
    const dispatch = useDispatch();

    const {characterName} = useParams();
    async function fetchSessionCharacters() {
        const characters = await ApiL7RProvider.getControlledCharacters(characterName ? characterName : '');
        dispatch(setCharacters(characters));
    }

    async function fetchRolls(): Promise<void> {
        const rolls = await ApiL7RProvider.getRolls();
        dispatch(setRolls(rolls));
    }

    useEffect(() => {
        fetchSessionCharacters().then(() => {
        });
        fetchRolls().then(() => {
        });
    }, []);

    useSSECharactersControlled({name: characterName ? characterName : ''})
    useSSERolls();

    const loadingCharacter: boolean = useSelector((store: RootState) =>
        store.CHARACTERS.loading
    );
    const characterViewModels: CharacterViewModel[] = useSelector((store: RootState) =>
        store.CHARACTERS.characterViewModels
    );
    const rolls: Roll[] = useSelector((store: RootState) =>
        store.ROLLS.rolls
    );

    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <Container>
                    <CharactersContainer>
                        {characterViewModels.length > 0 ? (
                            characterViewModels.map((characterVM, index) => (
                                <CharacterCard key={index} characterViewModel={characterVM} />
                            ))
                        ) : (
                            <p>No characters available</p>
                        )}
                    </CharactersContainer>
                    <RollsContainer>
                        {rolls.map((roll: Roll) => (
                            <RollCard key={roll.id} roll={roll} />
                        ))}
                    </RollsContainer>
                </Container>
            )}
        </>
    );
}


 const CharactersContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 60%;
    float: left;
    overflow-y: auto;
`;

const RollsContainer = styled.div`
    width: 40%;
    float: left;
    overflow-y: auto;
`;

const Container = styled.div`
    display: flex;
    clear: both;
  width: 100%;
`;