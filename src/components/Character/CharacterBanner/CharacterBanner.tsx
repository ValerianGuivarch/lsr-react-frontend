// @ts-ignore
import s from './style.module.css';
import { useSelector } from "react-redux";
import React, { useState } from "react";
import {Character} from "../../../domain/models/Character";
import {FaPenToSquare} from 'react-icons/fa6';

const CharacterBanner: React.FC = () => {
    const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsEditButtonVisible(true);
    };
    const handleMouseLeave = () => {
        setIsEditButtonVisible(false);
    };
        // @ts-ignore
    const character: Character = useSelector((store) => store.CHARACTER.character);
    return (
        <div className={s.characterBannerBox}>

            <img src={character.background} alt="Background" className={s.characterBackground}/>
            <div className={s.characterBanner}>
                <img src={character.picture} alt="Avatar" className={s.characterAvatar}/>
                <div className={s.characterListInfo}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}>
                    {isEditButtonVisible && (
                        <FaPenToSquare className={s.editCharacter} onClick={
                            () => {
                                window.location.href = `/characters/${character.name}/edit`;
                            }
                        }/>
                    )}
                   <div className={s.characterName}>{Character.getDisplayNameAndDescription(character)}</div>
                   <div className={s.characterInfo}>Lux: {character.lux}</div>
                   <div className={s.characterInfo}>Umbra: {character.umbra}</div>
                   <div className={s.characterInfo}>Secunda: {character.secunda}</div>
                </div>
            </div>
        </div>
    );
};

export default CharacterBanner;