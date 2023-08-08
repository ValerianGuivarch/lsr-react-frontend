import React from "react";
// @ts-ignore
import s from './style.module.css';

interface UnmutableCharacterButtonProps {
    name: string
    selected?: boolean
    value?: number
    maxValue?: number
    onClick?: (()=> void)
}
export function UnmutableCharacterButton(props: UnmutableCharacterButtonProps) {
    const handleClick = () => {
        props.onClick && props.onClick();
    };

    return(
        <div className={s.main_container}>
            <div className={`${s.button_selectable} ${props.selected ? s.button_selected : ""}`} onClick={props.onClick && handleClick}>
                <div className={s.button_name}>{props.name}</div>
                {props.value && (
                    <div>{props.value + (props.maxValue ? (' / ' + props.maxValue) : '')}</div>
                )}
            </div>
        </div>
    )
}
