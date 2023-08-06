import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';


interface SelectableCharacterButtonProps {
    name: string
    value: number
    maxValue?: number
    state: boolean
    onClick: (()=> void)
}
export function SelectableCharacterButton(props: SelectableCharacterButtonProps) {
    const handleButtonClick = () => {
        props.onClick();
    };
    return (
        <div className={s.main_container}>
            <div
                className={`${s.button_selectable} ${props.state ? s.button_selected : ""}`}
                onClick={handleButtonClick}
            >
                <div>{props.name}</div>
                <div>{props.value + (props.maxValue ? (' / ' + props.maxValue) : '')}</div>
            </div>
        </div>
    );
}
