import React, {useEffect, useState} from "react";
// @ts-ignore
import s from './style.module.css';

interface UnmutableCharacterButtonProps {
    name: string
    value?: number
    maxValue?: number
    onClick: (()=> void)
}
export function UnmutableCharacterButton(props: UnmutableCharacterButtonProps) {
    const handleClick = () => {
        props.onClick();
    };

    return(
        <div className={s.main_container}>
            <div className={s.button} onClick={handleClick}>
                <div className={s.button_name}>{props.name}</div>
                {props.value && (
                    <div>{props.value + (props.maxValue ? (' / ' + props.maxValue) : '')}</div>
                )}
            </div>
        </div>
    )
}
