import React, {useEffect, useState} from 'react';
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
import styled from "styled-components";
import {BattleState} from "../../domain/models/BattleState";

export function MjSheet() {
    const dispatch = useDispatch();
    const [charactersList, setCharactersList] = useState<{ pnj: string[]; pj: string[]; }>({
        pnj: [],
        pj: []
    });

    async function fetchCharactersList() {
        const list = await ApiL7RProvider.getCharactersByCategory();
        setCharactersList(list);
    }

    async function fetchSessionCharacters() {
        const characters = await ApiL7RProvider.getSessionCharacters();
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
        fetchCharactersList().then(() => {
        });
    }, []);

    useSSECharacters()
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

    const clickOnResist = (stat: "chair"|"esprit"|"essence") => {
        console.log(stat)
        ApiL7RProvider.sendRoll({
            skillName: stat,
            characterName: "jonathan",
            focus: false,
            power: true,
            proficiency: false,
            secret: false,
            bonus: 0,
            malus: 0
        }).then(r => {

        })
    }
    async function onCharacterBattleStateChange(name: string, battleState: BattleState) {
        if (name) {
            await ApiL7RProvider.getCharacterByName(name).then(async (character) => {
                character.battleState = battleState;
                await ApiL7RProvider.updateCharacter(character).then(() => {})
            })
        }
    }
    async function mjAction(idAction: string) {
        if (idAction === 'NEW_TURN') {
            ApiL7RProvider.sendNewTurn().then(() => {});
        } else if (idAction === 'RESET_ROLLS') {
            ApiL7RProvider.resetRolls().then(() => {});
        }
        const selectElement = document.getElementById('mj-action') as HTMLSelectElement;
        selectElement.value = 'action';
    }
    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <MjHeader>
                        <MjHeaderContent>
                            <SelectContainer>
                                <Select id="pj-select" onChange={(e) => onCharacterBattleStateChange(e.target.value, BattleState.ALLIES)}>
                                    <option value="">PJ</option>
                                    {charactersList.pj.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </Select>
                            </SelectContainer>
                            <SelectContainer>
                                <Select id="pnj-select" onChange={(e) => onCharacterBattleStateChange(e.target.value, BattleState.ENNEMIES)}>
                                    <option value="">PNJ</option>
                                    {charactersList.pnj.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </Select>
                            </SelectContainer>
                            <SelectContainer>
                                <Select id="mj-action" onChange={(e) => mjAction(e.target.value)}>
                                    <option key="action" value="action">Action</option>
                                    <option key="Nouveau tour" value={'NEW_TURN'}>Nouveau tour</option>
                                    <option key="Effacer dés" value={'RESET_ROLLS'}>Effacer dés</option>
                                </Select>
                            </SelectContainer>
                        </MjHeaderContent>

                        <MjHeaderContent>
                            <NewTurnButton onClick={() => {
                                ApiL7RProvider.sendNewTurn().then(() => {});
                            }}>
                                Nouveau tour
                            </NewTurnButton>
                        </MjHeaderContent>
                    </MjHeader>
                    <MjPageContainer>
                        <CharactersContainer>
                            {characterViewModels.length > 0 ? (
                                characterViewModels
                                    .filter((characterVM) => characterVM.character.battleState === BattleState.ALLIES)
                                    .map((characterVM, index) => (
                                    <CharacterCard
                                        onChange={
                                        (battleState: BattleState) =>
                                        {onCharacterBattleStateChange(characterVM.character.name, battleState)
                                            .then(() => {})
                                        }}
                                        onDelete={
                                            () =>
                                            {onCharacterBattleStateChange(characterVM.character.name, BattleState.NONE)
                                                .then(() => {})
                                            }}
                                        key={index}
                                        allie={true}
                                        characterViewModel={characterVM}
                                    />
                                ))
                            ) : (
                                <></>
                            )}
                            {characterViewModels.length > 0 ? (
                                characterViewModels
                                    .filter((characterVM) => characterVM.character.battleState === BattleState.ENNEMIES)
                                    .map((characterVM, index) => (
                                        <CharacterCard
                                            onChange={
                                                (battleState: BattleState) =>
                                                {onCharacterBattleStateChange(characterVM.character.name, battleState)
                                                    .then(() => {})
                                                }}
                                            onDelete={
                                                () =>
                                                {onCharacterBattleStateChange(characterVM.character.name, BattleState.NONE)
                                                    .then(() => {})
                                                }}
                                            key={index}
                                            allie={false}
                                            characterViewModel={characterVM}
                                        />
                                ))
                            ) : (
                                <></>
                            )}
                        </CharactersContainer>
                        <RollsContainer>
                            {rolls.map((roll: Roll) => (
                                <div key={roll.id}>
                                    <RollCard roll={roll} clickOnResist={clickOnResist}/>
                                </div>
                            ))}
                        </RollsContainer>
                    </MjPageContainer>
                </div>

            )}
        </>
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


const MjPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 60px;
  height: calc(100vh - 60px); // Prend tout l'espace vertical restant après le header
  left: 0;
  width: 100%;
  background-color: white; // ou toute autre couleur de fond pour éviter que le contenu sous-jacent ne soit visible au travers
  z-index: 90; // Un z-index inférieur au header pour s'assurer qu'il est derrière    

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

const MjHeader = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 100;
  justify-content: space-between;
`;

const MjHeaderContent = styled.div`
    display: flex;
    flex-direction: row;
  padding: 0 10px;
` ;

const SelectContainer = styled.div`
  margin: 10px
`;

const SelectLabel = styled.label`
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 5px;
`;

const NewTurnButton = styled.button`
  height: 29px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
`;

const ResetRollsButton = styled.button`
  height: 29px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
`;