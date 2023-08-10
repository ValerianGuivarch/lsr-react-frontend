// @ts-ignore
import s from "./style.module.css";
import React from "react";

export function Separator(props: { text: string }) {
    return (
        <div className={s.separator}>
            <hr className={s.line}/>
            <span className={s.text}>{props.text}</span>
            <hr className={s.line}/>
        </div>
    );
}