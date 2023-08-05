import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../../domain/models/Character";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { L7RApi } from "../../../data/L7RApi";


interface SelectableCharacterButtonProps {
    name: string
    nameMax?: string
}
export function SelectableCharacterButton(props: SelectableCharacterButtonProps) {
    const [isSelected, setIsSelected] = React.useState(false);
    const handleButtonClick = () => {
        setIsSelected(!isSelected);
    };

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

    return (
        <div className={s.main_container}>
            <div
                className={`${s.button_selectable} ${isSelected ? s.button_selected : ""}`}
                onClick={handleButtonClick}
            >
                {props.name}
            </div>
        </div>
    );
}
