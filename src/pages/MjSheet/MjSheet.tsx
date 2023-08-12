import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {Character} from "../../domain/models/Character";
import {useSSERolls} from "../../data/api/useSSERolls";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {CharacterCard} from "../../components/Mj/CharacterCard";
import {setCharacters} from "../../data/store/mj-slice";
import {useSSECharacters} from "../../data/api/useSSECharacters";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";

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

    //useSSECharacters()
    useSSERolls();

    const loadingCharacter: boolean = useSelector((store) =>
        // @ts-ignore
        store.MJ.loading
    );
    const session: CharacterViewModel[] = useSelector((store) =>
        // @ts-ignore
        store.MJ.session
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
                <div>
                    <CharacterCard currentCharacter={session[0].character}/>
                    <CharacterCard currentCharacter={session[1].character}/>
                    <div>
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
