import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../../domain/models/Character";
import {L7RApi} from "../../../data/L7RApi";

interface UnmutableCharacterButtonProps {
    name: string
    nameMax?: string
    skillName?: string
}
export function UnmutableCharacterButton(props: UnmutableCharacterButtonProps) {
    const dispatch = useDispatch();
    const character: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );

    const handleClick = () => {
        if(props.skillName)
            L7RApi.sendRoll(props.skillName, character.name).then(r => {}); // Appeler la méthode sendRoll() de L7RApi avec les paramètres skill et characterName
    };

    return(
        <div className={s.main_container}>
            <div className={s.button} onClick={handleClick}>
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
