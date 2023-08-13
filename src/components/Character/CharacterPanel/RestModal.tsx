import React, {useState} from "react";
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import ReactModal from "react-modal";
import {Character} from "../../../domain/models/Character";
import {ModalDisplay, ModalEmpiriqueButtonValidation, ModalDisplayTitle} from "./ModalStyle";

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
            isOpen={props.isOpen}
            onRequestClose={closing}
            contentLabel="Repos"
        >
            <ModalDisplay>
            <ModalDisplayTitle>Repos : {restValue} / {props.currentCharacter.rest}</ModalDisplayTitle>
            <button onClick={() => {
                if(props.currentCharacter.pv < props.currentCharacter.pvMax && restValue > 0) {
                    ApiL7RProvider.updateCharacter({
                        ...props.currentCharacter,
                        pv: props.currentCharacter.pv + 1
                    }).then(() => {
                        setRestValue(restValue - 1);
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
            <ModalEmpiriqueButtonValidation onClick={closing}>Valider</ModalEmpiriqueButtonValidation>
            </ModalDisplay>
        </ReactModal>
    )
}