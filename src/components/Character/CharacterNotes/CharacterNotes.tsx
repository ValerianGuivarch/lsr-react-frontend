import React from 'react';
// @ts-ignore
import s from './style.module.css';

export interface CharacterNotesProps {
}
export default function CharacterNotes(props: CharacterNotesProps) {
    return <div className={s.container}>
        <input type="text" className={s.notes}/>
    </div>
}