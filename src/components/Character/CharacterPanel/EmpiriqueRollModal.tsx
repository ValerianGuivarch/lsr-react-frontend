import React, {useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import ReactModal from "react-modal";
import {Character} from "../../../domain/models/Character";

export function EmpiriqueRollModal (props : {
    currentCharacter: Character,
    isOpen: boolean,
    onRequestClose: () => void,
    sendRoll: (skillName: string, empiriqueRoll?: string) => void
}) {
    const [empiriqueValue, setEmpiriqueValue] = useState<string>('1d6');
    return (
        <ReactModal
            className={s.modalEmpirique}
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            contentLabel="Jet Empirique"
        >
            <div className={s.modalEmpiriqueTitle}>Jet Empirique</div>
            <input
                type="text"
                value={empiriqueValue}
                onChange={(e) => setEmpiriqueValue(e.target.value)}
            />
            <div className={s.modalEmpiriqueButtonValidation} onClick={() => {
                props.sendRoll('empirique', empiriqueValue);
                props.onRequestClose();
            }}>Valider</div>
            <div className={s.modalEmpiriqueButtonCancel} onClick={props.onRequestClose}>Annuler</div>
        </ReactModal>
    )
}