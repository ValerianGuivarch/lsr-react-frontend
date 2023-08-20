import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {useSSECharacterByName} from "../../data/api/useSSECharacterByName";
import {CharacterBanner} from "../../components/Character/CharacterBanner/CharacterBanner";
import styled from "styled-components";
import {Character} from "../../domain/models/Character";
import {Skill} from "../../domain/models/Skill";
import {CharacterButton} from "../../components/Character/CharacterButtons/CharacterButton";

export function CharacterMunitionsSheet() {
    const {characterName} = useParams();
    const [munitionsList, setMunitionsList] = useState<Skill[]>([]);
    const [character, setCharacter] = useState<Character | undefined>(undefined);
    const [munitionMax, setMunitionMax] = useState<number>(0);


    useEffect(() => {
        fetchCharacter().then(() => {});
    }, []);


    async function fetchCharacter() {
        try {
            const character = await ApiL7RProvider.getCharacterByName(characterName ?? '');
            setCharacter(character);
            const munitionsList = character.skills.filter((skill) => skill.soldatCost && skill.soldatCost > 0);
            setMunitionsList(munitionsList);
            const munitionsMax = character.niveau - munitionsList.map((skill) => (skill.limitationMax ?? 0) * skill.soldatCost).reduce((a, b) => a + b, 0);
            setMunitionMax(munitionsMax);
        } catch (error) {
            console.error('Error fetching character:', error);
        }
    }

    useSSECharacterByName({
        name: characterName || '',
        callback: (character: Character) => {
            setCharacter(character)
        }
    });

    async function handleMunitionsEvolution(munitionName: string, evolution: number) {
        const munition = munitionsList.find((munition) => munition.name === munitionName);
        const evolutionEffective = evolution * (munition?.soldatCost ?? 0);
        if(character && munition && munition.limitationMax !== undefined && (munitionMax - evolutionEffective >= 0) && (munition.limitationMax + evolution >= 0)) {
            const limitationMax = munition.limitationMax + evolution;
            await ApiL7RProvider.updateCharacterMunitions(characterName ?? '', munitionName, limitationMax);
            fetchCharacter().then(() => {});
        }
    }
    const handleValidation = () => {
        window.location.href = `/characters/${characterName ?? ''}`;
    };


    return (
        <>
            {(!character) ? (
                <p>Loading...</p>
            ) : (
                <MainContainer>
                    <CharacterBanner
                        character={character}
                    />
                    <MunitionsRemaining>Munitions restantes : {munitionMax}</MunitionsRemaining>
                    {munitionsList.map((munitions) => (
                        <div key={munitions.name}>
                            <CharacterButton
                                cardDisplay={false}
                                name={munitions.name + ' : '+munitions.limitationMax + ' [' + munitions.soldatCost + ']'}
                                onClickDecr={() => {
                                    handleMunitionsEvolution(munitions.name, -1);
                                }}
                                onClickIncr={() => {
                                    handleMunitionsEvolution(munitions.name, 1);
                                }}
                            />
                        </div>
                    ))}
                    <CharacterButton cardDisplay={false} onClickBtn={handleValidation} name={'Valider'}></CharacterButton>

                </MainContainer>

            )}
        </>
    );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw; /* Change the width to 100vw */
  max-width: 800px;
  margin: auto;
  padding: 20px;
`;
const MunitionsRemaining = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;


