import React, {useEffect, useState} from 'react';
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {L7RApi} from "../../data/L7RApi";
import {setCharacter} from "../../data/store/character-slice";
import CharacterBanner from "../../components/Character/CharacterBanner/CharacterBanner";
import CharacterNotes from "../../components/Character/CharacterNotes/CharacterNotes";
import {MutableCharacterButton} from "../../components/Character/CharacterButtons/MutableCharacterButton";
import {UnmutableCharacterButton} from "../../components/Character/CharacterButtons/UnmutableCharacterButton";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {Character} from "../../domain/models/Character";
import {Skill} from "../../domain/models/Skill";

export function CharacterSheet() {
    const dispatch = useDispatch();
    const {characterName} = useParams();

    async function fetchCurrentCharacter() {
        const currentCharacter = await L7RApi.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacter(currentCharacter));
    }

    async function fetchRolls() {
        const rolls = await L7RApi.getRolls();
        dispatch(setRolls(rolls));
    }

    useEffect(() => {
        fetchCurrentCharacter().then(r => {
        });
        fetchRolls().then(r => {
        });
    }, []);

    const loadingCharacter: boolean = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.loading
    );
    const currentCharacter: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );
    const loadingRolls: boolean = useSelector((store) =>
        // @ts-ignore
        store.ROLLS.loading
    );
    const rolls: Roll[] = useSelector((store) =>
        // @ts-ignore
        store.ROLLS.rolls
    );
    function Separator(props: { text: string }) {
        return (
            <div className={s.separator}>
                <hr className={s.line} />
                <span className={s.text}>{props.text}</span>
                <hr className={s.line} />
            </div>
        );
    }
    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <div className={s.main_container}>
                    <CharacterBanner/>
                    <CharacterNotes/>
                    <div className={s.characterBlocks}>
                        <Separator text={"Stats"}/>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <UnmutableCharacterButton name={"chair"}/>
                                <UnmutableCharacterButton name={"esprit"}/>
                                <UnmutableCharacterButton name={"essence"}/>
                            </div>
                        </div>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <MutableCharacterButton name={"pv"} nameMax={"pvMax"}/>
                                <MutableCharacterButton name={"pf"} nameMax={"pfMax"}/>
                                <MutableCharacterButton name={"pp"} nameMax={"ppMax"}/>
                            </div>
                        </div>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <MutableCharacterButton name={"bonus"}/>
                                <MutableCharacterButton name={"malus"}/>
                                <MutableCharacterButton name={"dettes"}/>
                            </div>
                        </div>
                    </div>
                    <div className={s.characterBlocks}>
                            {currentCharacter && currentCharacter.getArcaniqueSkills().length > 0 && (currentCharacter.getArcaniqueSkills().map((skill: Skill) => (
                                <div className={s.main_container_buttons} key={skill.name}>
                                    <Separator text={"Arcanes " + currentCharacter.arcanes + " / " + currentCharacter.arcanesMax}/>
                                    <div className={s.column}>
                                        <div className={s.buttons_row}>
                                            <UnmutableCharacterButton name={skill.name} skillName={skill.name}/>
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                   <div className={s.rolls}>
                    {rolls.map((roll: Roll) => (
                        <RollCard roll={roll}/>
                    ))}
                   </div>
                </div>
            )}
        </>
    );

}
