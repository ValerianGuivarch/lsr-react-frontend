import React, {useState} from "react";
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import ReactModal from "react-modal";
import {Character} from "../../../domain/models/Character";
import {ModalDisplay, ModalEmpiriqueButtonValidation, ModalDisplayTitle} from "./ModalStyle";

export function LongRestModal (props : {
    currentCharacter: Character,
    isOpen: boolean,
    onRequestClose: () => void
}) {
    const [longRestValue, setLongRestValue] = useState<number>(props.currentCharacter.longRest);

    const closing = () => {
        setLongRestValue(props.currentCharacter.longRest);
        props.onRequestClose();
    }
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={closing}
            contentLabel="Repos Long"
        >
            <ModalDisplay>
                <ModalDisplayTitle>Repos : {longRestValue} / {props.currentCharacter.longRest}</ModalDisplayTitle>
                <button onClick={() => {
                    if(props.currentCharacter.pv > 0 && longRestValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pv: props.currentCharacter.pv - 1
                        }).then(() => {
                            setLongRestValue(longRestValue - 1);
                        })
                    }
                }}>PV : {props.currentCharacter.pv} / {props.currentCharacter.pvMax}</button>
                <button onClick={() => {
                    if(props.currentCharacter.pf > 0 && longRestValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pf: props.currentCharacter.pf - 1
                        }).then(() => {
                            setLongRestValue(longRestValue - 1);
                        })
                    }
                }}>PF : {props.currentCharacter.pf} / {props.currentCharacter.pfMax}</button>
                <button onClick={() => {
                    if(props.currentCharacter.pp > 0 && longRestValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pp: props.currentCharacter.pp - 1
                        }).then(() => {
                            setLongRestValue(longRestValue - 1);
                        })
                    }
                }}>PP : {props.currentCharacter.pp} / {props.currentCharacter.ppMax}</button>
                <ModalEmpiriqueButtonValidation onClick={closing}>Valider</ModalEmpiriqueButtonValidation>
            </ModalDisplay>
        </ReactModal>
    )
}