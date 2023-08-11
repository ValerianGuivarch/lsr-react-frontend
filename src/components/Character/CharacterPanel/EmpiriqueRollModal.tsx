import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Character } from '../../../domain/models/Character';
import {
    ModalEmpirique,
    ModalEmpiriqueButtonCancel,
    ModalEmpiriqueButtonValidation,
    ModalEmpiriqueTitle
} from "./ModalStyle";

export interface EmpiriqueRollModalProps {
    currentCharacter: Character;
    isOpen: boolean;
    onRequestClose: () => void;
    sendRoll: (skillName: string, empiriqueRoll?: string) => void;
}

export function EmpiriqueRollModal(props: EmpiriqueRollModalProps) {
    const [empiriqueValue, setEmpiriqueValue] = useState<string>('1d6');

    const handleEmpiriqueValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmpiriqueValue(e.target.value);
    };

    const handleValidationClick = () => {
        props.sendRoll('empirique', empiriqueValue);
        props.onRequestClose();
    };

    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            contentLabel="Jet Empirique"
        >
            <ModalEmpirique>
                <ModalEmpiriqueTitle>Jet Empirique</ModalEmpiriqueTitle>
                <input
                    type="text"
                    value={empiriqueValue}
                    onChange={handleEmpiriqueValueChange}
                />
                <ModalEmpiriqueButtonValidation onClick={handleValidationClick}>
                    Valider
                </ModalEmpiriqueButtonValidation>
                <ModalEmpiriqueButtonCancel onClick={props.onRequestClose}>
                    Annuler
                </ModalEmpiriqueButtonCancel>
            </ModalEmpirique>
        </ReactModal>
    );
};
