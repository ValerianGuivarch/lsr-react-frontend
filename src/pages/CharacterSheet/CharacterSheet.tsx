import React, {useEffect, useState} from 'react';
// @ts-ignore
import s from './style.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {L7RApi} from "../../data/L7RApi";
import {setCharacter} from "../../data/store/character-slice";
import CharacterBanner from "../../components/Character/CharacterBanner/CharacterBanner";
import CharacterNotes from "../../components/Character/CharacterNotes/CharacterNotes";
import {MutableCharacterButton} from "../../components/Character/CharacterButtons/MutableCharacterButton";
import {UnmutableCharacterButton} from "../../components/Character/CharacterButtons/UnmutableCharacterButton";

export function CharacterSheet() {
    const dispatch = useDispatch();
    const { characterName } = useParams();
    async function fetchCurrentCharacter() {
        const currentCharacter = await L7RApi.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacter(currentCharacter));
    }

    useEffect(() => {
        fetchCurrentCharacter().then(r => {});
    }, []);

    const loading: boolean = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.loading
    );
    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className={s.main_container}>
                    <CharacterBanner/>
                    <CharacterNotes/>
                    <div>
                    <UnmutableCharacterButton name={"chair"}/>
                    <MutableCharacterButton name={"pv"} nameMax={"pvMax"}/>
                    <MutableCharacterButton name={"bonus"}/>
                    </div>
                    <MutableCharacterButton name={"pf"} nameMax={"pfMax"}/>
                    <br/>
                    <MutableCharacterButton name={"pp"} nameMax={"ppMax"}/>
                    <MutableCharacterButton name={"malus"}/>
                    <MutableCharacterButton name={"dettes"}/>
                </div>
            )}
        </>
    );
}
