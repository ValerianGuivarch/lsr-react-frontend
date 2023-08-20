import React, {useEffect, useState} from 'react';
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {useSSERolls} from "../../data/api/useSSERolls";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {CharacterState} from "../../domain/models/CharacterState";
import {Character} from "../../domain/models/Character";
import {useSSECharactersControlled} from "../../data/api/useSSECharactersControlled";
import {UtilsRules} from "../../utils/UtilsRules";
import {BattleState} from "../../domain/models/BattleState";
import {CharacterCard} from "../../components/Mj/CharacterCard";

export function CharacterControllingSheet() {
    
    const {characterName} = useParams();
    const [charactersState, setCharactersState] = useState<Map<string,CharacterState>>(new Map<string,CharacterState>());
    const [rolls, setRolls] = useState<Roll[]>([]);
    const [charactersControlled, setCharactersControlled] = useState<Character[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);



    useEffect(() => {
        fetchControlledCharacters().then(() => {
        });
        fetchRolls().then(() => {
        });
    }, []);
    

    async function fetchControlledCharacters() {
        try {
            const characters = await ApiL7RProvider.getControlledCharacters(characterName ? characterName : '');
            for(const character of characters) {
                if(!charactersState.has(character.name)) {
                    const characterState = new CharacterState({character: character});
                    charactersState.set(character.name, characterState);
                    setCharactersState(charactersState);
                }
            }
            setCharactersControlled(characters.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error('Error fetching characters session:', error);
        }
    }

    async function fetchRolls(): Promise<void> {
        try {
            const rolls = await ApiL7RProvider.getRolls();
            setRolls(rolls);
        } catch (error) {
            console.error('Error fetching rolls:', error);
        }
    }


    useSSECharactersControlled({
        name: characterName ? characterName : '',
        callback: (characters: Character[]) => {
            setCharactersControlled(characters.sort((a, b) => a.name.localeCompare(b.name)));
        }
    });

    useSSERolls({callback: (rolls: Roll[]) => {
            setRolls(rolls);
        }});

    async function handleSendRoll(p: { characterName: string, skillName: string, empiriqueRoll?: string }) {
        try {
            const character = charactersControlled.find((character) => character.name === p.characterName);
            const characterState = charactersState.get(p.characterName) as CharacterState;
            if (character) {
                await ApiL7RProvider.sendRoll({
                    skillName: p.skillName,
                    characterName: character.name,
                    focus: characterState.focusActivated,
                    power: characterState.powerActivated,
                    proficiency: Array.from(characterState.proficiencies.values()).some((value) => value),
                    secret: characterState.secret,
                    bonus: characterState.bonus,
                    malus: characterState.malus,
                    empiriqueRoll: p.empiriqueRoll
                });
            }
        } catch (error) {
            console.error('Error sending roll:', error);
        }
    }
    async function handleUpdateState(characterName: string, newState: CharacterState) {
        const newCharactersState = charactersState.set(characterName, newState);
        setCharactersState(newCharactersState);
    }

    async function handleSelectCharacter(characterName: string) {
        if (selectedCharacters.includes(characterName)) {
            setSelectedCharacters(selectedCharacters.filter((name) => name !== characterName));
        } else {
            setSelectedCharacters([...selectedCharacters, characterName]);
        }
    }

    async function handleDeleteCharacter(characterNameToDelete: string) {
        await ApiL7RProvider.deleteCharacter(characterName ?? '', characterNameToDelete);
    }

    async function handleUpdateCharacter(characterName: string, newCharacter: Character) {
        console.log('update character', characterName, newCharacter.pv);
        await ApiL7RProvider.updateCharacter(newCharacter);
    }

    const clickOnSubir = async (p:{roll: Roll, originRoll?: Roll}) => {
        const degats = UtilsRules.getDegats(p.roll, p.originRoll)

        if(p.originRoll) {
            const character = charactersControlled.find((character) => character.name === p.roll.rollerName);
            if(character) {
                await ApiL7RProvider.updateCharacter({
                    ...character,
                    pv: Math.max(character.pv - degats, 0)
                })
            }
        } else {
            for (const character of charactersControlled) {
                if (selectedCharacters.includes(character.name)) {
                    await ApiL7RProvider.updateCharacter({
                        ...character,
                        pv: Math.max(character.pv - degats, 0)
                    })
                }
            }

        }
    }

    const clickOnResist = async (p:{stat: "chair" | "esprit" | "essence", resistRoll: string}) => {
        for (const character of charactersControlled) {
            if (selectedCharacters.includes(character.name)) {
                const state = charactersState.get(character.name) as CharacterState;
                await ApiL7RProvider.sendRoll({
                    skillName: p.stat,
                    characterName: character.name,
                    focus: state.focusActivated,
                    power: state.powerActivated,
                    proficiency: Array.from(state.proficiencies.values()).some((value) => value),
                    secret: state.secret,
                    bonus: state.bonus,
                    malus: state.malus,
                    resistRoll: p.resistRoll
                })
            }
        }
    }
    async function onCharacterBattleStateChange(name: string, battleState: BattleState) {
        if (name) {
            await ApiL7RProvider.getCharacterByName(name).then(async (character) => {
                character.battleState = battleState;
                await ApiL7RProvider.updateCharacter(character).then(() => {})
            })
        }
    }

    return (
        <div>
            <PanelPageContainer>
                <CharactersContainer>
                    {charactersControlled.length > 0 ? (
                        charactersControlled
                            .map((character, index) => (
                                <CharacterCard
                                    key={index}
                                    allie={true}
                                    character={character}
                                    characterState={charactersState.get(character.name) ?? new CharacterState({character: character})}
                                    sendRoll={handleSendRoll}
                                    selected={selectedCharacters.includes(character.name)}
                                    updateCharacter={handleUpdateCharacter}
                                    updateState={handleUpdateState}
                                    onSelect={handleSelectCharacter}
                                    onDelete={character.name === characterName ? undefined : handleDeleteCharacter}
                                />
                            ))
                    ) : (
                        <></>
                    )}
                </CharactersContainer>
                <RollsContainer>
                    {rolls.map((roll: Roll) => (
                        <div key={roll.id}>
                            <RollCard mjDisplay={false} roll={roll} clickOnResist={clickOnResist}  clickOnSubir={clickOnSubir}/>
                        </div>
                    ))}
                </RollsContainer>
            </PanelPageContainer>
        </div>
    );

}

const CharactersContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: flex-start;
  width: 100%;
  overflow-y: auto;
  @media (min-width: 600px) {
    width: 60%;
    border-right: 1px solid #ccc;
  }
`;


const PanelPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  height: calc(100vh - 60px); // Prend tout l'espace vertical restant après le header
  left: 0;
  width: 100%;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;


const RollsContainer = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  overflow-y: auto;
  @media (min-width: 600px) {
    width: 40%;
  }
`;
