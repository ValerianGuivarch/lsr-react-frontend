import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../../domain/models/Character";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { L7RApi } from "../../../data/L7RApi";


interface MutableCharacterButtonProps {
    name: string
    nameMax?: string
}
export function MutableCharacterButton(props: MutableCharacterButtonProps) {
    const dispatch = useDispatch();
    const character: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );

    const updateCharacter = (incr: boolean) => {
        console.log("updateCharacter");
        let value = character.getNumberValueByFieldName(props.name);
        if(incr) {
            value=value+1
        } else {
            value=value-1
        }
        character.updateNumberValueByFieldName(props.name, value);
        L7RApi.updateCharacter(character).then((response) => {})
    }

    return(
        <div className={s.main_container}>
            <div className={s.change} onClick={() => updateCharacter(false)}>
                <FaMinus />
            </div>
            <div className={s.button}>
                <div className={s.button_name}>{props.name}</div>
                {props.nameMax ? (
                    <div className={s.button_value}>
                        {character.getNumberValueByFieldName(props.name)} / {character.getNumberValueByFieldName(props.nameMax)}
                    </div>
                ) : (
                    <div className={s.button_value}>{character.getNumberValueByFieldName(props.name)}</div>
                )}
            </div>
            <div className={s.change} onClick={() => updateCharacter(true)}>
                <FaPlus />
            </div>
        </div>
    )
}
