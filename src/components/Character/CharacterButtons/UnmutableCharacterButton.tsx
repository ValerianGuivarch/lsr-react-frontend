import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../../domain/models/Character";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { L7RApi } from "../../../data/L7RApi";
interface UnmutableCharacterButtonProps {
    name: string
    nameMax?: string
}
export function UnmutableCharacterButton(props: UnmutableCharacterButtonProps) {
    const dispatch = useDispatch();
    const character: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );

    return(
        <div className={s.main_container}>
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
        </div>
    )
}
