import React, {useState} from "react";
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import ReactModal from "react-modal";
import {Character} from "../../../domain/models/Character";
import {ModalDisplay, ModalEmpiriqueButtonValidation, ModalDisplayTitle} from "./ModalStyle";
import {Apotheose} from "../../../domain/models/Apotheose";

export function ApotheoseModal (props : {
    currentCharacter: Character,
    apotheose: Apotheose
    isOpen: boolean,
    onRequestClose: () => void,
    stopApotheose: () => void
}) {
    const [apotheoseValue, setApotheoseValue] = useState<number>(props.apotheose.cost);

    const closing = () => {
        setApotheoseValue(props.apotheose.cost);
        props.onRequestClose();
    }
    const stop = () => {
        setApotheoseValue(props.apotheose.cost);
        props.stopApotheose();
    }
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={closing}
            contentLabel="Apotheose"
        >
            <ModalDisplay>
                <ModalDisplayTitle>Cout de l'apothéose : {apotheoseValue} / {props.apotheose.cost}</ModalDisplayTitle>
                <button onClick={() => {
                    if(props.currentCharacter.pv > 0 && apotheoseValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pv: props.currentCharacter.pv - 1
                        }).then(() => {
                            setApotheoseValue(apotheoseValue - 1);
                        })
                    }
                }}>PV : {props.currentCharacter.pv} / {props.currentCharacter.pvMax}</button>
                <button onClick={() => {
                    if(props.currentCharacter.pf > 0 && apotheoseValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pf: props.currentCharacter.pf - 1
                        }).then(() => {
                            setApotheoseValue(apotheoseValue - 1);
                        })
                    }
                }}>PF : {props.currentCharacter.pf} / {props.currentCharacter.pfMax}</button>
                <button onClick={() => {
                    if(props.currentCharacter.pp > 0 && apotheoseValue > 0) {
                        ApiL7RProvider.updateCharacter({
                            ...props.currentCharacter,
                            pp: props.currentCharacter.pp - 1
                        }).then(() => {
                            setApotheoseValue(apotheoseValue - 1);
                        })
                    }
                }}>PP : {props.currentCharacter.pp} / {props.currentCharacter.ppMax}</button>
                <ModalEmpiriqueButtonValidation onClick={closing}>Continuer</ModalEmpiriqueButtonValidation>
                <ModalEmpiriqueButtonValidation onClick={stop}>Arrêter</ModalEmpiriqueButtonValidation>
            </ModalDisplay>
        </ReactModal>
    )
}