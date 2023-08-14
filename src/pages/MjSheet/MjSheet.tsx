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

export function MjSheet() {
    const dispatch = useDispatch();

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

    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <div>
                     <button onClick={() => {
                      ApiL7RProvider.sendNewTurn()
                    }}>
                        New Turn</button>

                    <CharacterCard characterViewModel={characterViewModels[0]}/>
                    <CharacterCard characterViewModel={characterViewModels[1]}/>
                    <div>
                        {rolls.map((roll: Roll) => (
                            <div key={roll.id}>
                                <RollCard roll={roll} clickOnResist={clickOnResist}/>
                            </div>
                        ))}
                    </div>
                </div>

            )}
        </>
    );

}
