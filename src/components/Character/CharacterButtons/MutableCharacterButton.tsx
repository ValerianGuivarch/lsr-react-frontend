import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {Character} from "../../../domain/models/Character";
import { FaMinus, FaPlus } from 'react-icons/fa';


interface MutableCharacterButtonProps {
    name: string
    selected: boolean
    value?: number
    maxValue?: number
    onClickDecr: (()=> void)
    onClickBtn?: (()=> void)
    onClickIncr: (()=> void)
}
export function MutableCharacterButton(props: MutableCharacterButtonProps) {
    const handleClickIncr = () => {
        props.onClickIncr();
    };
    const handleClickDecr = () => {
        props.onClickDecr();
    }
    const handleClickBtn = () => {
        props.onClickBtn && props.onClickBtn();
    }
    const updateCharacter = (incr: boolean) => {
        console.log("updateCharacter");
        /*let value = character.getNumberValueByFieldName(props.name);
        if(incr) {
            value=value+1
        } else {
            value=value-1
        }
        character.updateNumberValueByFieldName(props.name, value);
        L7RApi.updateCharacter(character).then((response) => {})*/
    }

    return(
        <div className={s.main_container}>
            <div className={s.change} onClick={handleClickDecr}>
                <FaMinus />
            </div>
            <div className={`${s.button_selectable} ${props.selected ? s.button_selected : ""}`} onClick={props.onClickBtn && handleClickBtn}>
                <div className={s.button_name}>{props.name}</div>
                {props.value && (
                    <div>{props.value + (props.maxValue ? (' / ' + props.maxValue) : '')}</div>
                )}
            </div>
            <div className={s.change} onClick={handleClickIncr}>
                <FaPlus />
            </div>
        </div>
    )
}
