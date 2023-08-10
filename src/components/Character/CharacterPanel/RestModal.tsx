import React, {useState} from "react";
// @ts-ignore
import s from './style.module.css';
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import ReactModal from "react-modal";
import {Character} from "../../../domain/models/Character";

export function RestModal (props : {
    currentCharacter: Character,
    isOpen: boolean,
    onRequestClose: () => void
}) {
    const [restValue, setRestValue] = useState<number>(props.currentCharacter.rest);
    const closing = () => {
        setRestValue(props.currentCharacter.rest);
        props.onRequestClose();
    }
    return (
        <ReactModal
            className={s.modalEmpirique}
            isOpen={props.isOpen}
            onRequestClose={closing}
            contentLabel="Repos"
        >
            <div className={s.modalEmpiriqueTitle}>Repos : {restValue} / {props.currentCharacter.rest}</div>
            <button onClick={() => {
                if(props.currentCharacter.pv < props.currentCharacter.pvMax && restValue > 0) {
                    setRestValue(restValue - 1);
                    ApiL7RProvider.updateCharacter({
                        ...props.currentCharacter,
                        pv: props.currentCharacter.pv + 1
                    }).then(() => {
                    })
                }
            }}>PV : {props.currentCharacter.pv} / {props.currentCharacter.pvMax}</button>
            <button onClick={() => {
                if(props.currentCharacter.pf < props.currentCharacter.pfMax && restValue > 0) {
                    setRestValue(restValue - 1);
                    ApiL7RProvider.updateCharacter({
                        ...props.currentCharacter,
                        pf: props.currentCharacter.pf + 1
                    }).then(() => {
                    })
                }
            }}>PF : {props.currentCharacter.pf} / {props.currentCharacter.pfMax}</button>
            <button onClick={() => {
                if(props.currentCharacter.pp < props.currentCharacter.ppMax && restValue > 0) {
                    setRestValue(restValue - 1);
                    ApiL7RProvider.updateCharacter({
                        ...props.currentCharacter,
                        pp: props.currentCharacter.pp + 1
                    }).then(() => {
                    })
                }
            }}>PP : {props.currentCharacter.pp} / {props.currentCharacter.ppMax}</button>
            <div className={s.modalEmpiriqueButtonValidation} onClick={closing}>Valider</div>
        </ReactModal>
    )
}