import React, {useEffect} from 'react';
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {setCharacter} from "../../data/store/character-slice";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {Character} from "../../domain/models/Character";
import {useSSERolls} from "../../data/useSSERolls";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import { CharacterPanel } from '../../components/Character/CharacterPanel/CharacterPanel';
import {CharacterCard} from "../../components/Mj/CharacterCard";
import {useSSECharacterByName} from "../../data/useSSECharacterByName";

export function MjSheet() {
    const dispatch = useDispatch();

    async function fetchCurrentCharacter() {
        const currentCharacter = await ApiL7RProvider.getCharacterByName('jonathan');
        dispatch(setCharacter(currentCharacter));
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

    useSSECharacterByName({name: 'jonathan'})
    useSSERolls();

    const loadingCharacter: boolean = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.loading
    );
    const currentCharacter: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );
    const rolls: Roll[] = useSelector((store) =>
        // @ts-ignore
        store.ROLLS.rolls
    );

    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <div className={s.main_container}>
                    <CharacterCard characterName={'jonathan'}/>

                    <div className={s.rolls}>
                        {rolls.map((roll: Roll) => (
                            <div key={roll.id}>
                                <RollCard roll={roll}/>
                            </div>
                        ))}
                    </div>
                </div>

            )}
        </>
    );

}
